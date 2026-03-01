import requests
import json

url = "http://127.0.0.1:8000/syna/chat"
payload = {"message": "heyyyy"}
headers = {"Content-Type": "application/json"}

print(f"Testing {url}...")
try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
