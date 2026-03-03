import os
from google import genai
from google.genai import types

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    
    test_models = [
        "models/gemini-2.0-flash",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-flash-8b",
        "models/gemini-2.0-pro-exp-02-05", # Maybe what user called '2.5'?
        "gemini-2.0-flash",
        "gemini-1.5-flash"
    ]

    for model_name in test_models:
        print(f"\nTesting: {model_name}")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Test.",
            )
            print(f"SUCCESS: {response.text}")
        except Exception as e:
            # Check for 429 specifically
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f"RATE LIMITED (429): {e}")
            else:
                print(f"FAILED: {e}")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
