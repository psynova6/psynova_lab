HIGH_RISK_PHRASES = [
    "i want to die",
    "kill myself",
    "end my life",
    "i feel like dying",
    "i want to disappear",
]

def detect_risk_rule(text: str) -> int:
    text = text.lower()
    for phrase in HIGH_RISK_PHRASES:
        if phrase in text:
            return 2
    return 0
