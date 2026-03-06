import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# If not in env, we can try to find where it is
api_key = os.getenv("GEMINI_API_KEY", "")

if not api_key:
    print("No API KEY found in environment.")
else:
    print(f"Using API KEY starting with: {api_key[:5]}...")
    client = genai.Client(api_key=api_key)
    
    models_to_test = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"]
    
    for model_name in models_to_test:
        print(f"\nTesting model: {model_name}")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Hello, this is a test.",
            )
            print(f"SUCCESS with {model_name}!")
            print(f"Response: {response.text.strip()}")
        except Exception as e:
            print(f"FAILED with {model_name}: {e}")
