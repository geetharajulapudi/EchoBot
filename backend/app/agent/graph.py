from langgraph.graph import StateGraph
from agent.state import AgentState
from agent.nodes import (
    summarize_history,
    classify_intent,
    fetch_context,
    generate_response,
    tool_node
)

def should_fetch_context(state: AgentState):
    return "context" if state["intent"] in ["knowledge", "debug"] else "response"

def build_graph():
    builder = StateGraph(AgentState)

    builder.add_node("summarize", summarize_history)
    builder.add_node("intent", classify_intent)
    builder.add_node("context", fetch_context)
    builder.add_node("tool", tool_node)
    builder.add_node("response", generate_response)

    builder.set_entry_point("summarize")

    builder.add_edge("summarize", "intent")
    builder.add_conditional_edges("intent", should_fetch_context)
    builder.add_edge("context", "tool")
    builder.add_edge("tool", "response")

    return builder.compile()

graph = build_graph()
