import os

# Base directory for Syna AI module
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to trained models
MODELS_DIR = os.path.join(BASE_DIR, "trained_models")

# Gemini API Key (should be in .env)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
