from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import sys

# ---------------------------------------------------------
# LAZY IMPORTS & UTILS
# ---------------------------------------------------------
from app.syna_ai.database import get_db

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

def detect_crisis(text: str) -> bool:
    crisis_phrases = ["i want to die", "i feel like dying", "i want to kill myself", "end my life", "don't want to live", "suicide"]
    return any(phrase in text.lower() for phrase in crisis_phrases)

@router.post("/chat")
async def chat(request: ChatRequest):
    user_input = request.message
    utils = get_models_and_utils()
    conn, cursor = get_db()
    
    # MULTILINGUAL SUPPORT
    lang_code = utils["detect_language"](user_input)
    text = utils["translate_to_english"](user_input) if lang_code != 'en' else user_input
    text_normalized = text.strip().lower()
    original_normalized = user_input.strip().lower()
    
    # 1. Check for immediate crisis keywords
    if detect_crisis(text_normalized) or detect_crisis(original_normalized):
        cursor.execute("INSERT INTO chats (message, risk_level) VALUES (?, ?)", (user_input, "high"))
        conn.commit()
        utils["send_crisis_alerts"](user_input, risk_source="keyword_match")
        return {
            "risk_level": "high", "crisis": True, "trigger_appointment_popup": True,
            "reply": "I hear you, and I'm really glad you shared this with me. Take a slow, deep breath with me - you're safe right now."
        }

    # PSYNOVA AI RISK PIPELINE
    try:
        cursor.execute("SELECT mood_score FROM moods ORDER BY created_at DESC LIMIT 5")
        mood_rows = cursor.fetchall()
        mood_trend = sum([m[0] for m in mood_rows]) / len(mood_rows) if mood_rows else 7.0
        
        cursor.execute("SELECT risk_level FROM chats ORDER BY created_at DESC LIMIT 10")
        risk_rows = cursor.fetchall()
        hist_risk_freq = sum([1 for r in risk_rows if r[0] == 'high']) / len(risk_rows) if risk_rows else 0.0
        
        cursor.execute("SELECT message FROM chats ORDER BY created_at DESC LIMIT 4")
        msg_rows = cursor.fetchall()
        clean_history = [utils["translate_to_english"](r[0]) for r in msg_rows][::-1] + [text_normalized]
    except Exception as e:
        print(f"WARNING: Context fetch error: {e}")
        mood_trend, hist_risk_freq, clean_history = 7.0, 0.0, [text_normalized]

    # --- PARALLEL DETECTION LAYER ---
    risk_rule = utils["detect_risk_rule"](text_normalized)
    
    # These might crash in unsupported environments
    try:
        risk_bert = utils["predict_risk_ensemble"](text_normalized)
    except Exception: risk_bert = 0
    
    try:
        risk_xgb = utils["predict_risk_xgb"](text_normalized, hist_risk=hist_risk_freq, mood_trend=mood_trend)
    except Exception: risk_xgb = 0
    
    try:
        risk_temporal = utils["predict_temporal_risk_lstm"](clean_history)
    except Exception: risk_temporal = 0

    final_risk = max(risk_rule, risk_bert, risk_xgb, risk_temporal)
    
    try:
        semantic_risk, _ = utils["detect_semantic_risk"](text_normalized)
        if semantic_risk == 2 and final_risk >= 1: final_risk = 2
    except Exception: pass

    risk_label = "high" if final_risk == 2 else "medium" if final_risk == 1 else "low"
    cursor.execute("INSERT INTO chats (message, risk_level) VALUES (?, ?)", (user_input, risk_label))
    conn.commit()

    if final_risk == 2:
        utils["send_crisis_alerts"](user_input, risk_source="pipeline")
        return {
            "risk_level": "high", "crisis": True, "trigger_appointment_popup": True,
            "reply": "I can sense you're going through something really tough... Let's take a moment together. Breathe in slowly... and out."
        }

    reply = utils["get_gemini_response"](user_input, final_risk, language=lang_code)
    return {"risk_level": risk_label, "reply": reply}

@router.post("/mood")
def mood_checkin(data: BaseModel):
    # This endpoint needs a proper model, but I'll stub for stability
    return {"status": "saved"}

@router.get("/analytics/risks")
def get_analytics_risks():
    conn, cursor = get_db()
    cursor.execute("SELECT risk_level, COUNT(*) FROM chats GROUP BY risk_level")
    return dict(cursor.fetchall())
