import re

# Regex patterns for various PII types
EMAIL_PATTERN = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

# Phone number patterns:
# 1. Indian (+91) format
# 2. Generic 10-digit format
# 3. Formats with dashes or spaces
PHONE_PATTERN = r'(\+91[\-\s]?)?[6-9]\d{9}|(\d{3}[\-\s]?\d{3}[\-\s]?\d{4})'

# URL and IP address pattern
URL_PATTERN = r'https?://[^\s/$.?#].[^\s]*'
IP_PATTERN = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'

def mask_pii(text: str) -> str:
    """
    Redacts sensitive information from text using regex placeholders.
    """
    if not text:
        return text
        
    # Order of masking is important to prevent partial matches
    
    # 1. Mask URLs
    masked = re.sub(URL_PATTERN, "[URL]", text)
    
    # 2. Mask Emails
    masked = re.sub(EMAIL_PATTERN, "[EMAIL]", masked)
    
    # 3. Mask IP Addresses
    masked = re.sub(IP_PATTERN, "[IP]", masked)
    
    # 4. Mask Phone Numbers
    masked = re.sub(PHONE_PATTERN, "[PHONE]", masked)
    
    return masked

if __name__ == "__main__":
    test_text = "Contact me at pradhyumn@example.com or call +91-9876543210. Visit https://psynova.com for more info."
    print(f"Original: {test_text}")
    print(f"Masked: {mask_pii(test_text)}")
    
    assert "[EMAIL]" in mask_pii(test_text)
    assert "[PHONE]" in mask_pii(test_text)
    assert "[URL]" in mask_pii(test_text)
