import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODELS_DIR = r"d:\Psynova (2)\Psynova\Mental health chatbot\integration\psynova\backend\app\syna_ai\trained_models"
model_path = os.path.join(MODELS_DIR, "distilbert-risk")

print(f"Testing load from: {model_path}")
print(f"Torch version: {torch.__version__}")

try:
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    print("Tokenizer OK. Loading model...")
    model = AutoModelForSequenceClassification.from_pretrained(model_path, low_cpu_mem_usage=True)
    print("Model OK. Testing inference...")
    inputs = tokenizer("I am feeling fine", return_tensors="pt")
    outputs = model(**inputs)
    print(f"Inference OK: {outputs.logits}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
