import os
from google import genai
from google.genai import types

api_key = "AIzaSyCryXFgGgoVYAFk5x56CtRTQbLk6ER7qic"

try:
    client = genai.Client(api_key=api_key)
    print("--- REAL AVAILABLE MODELS ---")
    for m in client.models.list():
        print(f"Name: {m.name}")
except Exception as e:
    print(f"Error listing: {e}")
