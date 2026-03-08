from google import genai
import os

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Hello, say 'Connection Verified' if you can read this.",
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
