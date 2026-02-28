import os
import torch
torch.set_num_threads(1)
from transformers import AutoConfig, AutoModelForSequenceClassification

MODELS_DIR = r"d:\Psynova (2)\Psynova\Mental health chatbot\integration\psynova\backend\app\syna_ai\trained_models"
model_path = os.path.join(MODELS_DIR, "distilbert-risk")

try:
    print("Loading config...")
    config = AutoConfig.from_pretrained(model_path)
    print("Config OK. Initializing architecture (no weights)...")
    model = AutoModelForSequenceClassification.from_config(config)
    print("Architecture OK. Attempting to load state dict manually...")
    # Just check if we can open the file
    state_dict_path = os.path.join(model_path, "model.safetensors")
    print(f"Checking {state_dict_path} existence: {os.path.exists(state_dict_path)}")
    
    # Try small torch operation
    print("Testing torch math...")
    y = torch.ones(5) * 2
    print(f"Math OK: {y}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
