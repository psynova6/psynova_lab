import os
from google import genai
from google.genai import types

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    
    m = "models/gemini-2.5-flash"
    print(f"Testing: {m}")
    try:
        response = client.models.generate_content(
            model=m,
            contents="Say 'FLASH 2.5 OK'",
        )
        print(f"RESULT: {response.text}")
    except Exception as e:
        print(f"ERROR: {e}")

except Exception as e:
    print(f"CRITICAL: {e}")
