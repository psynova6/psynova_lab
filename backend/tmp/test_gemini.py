import os
from google import genai
from google.genai import types

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    
    test_models = [
        "gemini-2.0-flash",
        "models/gemini-2.0-flash",
        "gemini-1.5-flash",
        "models/gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "models/gemini-1.5-flash-8b"
    ]

    for model_name in test_models:
        print(f"\nTesting: {model_name}")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Hello, say 'OK' if you can read this.",
            )
            print(f"SUCCESS: {response.text}")
        except Exception as e:
            print(f"FAILED: {e}")

except Exception as e:
    import traceback
    print(f"GENERAL FAILED: {e}")
    traceback.print_exc()
