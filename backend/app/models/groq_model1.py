import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_URL = "https://api.groq.com/openai/v1/chat/completions"


def call_groq(prompt: str, model="llama-3.3-70b-versatile"):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1024
    }
    try:
        response = requests.post(MODEL_URL, headers=headers, json=payload)
        if not response.text.strip():
            return "Error: Empty response from API"
        result = response.json()
        if response.status_code != 200:
            return f"API Error: {result.get('error', {}).get('message', 'Unknown error')}"
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        return f"System Error: {str(e)}"
