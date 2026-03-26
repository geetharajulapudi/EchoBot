from typing import TypedDict, List

class AgentState(TypedDict):
    query: str
    context: str
    intent: str
    history: str
    history_summary: str
    response: str
