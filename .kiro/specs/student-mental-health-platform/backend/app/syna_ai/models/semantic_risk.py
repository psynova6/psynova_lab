# Global model cache
_model = None
SIMILARITY_THRESHOLD = 0.85

def get_model():
    global _model
    if _model is None:
        print("🧠 Loading SentenceTransformer (all-MiniLM-L6-v2)...")
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ SentenceTransformer loaded.")
    return _model

HIGH_RISK_ANCHORS = [
    "I want to end my life",
    "I wish I was dead",
    "I don't want to exist anymore",
    "Life is not worth living",
    "I feel like dying"
]

_anchor_embeddings = None

def get_anchors():
    global _anchor_embeddings
    if _anchor_embeddings is None:
        model = get_model()
        _anchor_embeddings = model.encode(HIGH_RISK_ANCHORS, convert_to_tensor=True)
    return _anchor_embeddings


def detect_semantic_risk(text: str):
    """
    Returns:
    (risk_level, debug_info)
    risk_level: 0 or 2
    """
    from sentence_transformers import util
    model = get_model()
    anchor_embeddings = get_anchors()

    text_embedding = model.encode(text, convert_to_tensor=True)
    similarities = util.cos_sim(text_embedding, anchor_embeddings)[0]

    best_score = float(similarities.max())
    best_anchor = HIGH_RISK_ANCHORS[int(similarities.argmax())]

    if best_score >= SIMILARITY_THRESHOLD:
        return 2, {
            "similarity": round(best_score, 3),
            "anchor": best_anchor
        }

    return 0, {
        "similarity": round(best_score, 3),
        "anchor": best_anchor
    }
