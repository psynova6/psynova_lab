import os
# Heavy imports moved inside load_ensemble for stability
from app.syna_ai.config import MODELS_DIR

# Global cache for models and device
_models = {
    "distil_tokenizer": None,
    "distil_model": None,
    "bert_tokenizer": None,
    "bert_model": None,
    "device": None
}

def load_ensemble():
    """Lazy load BERT and DistilBERT models."""
    if _models["distil_model"] is not None:
        return
        
    print(f"DEBUG: Loading BERT Ensemble models from: {MODELS_DIR}")
    try:
        import torch
        torch.set_num_threads(1) # CRITICAL: Fix for Windows Access Violations
        import torch.nn.functional as F
        from transformers import (
            DistilBertTokenizerFast as DistilBertTokenizer,
            DistilBertForSequenceClassification,
            BertTokenizerFast as BertTokenizer,
            BertForSequenceClassification,
        )

        print("DEBUG: Torch and Transformers imported")

        _models["device"] = torch.device("cpu") # Force CPU for stability
        device = _models["device"]
        print(f"DEBUG: Using device: {device}")
        
        # Check paths
        distil_model_path = os.path.join(MODELS_DIR, "distilbert-risk")
        bert_model_path = os.path.join(MODELS_DIR, "bert-risk")
        
        print(f"DEBUG: Paths - DistilBERT: {distil_model_path}, BERT: {bert_model_path}")

        # Load DistilBERT
        print("DEBUG: Loading DistilBERT Tokenizer...")
        _models["distil_tokenizer"] = DistilBertTokenizer.from_pretrained(distil_model_path)
        print("DEBUG: DistilBERT Tokenizer OK. Loading DistilBERT Model...")
        _models["distil_model"] = DistilBertForSequenceClassification.from_pretrained(
            distil_model_path, low_cpu_mem_usage=True
        )
        print("DEBUG: DistilBERT Model OK. Moving to device...")
        _models["distil_model"].to(device)
        print("DEBUG: DistilBERT Model on device. Eval mode...")
        _models["distil_model"].eval()

        # Load BERT
        print("DEBUG: Loading BERT Tokenizer...")
        _models["bert_tokenizer"] = BertTokenizer.from_pretrained(bert_model_path)
        print("DEBUG: BERT Tokenizer OK. Loading BERT Model...")
        _models["bert_model"] = BertForSequenceClassification.from_pretrained(
            bert_model_path, low_cpu_mem_usage=True
        )
        print("DEBUG: BERT Model OK. Moving to device...")
        _models["bert_model"].to(device)
        print("DEBUG: BERT Model on device. Eval mode...")
        _models["bert_model"].eval()
        print("BERT Ensemble loaded successfully.")
    except Exception as e:
        print(f"CRITICAL ERROR loading Ensemble models: {e}")
        import traceback
        traceback.print_exc()
        raise e


# ===========================
# ENSEMBLE PREDICT FUNCTION
# ===========================

def predict_risk_ensemble(text: str) -> int:
    load_ensemble()
    import torch
    import torch.nn.functional as F
    device = _models["device"]

    # ---- DistilBERT ----
    inputs_d = _models["distil_tokenizer"](
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    ).to(device)

    with torch.no_grad():
        outputs_d = _models["distil_model"](**inputs_d)

    probs_d = F.softmax(outputs_d.logits, dim=1)

    # ---- BERT ----
    inputs_b = _models["bert_tokenizer"](
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    ).to(device)

    with torch.no_grad():
        outputs_b = _models["bert_model"](**inputs_b)

    probs_b = F.softmax(outputs_b.logits, dim=1)

    # ---- Average probabilities ----
    avg_probs = (probs_d + probs_b) / 2

    final_class = torch.argmax(avg_probs, dim=1).item()

    return final_class
