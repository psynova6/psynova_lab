import numpy as np
import os
from app.syna_ai.config import MODELS_DIR

# Global cache
_model = None
_vectorizer = None

def load_ml_resources():
    global _model, _vectorizer
    if _model is None:
        print("🧠 Loading XGBoost model and vectorizer...")
        import joblib
        model_path = os.path.join(MODELS_DIR, "ml_model.pkl")
        vector_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
        _model = joblib.load(model_path)
        _vectorizer = joblib.load(vector_path)
        print("✅ XGBoost resources loaded.")
    return _model, _vectorizer

def predict_risk_xgb(text: str, hist_risk: float = 0.0, mood_trend: float = 7.0) -> int:
    """
    XGBoost Risk Classifier with 5 Features:
    1. TF-IDF
    2. Sentiment
    3. Length
    4. Hist Risk (0-1)
    5. Mood Trend (1-10)
    """
    from textblob import TextBlob
    model, vectorizer = load_ml_resources()
    # 1. TF-IDF
    vec = vectorizer.transform([text]).toarray()
    
    # 2. Sentiment
    sentiment = TextBlob(text).sentiment.polarity
    
    # 3. Length
    length = len(text)
    
    # Combine: [TF-IDF (1000) + Sentiment (1) + Length (1) + Hist Risk (1) + Mood Trend (1)]
    features = np.column_stack([
        vec, 
        [sentiment], 
        [length], 
        [hist_risk], 
        [mood_trend]
    ])
    
    return int(model.predict(features)[0])

def get_probabilities(text: str, hist_risk: float = 0.0, mood_trend: float = 7.0):
    from textblob import TextBlob
    model, vectorizer = load_ml_resources()
    vec = vectorizer.transform([text]).toarray()
    sentiment = TextBlob(text).sentiment.polarity
    length = len(text)
    
    features = np.column_stack([
        vec, 
        [sentiment], 
        [length], 
        [hist_risk], 
        [mood_trend]
    ])
    
    return model.predict_proba(features)[0]
