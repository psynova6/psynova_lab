import os
from google import genai
from google.genai import types

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    print("--- AVAILABLE MODELS ---")
    for m in client.models.list():
        print(f"Model ID: {m.name}")
    
    print("\n--- TESTING 2.0 FLASH ---")
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Hello.",
        )
        print(f"2.0 Flash SUCCESS: {response.text}")
    except Exception as e:
        print(f"2.0 Flash FAILED: {e}")

    print("\n--- TESTING 1.5 FLASH (Fallback) ---")
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents="Hello.",
        )
        print(f"1.5 Flash SUCCESS: {response.text}")
    except Exception as e:
        print(f"1.5 Flash FAILED: {e}")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
