from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    query: Optional[str] = None
    session_id: Optional[str] = None
