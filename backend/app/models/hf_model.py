import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

HF_API_KEY = os.getenv("HF_API_KEY")
HF_URL = "https://router.huggingface.co/cerebras/v1/chat/completions"


def call_hf(prompt: str, model="llama3.1-8b"):
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 256
    }
    try:
        response = requests.post(HF_URL, headers=headers, json=payload)
        if not response.text.strip():
            return ""
        result = response.json()
        if response.status_code != 200:
            return ""
        return result["choices"][0]["message"]["content"]
    except Exception:
        return ""
