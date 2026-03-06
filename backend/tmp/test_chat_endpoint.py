import requests

url = "http://localhost:8000/syna/chat"
headers = {"Content-Type": "application/json"}
data = {"message": "test message"}

try:
    response = requests.post(url, json=data, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
