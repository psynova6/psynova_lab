from google import genai
import os

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    print("Listing models...")
    for m in client.models.list():
        print(f"Model Name: {m.name}")
    
    print("\nTesting gemini-2.0-flash...")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Hello!",
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
