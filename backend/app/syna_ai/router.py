from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
import uuid

# ---------------------------------------------------------
# LAZY IMPORTS & UTILS
# ---------------------------------------------------------
# ---------------------------------------------------------
# LAZY IMPORTS & UTILS
# ---------------------------------------------------------
import asyncio
import logging
from app.syna_ai.database import get_db, get_db_context
from app.authentication_onboarding.core.dependencies import get_current_user
from app.authentication_onboarding.models.user import AnyUser

logger = logging.getLogger(__name__)

def get_models_and_utils():
    # Deferred imports to prevent startup DLL conflicts
    from app.syna_ai.models.risk_model import detect_risk_rule
    from app.syna_ai.models.ensemble_risk import predict_risk_ensemble
    from app.syna_ai.models.ml_infer import predict_risk_xgb
    from app.syna_ai.models.temporal_infer import predict_temporal_risk_lstm
    from app.syna_ai.models.semantic_risk import detect_semantic_risk
    from app.syna_ai.gemini_client import get_gemini_response
    from app.syna_ai.crisis_alerts import send_crisis_alerts
    from app.syna_ai.language_processor import detect_language, translate_to_english, clean_for_analysis
    from app.syna_ai.models.mood_logic import save_mood
    from app.syna_ai.privacy import mask_pii

    return {
        "detect_risk_rule": detect_risk_rule,
        "predict_risk_ensemble": predict_risk_ensemble,
        "predict_risk_xgb": predict_risk_xgb,
        "predict_temporal_risk_lstm": predict_temporal_risk_lstm,
        "detect_semantic_risk": detect_semantic_risk,
        "get_gemini_response": get_gemini_response,
        "send_crisis_alerts": send_crisis_alerts,
        "detect_language": detect_language,
        "translate_to_english": translate_to_english,
        "clean_for_analysis": clean_for_analysis,
        "save_mood": save_mood,
        "mask_pii": mask_pii
    }

router = APIRouter(prefix="/syna", tags=["Syna AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatMessageOut(BaseModel):
    id: int
    role: str
    message: str
    risk_level: str
    created_at: str
    conversation_id: Optional[str] = None

class ConversationOut(BaseModel):
    id: str
    title: str
    created_at: str

class ConversationListOut(BaseModel):
    conversations: List[ConversationOut]

class ChatHistoryOut(BaseModel):
    history: List[ChatMessageOut]

def detect_crisis(text: str) -> bool:
    crisis_phrases = ["i want to die", "i feel like dying", "i want to kill myself", "end my life", "don't want to live", "suicide"]
    return any(phrase in text.lower() for phrase in crisis_phrases)

async def run_db_op(op_func):
    """Wrapper to run a DB operation function in a separate thread with its own context."""
    def wrapped_op():
        with get_db_context() as (conn, cursor):
            return op_func(conn, cursor)
    return await asyncio.to_thread(wrapped_op)

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: AnyUser = Depends(get_current_user)
):
    """
    Process a chat message through the Syna AI risk pipeline.
    """
    user_id = str(current_user.id)
    
    # Securely derive role from current_user
    try:
        user_role = current_user.role
        if hasattr(user_role, 'value'):
            user_role = user_role.value
    except (AttributeError, ValueError):
        user_role = "user"  # Fallback

    logger.info(f"💬 SYNA CHAT START - User: {user_id}, Role: {user_role}")
    user_input = request.message
    utils = get_models_and_utils()

    def crisis_check_and_save(conn, cursor):
        # Use masked input for storage per request
        cursor.execute(
            "INSERT INTO chats (user_id, role, message, risk_level, conversation_id) VALUES (?, ?, ?, ?, ?)",
            (user_id, user_role, masked_user_input, "high", conversation_id)
        )
        conn.commit()

    # HANDLE CONVERSATION ID (WhatsApp Style: Single Persistent Thread)
    conversation_id = request.conversation_id
    
    # If no ID provided, try to find the user's primary/last conversation
    if not conversation_id:
        def find_existing_conv(conn, cursor):
            cursor.execute(
                "SELECT id FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
                (user_id,)
            )
            return cursor.fetchone()
        
        existing = await run_db_op(find_existing_conv)
        if existing:
            conversation_id = existing[0]
            logger.info(f"DEBUG: Found existing conversation: {conversation_id}")
        else:
            conversation_id = str(uuid.uuid4())
            logger.info(f"DEBUG: Creating new primary conversation: {conversation_id}")
            def create_conv(conn, cursor):
                cursor.execute(
                    "INSERT INTO conversations (id, user_id, title) VALUES (?, ?, ?)",
                    (conversation_id, user_id, "Syna AI Chat")
                )
                conn.commit()
            await run_db_op(create_conv)
    
    # 0. Initial Masking Preparation
    masked_user_input = utils["mask_pii"](user_input)

    # MULTILINGUAL SUPPORT
    lang_code = utils["detect_language"](user_input)
    text = utils["translate_to_english"](user_input) if lang_code != 'en' else user_input
    text_normalized = text.strip().lower()
    original_normalized = user_input.strip().lower()

    # 1. Check for immediate crisis keywords
    if detect_crisis(text_normalized) or detect_crisis(original_normalized):
        # CRISIS: Save original if high risk for professional follow up, 
        # but user specifically asked for "chats to be masked as well"
        # We'll stick to masking for storage to respect the request.
        await run_db_op(crisis_check_and_save)
        utils["send_crisis_alerts"](user_id, user_role, user_input, risk_source="keyword_match")
        return {
            "risk_level": "high", "crisis": True, "trigger_appointment_popup": True,
            "reply": "I hear you, and I'm really glad you shared this with me. Take a slow, deep breath with me - you're safe right now."
        }

    # PSYNOVA AI RISK PIPELINE
    try:
        # Fetch mood trend
        def fetch_context(conn, cursor):
            cursor.execute("SELECT mood_score FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 5", (user_id,))
            mood_rows = cursor.fetchall()
            
            cursor.execute("SELECT risk_level FROM chats WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (user_id,))
            risk_rows = cursor.fetchall()

            cursor.execute("SELECT message FROM chats WHERE user_id = ? ORDER BY created_at DESC LIMIT 4", (user_id,))
            msg_rows = cursor.fetchall()
            return mood_rows, risk_rows, msg_rows

        mood_rows, risk_rows, msg_rows = await run_db_op(fetch_context)
        logger.info(f"DEBUG: Context fetched. Mood count: {len(mood_rows)}, Hist msg count: {len(msg_rows)}")
        
        mood_trend = sum([m[0] for m in mood_rows]) / len(mood_rows) if mood_rows else 7.0
        hist_risk_freq = sum([1 for r in risk_rows if r[0] == 'high']) / len(risk_rows) if risk_rows else 0.0
        clean_history = [utils["translate_to_english"](r[0]) for r in msg_rows][::-1] + [text_normalized]
    except Exception as e:
        print(f"WARNING: Context fetch error: {e}")
        mood_trend, hist_risk_freq, clean_history = 7.0, 0.0, [text_normalized]

    # --- PARALLEL DETECTION LAYER ---
    async def get_risk_results():
        # Define tasks for parallel execution
        tasks = [
            asyncio.to_thread(utils["detect_risk_rule"], text_normalized),
            asyncio.to_thread(utils["predict_risk_ensemble"], text_normalized),
            asyncio.to_thread(utils["predict_risk_xgb"], text_normalized, hist_risk=hist_risk_freq, mood_trend=mood_trend),
            asyncio.to_thread(utils["predict_temporal_risk_lstm"], clean_history),
            asyncio.to_thread(utils["detect_semantic_risk"], text_normalized)
        ]
        
        # Run all models concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Extract and handle results/errors
        risk_rule = results[0] if not isinstance(results[0], Exception) else 0
        risk_bert = results[1] if not isinstance(results[1], Exception) else 0
        risk_xgb = results[2] if not isinstance(results[2], Exception) else 0
        risk_temporal = results[3] if not isinstance(results[3], Exception) else 0
        semantic_risk_res = results[4] if not isinstance(results[4], Exception) else (0, {})
        
        # Log any errors
        for i, res in enumerate(results):
            if isinstance(res, Exception):
                print(f"ERROR: Model {i} failed: {res}")
        
        return risk_rule, risk_bert, risk_xgb, risk_temporal, semantic_risk_res

    # Await parallel execution
    logger.info("DEBUG: Running parallel risk detection...")
    risk_rule, risk_bert, risk_xgb, risk_temporal, (semantic_risk, _) = await get_risk_results()
    logger.info(f"DEBUG: Risk results - Rule: {risk_rule}, BERT: {risk_bert}, XGB: {risk_xgb}, Temporal: {risk_temporal}")

    final_risk = max(risk_rule, risk_bert, risk_xgb, risk_temporal)
    if semantic_risk == 2 and final_risk >= 1: 
        final_risk = 2

    risk_label = "high" if final_risk == 2 else "medium" if final_risk == 1 else "low"

    # Final save (Use masked input)
    def save_final(conn, cursor):
        cursor.execute(
            "INSERT INTO chats (user_id, role, message, risk_level, conversation_id) VALUES (?, ?, ?, ?, ?)",
            (user_id, user_role, masked_user_input, risk_label, conversation_id)
        )
        conn.commit()
    
    await run_db_op(save_final)

    if final_risk == 2:
        utils["send_crisis_alerts"](user_id, user_role, user_input, risk_source="pipeline")
        return {
            "risk_level": "high", "crisis": True, "trigger_appointment_popup": True,
            "reply": "I can sense you're going through something really tough... Let's take a moment together. Breathe in slowly... and out."
        }

    # Pass MASKED input to Gemini
    logger.info("DEBUG: Calling Gemini API...")
    reply = utils["get_gemini_response"](masked_user_input, final_risk, language=lang_code)
    logger.info(f"DEBUG: Gemini reply received ({len(reply)} chars)")
    
    # Save bot reply to history for isolation
    def save_bot_reply(conn, cursor):
        cursor.execute(
            "INSERT INTO chats (user_id, role, message, risk_level, conversation_id) VALUES (?, ?, ?, ?, ?)",
            (user_id, "bot", reply, risk_label, conversation_id)
        )
        conn.commit()
    
    await run_db_op(save_bot_reply)

    return {"risk_level": risk_label, "reply": reply, "conversation_id": conversation_id}


@router.get("/conversations", response_model=ConversationListOut)
async def get_conversations(
    current_user: AnyUser = Depends(get_current_user)
):
    """List all conversations for the user."""
    user_id = str(current_user.id)
    def fetch_convs(conn, cursor):
        cursor.execute(
            "SELECT id, title, created_at FROM conversations WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        )
        return [ConversationOut(id=r[0], title=r[1], created_at=str(r[2])) for r in cursor.fetchall()]
    
    convs = await run_db_op(fetch_convs)
    return ConversationListOut(conversations=convs)

@router.get("/history/{conversation_id}", response_model=ChatHistoryOut)
async def get_chat_history_v2(
    conversation_id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    """Fetch history for a specific conversation. If 'primary', gets the latest thread."""
    user_id = str(current_user.id)
    
    target_id = conversation_id
    if conversation_id.lower() == "primary":
        def fetch_primary_id(conn, cursor):
            cursor.execute("SELECT id FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,))
            res = cursor.fetchone()
            return res[0] if res else None
        target_id = await run_db_op(fetch_primary_id)
        
    if not target_id:
        return ChatHistoryOut(history=[])

    def fetch_history(conn, cursor):
        cursor.execute(
            "SELECT id, role, message, risk_level, created_at, conversation_id FROM chats WHERE user_id = ? AND conversation_id = ? ORDER BY created_at ASC",
            (user_id, target_id)
        )
        return [
            ChatMessageOut(
                id=r[0], role=r[1], message=r[2], risk_level=r[3], 
                created_at=str(r[4]), conversation_id=r[5]
            ) for r in cursor.fetchall()
        ]
    
    history = await run_db_op(fetch_history)
    return ChatHistoryOut(history=history)

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    """Delete a conversation and its messages."""
    user_id = str(current_user.id)
    def perform_delete(conn, cursor):
        # Delete messages first
        cursor.execute("DELETE FROM chats WHERE user_id = ? AND conversation_id = ?", (user_id, conversation_id))
        # Delete conversation
        cursor.execute("DELETE FROM conversations WHERE user_id = ? AND id = ?", (user_id, conversation_id))
        conn.commit()
    
    await run_db_op(perform_delete)
    return {"status": "success"}

@router.get("/history", response_model=ChatHistoryOut)
async def get_chat_history_legacy(
    current_user: AnyUser = Depends(get_current_user)
):
    """
    Fetch the isolated chat history for the logged-in user (Legacy).
    """
    user_id = str(current_user.id)

    def fetch_history(conn, cursor):
        cursor.execute(
            "SELECT id, role, message, risk_level, created_at, conversation_id FROM chats WHERE user_id = ? ORDER BY created_at ASC",
            (user_id,)
        )
        rows = cursor.fetchall()
        return [
            ChatMessageOut(
                id=r[0],
                role=r[1],
                message=r[2],
                risk_level=r[3],
                created_at=str(r[4]),
                conversation_id=r[5]
            ) for r in rows
        ]

    history = await run_db_op(fetch_history)
    return ChatHistoryOut(history=history)

# ---------------------------------------------------------
# COPING MECHANISMS: MOOD & JOURNALS
# ---------------------------------------------------------

class MoodRequest(BaseModel):
    mood: int

class JournalRequest(BaseModel):
    content: str

@router.post("/mood")
async def post_mood(
    request: MoodRequest,
    current_user: AnyUser = Depends(get_current_user)
):
    """Save a user's isolated mood check-in."""
    user_id = str(current_user.id)
    utils = get_models_and_utils()
    
    # Run synchronously in threadpool to avoid DB blocking
    def _save():
        utils["save_mood"](user_id, request.mood)
    
    await asyncio.to_thread(_save)
    return {"status": "success", "user_id": user_id}

@router.get("/mood/history")
async def get_mood_history(
    current_user: AnyUser = Depends(get_current_user)
):
    """Fetch recent mood check-ins for the isolated user."""
    from app.syna_ai.models.mood_logic import get_recent_moods
    user_id = str(current_user.id)
    
    rows = await asyncio.to_thread(get_recent_moods, user_id)
    return {"history": [{"mood_score": r[0], "date": r[1]} for r in rows]}

@router.post("/journal")
async def post_journal(
    request: JournalRequest,
    current_user: AnyUser = Depends(get_current_user)
):
    """Save an isolated journal entry."""
    user_id = str(current_user.id)
    
    def _save(conn, cursor):
        masked_content = utils["mask_pii"](request.content)
        cursor.execute(
            "INSERT INTO journals (user_id, content) VALUES (?, ?)",
            (user_id, masked_content)
        )
        conn.commit()
    
    # Reuse existing run_db_op if possible, but let's just use get_db_context for simplicity
    with get_db_context() as (conn, cursor):
         _save(conn, cursor)
         
    return {"status": "success"}

@router.get("/journal/history")
async def get_journal_history(
    current_user: AnyUser = Depends(get_current_user)
):
    """Fetch isolated journal history."""
    user_id = str(current_user.id)

    def _fetch(conn, cursor):
        cursor.execute("SELECT content, created_at FROM journals WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        return cursor.fetchall()

    with get_db_context() as (conn, cursor):
        rows = _fetch(conn, cursor)

    return {"history": [{"content": r[0], "date": r[1]} for r in rows]}


@router.get("/analytics/risks")
async def get_analytics_risks(
    current_user: AnyUser = Depends(get_current_user)
):
    """Isolated risk analytics for the logged-in user."""
    user_id = str(current_user.id)
    def _fetch_risk_counts():
        with get_db_context() as (conn, cursor):
            cursor.execute("SELECT risk_level, COUNT(*) FROM chats WHERE user_id = ? GROUP BY risk_level", (user_id,))
            return dict(cursor.fetchall())
    
    return await asyncio.to_thread(_fetch_risk_counts)
