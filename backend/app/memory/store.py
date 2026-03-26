import json, os

MEMORY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "memory.json")

def _load():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            content = f.read().strip()
            if not content:
                return {}
            return json.loads(content)
    return {}

def _save(data):
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f)

def get_history(session_id: str):
    return _load().get(session_id, "")

def save_history(session_id: str, summary: str):
    data = _load()
    data[session_id] = summary
    _save(data)