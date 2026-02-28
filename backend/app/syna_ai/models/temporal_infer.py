import os
import numpy as np
import torch
from app.syna_ai.config import MODELS_DIR

# Configuration
INPUT_DIM = 768
HIDDEN_DIM = 64
NUM_LAYERS = 1
NUM_CLASSES = 3

# Global model instance cache
_temporal_model = None
_tokenizer = None
_bert_model = None
_device = None

def _load_resources():
    global _temporal_model, _tokenizer, _bert_model, _device
    
    if _temporal_model is None:
        try:
            torch.set_num_threads(1)
            import torch.nn as nn
            from transformers import DistilBertTokenizerFast, DistilBertModel

            class RiskLSTM(nn.Module):
                def __init__(self, input_dim, hidden_dim, num_layers, num_classes):
                    super(RiskLSTM, self).__init__()
                    self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=0.2)
                    self.fc = nn.Linear(hidden_dim, num_classes)
                    self.dropout = nn.Dropout(0.3)
                    
                def forward(self, x):
                    lstm_out, (h_n, c_n) = self.lstm(x)
                    last_hidden = h_n[-1]
                    out = self.dropout(last_hidden)
                    out = self.fc(out)
                    return out

            model_path = os.path.join(MODELS_DIR, "lstm_temporal.pth")
            _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            
            # Load BERT for feature extraction
            _tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
            _bert_model = DistilBertModel.from_pretrained("distilbert-base-uncased")
            _bert_model.to(_device)
            _bert_model.eval()
            
            # Load LSTM
            if os.path.exists(model_path):
                _temporal_model = RiskLSTM(INPUT_DIM, HIDDEN_DIM, NUM_LAYERS, NUM_CLASSES)
                _temporal_model.load_state_dict(torch.load(model_path, map_location=_device))
                _temporal_model.to(_device)
                _temporal_model.eval()
            else:
                print("WARNING: LSTM temporal model not found at", model_path)
        except Exception as e:
            print(f"ERROR: Error loading Temporal LSTM resources: {e}")

def predict_temporal_risk_lstm(history_texts: list) -> int:
    """
    Predict risk based on a sequence of past messages (max 5).
    """
    _load_resources()
    
    if _temporal_model is None or not history_texts:
        return 0

    try:
        # Take last 5
        seq_texts = history_texts[-5:]
        
        # Pad if needed
        if len(seq_texts) < 5:
            padding = [seq_texts[0]] * (5 - len(seq_texts))
            seq_texts = padding + seq_texts
            
        embeddings = []
        with torch.no_grad():
            for text in seq_texts:
                inputs = _tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=96).to(_device)
                outputs = _bert_model(**inputs)
                embed = outputs.last_hidden_state[:, 0, :].cpu().numpy()[0]
                embeddings.append(embed)
        
        # Shape: (1, 5, 768)
        input_tensor = torch.tensor(np.array([embeddings]), dtype=torch.float32).to(_device)
        
        _temporal_model.eval()
        with torch.no_grad():
            outputs = _temporal_model(input_tensor)
            pred = torch.argmax(outputs, dim=1).item()
            
        return int(pred)
    except Exception as e:
        print(f"ERROR: Temporal prediction error: {e}")
        return 0

def get_probabilities(history_texts: list):
    """
    Returns [prob_low, prob_medium, prob_high] using Softmax on LSTM logits.
    """
    _load_resources()
    if _temporal_model is None or not history_texts:
        return [0.34, 0.33, 0.33]

    try:
        seq_texts = history_texts[-5:]
        if len(seq_texts) < 5:
            padding = [seq_texts[0]] * (5 - len(seq_texts))
            seq_texts = padding + seq_texts
            
        embeddings = []
        with torch.no_grad():
            for text in seq_texts:
                inputs = _tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=96).to(_device)
                outputs = _bert_model(**inputs)
                embed = outputs.last_hidden_state[:, 0, :].cpu().numpy()[0]
                embeddings.append(embed)
        
        input_tensor = torch.tensor(np.array([embeddings]), dtype=torch.float32).to(_device)
        
        with torch.no_grad():
            logits = _temporal_model(input_tensor)
            probs = torch.nn.functional.softmax(logits, dim=-1).cpu().numpy()[0]
            
        return probs
    except Exception as e:
        print(f"ERROR: LSTM probability error: {e}")
        return [0.34, 0.33, 0.33]
