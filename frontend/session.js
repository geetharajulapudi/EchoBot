// session.js
export function getSessionId() {
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // modern browsers
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
}