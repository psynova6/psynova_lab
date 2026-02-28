import os
import joblib
import numpy as np

MODELS_DIR = r"d:\Psynova (2)\Psynova\Mental health chatbot\integration\psynova\backend\app\syna_ai\trained_models"
model_path = os.path.join(MODELS_DIR, "ml_model.pkl")

print(f"Testing XGBoost load from: {model_path}")
try:
    model = joblib.load(model_path)
    print("XGBoost Model OK. Testing mock inference...")
    # Mock 1004 features (1000 TF-IDF + 4 context)
    features = np.zeros((1, 1004))
    pred = model.predict(features)
    print(f"Inference OK: {pred}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
