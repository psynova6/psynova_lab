from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import sys

# ---------------------------------------------------------
# LAZY IMPORTS & UTILS
# ---------------------------------------------------------
# ---------------------------------------------------------
# LAZY IMPORTS & UTILS
# ---------------------------------------------------------
import asyncio
from app.syna_ai.database import get_db, get_db_context
from app.authentication_onboarding.core.dependencies import get_current_user
from app.authentication_onboarding.models.user import AnyUser

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
        "save_mood": save_mood
    }

router = APIRouter(prefix="/syna", tags=["Syna AI Chatbot"])

class ChatRequest(BaseModel):
    message: str

class ChatMessageOut(BaseModel):
    id: int
    role: str
    message: str
    risk_level: str
    created_at: str

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

    user_input = request.message
    utils = get_models_and_utils()

    def crisis_check_and_save(conn, cursor):
        cursor.execute(
            "INSERT INTO chats (user_id, role, message, risk_level) VALUES (?, ?, ?, ?)",
            (user_id, user_role, user_input, "high")
        )
        conn.commit()

    # MULTILINGUAL SUPPORT
    lang_code = utils["detect_language"](user_input)
    text = utils["translate_to_english"](user_input) if lang_code != 'en' else user_input
    text_normalized = text.strip().lower()
    original_normalized = user_input.strip().lower()

    # 1. Check for immediate crisis keywords
    if detect_crisis(text_normalized) or detect_crisis(original_normalized):
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
        
        mood_trend = sum([m[0] for m in mood_rows]) / len(mood_rows) if mood_rows else 7.0
        hist_risk_freq = sum([1 for r in risk_rows if r[0] == 'high']) / len(risk_rows) if risk_rows else 0.0
        clean_history = [utils["translate_to_english"](r[0]) for r in msg_rows][::-1] + [text_normalized]
    except Exception as e:
        print(f"WARNING: Context fetch error: {e}")
        mood_trend, hist_risk_freq, clean_history = 7.0, 0.0, [text_normalized]

    # --- PARALLEL DETECTION LAYER ---
    risk_rule = utils["detect_risk_rule"](text_normalized)
    risk_bert = 0
    try: 
        risk_bert = utils["predict_risk_ensemble"](text_normalized)
    except Exception as e: 
        print(f"ERROR: predict_risk_ensemble failed: {e}. Text: {text_normalized}")
        # In a real app, use logger.exception here

    risk_xgb = 0
    try: 
        risk_xgb = utils["predict_risk_xgb"](text_normalized, hist_risk=hist_risk_freq, mood_trend=mood_trend)
    except Exception as e: 
        print(f"ERROR: predict_risk_xgb failed: {e}. Text: {text_normalized}, hist: {hist_risk_freq}, mood: {mood_trend}")

    risk_temporal = 0
    try: 
        risk_temporal = utils["predict_temporal_risk_lstm"](clean_history)
    except Exception as e: 
        print(f"ERROR: predict_temporal_risk_lstm failed: {e}. History: {clean_history}")

    final_risk = max(risk_rule, risk_bert, risk_xgb, risk_temporal)
    try:
        semantic_risk, _ = utils["detect_semantic_risk"](text_normalized)
        if semantic_risk == 2 and final_risk >= 1: 
            final_risk = 2
    except Exception as e: 
        print(f"ERROR: detect_semantic_risk failed: {e}. Text: {text_normalized}")

    risk_label = "high" if final_risk == 2 else "medium" if final_risk == 1 else "low"

    # Final save
    def save_final(conn, cursor):
        cursor.execute(
            "INSERT INTO chats (user_id, role, message, risk_level) VALUES (?, ?, ?, ?)",
            (user_id, user_role, user_input, risk_label)
        )
        conn.commit()
    
    await run_db_op(save_final)

    if final_risk == 2:
        utils["send_crisis_alerts"](user_id, user_role, user_input, risk_source="pipeline")
        return {
            "risk_level": "high", "crisis": True, "trigger_appointment_popup": True,
            "reply": "I can sense you're going through something really tough... Let's take a moment together. Breathe in slowly... and out."
        }

    reply = utils["get_gemini_response"](user_input, final_risk, language=lang_code)
    
    # Save bot reply to history for isolation
    def save_bot_reply(conn, cursor):
        cursor.execute(
            "INSERT INTO chats (user_id, role, message, risk_level) VALUES (?, ?, ?, ?)",
            (user_id, "bot", reply, risk_label)
        )
        conn.commit()
    
    await run_db_op(save_bot_reply)

    return {"risk_level": risk_label, "reply": reply}


@router.get("/history", response_model=ChatHistoryOut)
async def get_chat_history(
    current_user: AnyUser = Depends(get_current_user)
):
    """
    Fetch the isolated chat history for the logged-in user.
    """
    user_id = str(current_user.id)

    def fetch_history(conn, cursor):
        cursor.execute(
            "SELECT id, role, message, risk_level, created_at FROM chats WHERE user_id = ? ORDER BY created_at ASC",
            (user_id,)
        )
        rows = cursor.fetchall()
        return [
            ChatMessageOut(
                id=r[0],
                role=r[1],
                message=r[2],
                risk_level=r[3],
                created_at=str(r[4])
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
        cursor.execute(
            "INSERT INTO journals (user_id, content) VALUES (?, ?)",
            (user_id, request.content)
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
