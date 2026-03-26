import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
import uuid, json
from agent.graph import graph
from memory.store import get_history, save_history

app = FastAPI()


@app.get("/history/{session_id}", response_class=PlainTextResponse)
def get_chat_history(session_id: str):
    h = get_history(session_id)
    if not h:
        return f"No history found for session: {session_id}"
    return "\n".join(h)


@app.post("/chat", response_class=PlainTextResponse)
async def chat(request: Request):
    body = (await request.body()).decode("utf-8").strip()

    try:
        data = json.loads(body)
        query = data.get("query", "")
        session_id = data.get("session_id") or request.headers.get("session-id") or str(uuid.uuid4())
    except (json.JSONDecodeError, ValueError):
        query = body
        session_id = request.headers.get("session-id") or str(uuid.uuid4())

    history = get_history(session_id)

    state = {
        "query": query,
        "history": history,
        "history_summary": "",
        "context": "",
        "intent": "",
        "response": ""
    }

    try:
        result = graph.invoke(state)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"Error: {str(e)}"

    new_history = f"{history}\nUser: {query}\nBot: {result['response']}".strip()
    save_history(session_id, result.get("history_summary") or new_history)

    return f"Session ID: {session_id}\n\n{result['response']}"
