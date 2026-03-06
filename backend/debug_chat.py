import requests
import json

def test_chat():
    url = "http://localhost:8000/syna/chat"
    # Need to simulate a logged in user if possible, or use a test token
    # For now, let's see if it even hits the endpoint or fails with 401
    payload = {
        "message": "hello",
        "conversation_id": None
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_chat()
