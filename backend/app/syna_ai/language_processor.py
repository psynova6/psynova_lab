from deep_translator import GoogleTranslator

def detect_language(text: str) -> str:
    """
    Detects the language of the input text.
    Returns ISO 639-1 code (e.g., 'en', 'hi').
    """
    # Detect Hindi (Devanagari)
    for char in text:
        if '\u0900' <= char <= '\u097F':
            return 'hi'
    
    # Detect Kannada
    for char in text:
        if '\u0C80' <= char <= '\u0CFF':
            return 'kn'
            
    # Detect Tamil
    for char in text:
        if '\u0B80' <= char <= '\u0BFF':
            return 'ta'

    return 'en'

def translate_to_english(text: str) -> str:
    """
    Translates text to English if it's not already.
    """
    try:
        lang = detect_language(text)
        if lang == 'en':
            return text
        
        # Translate to English
        translated = GoogleTranslator(source='auto', target='en').translate(text)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def clean_for_analysis(text: str) -> str:
    """
    Cleans translated text by removing untranslated Romanized words
    that might confuse ML models. Keeps only English words.
    """
    import re
    # Split into words
    words = text.split()
    # Keep only words that are primarily English letters and common punctuation
    english_words = []
    for word in words:
        # Remove punctuation for checking
        clean_word = re.sub(r'[^\w\s]', '', word.lower())
        # If word contains mostly English letters (a-z), keep it
        if clean_word and re.match(r'^[a-z]+$', clean_word):
            english_words.append(word)
    
    return ' '.join(english_words)

def translate_to_hindi(text: str) -> str:
    """
    Translates English text to Hindi.
    """
    try:
        translated = GoogleTranslator(source='en', target='hi').translate(text)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return text
