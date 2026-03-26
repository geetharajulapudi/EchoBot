import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getSessionId } from "../session";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const query = input;
    setMessages((prev) => [...prev, { user: true, text: query }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, session_id: sessionId }),
      });
      const text = await res.text();
      const response = text.replace(/^Session ID:.*\n\n/, "").trim();
      setMessages((prev) => [...prev, { user: false, text: response }]);
    } catch {
      setMessages((prev) => [...prev, { user: false, text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerAvatar}>AI</div>
        <div>
          <div style={styles.headerTitle}>AI Assistant</div>
          <div style={styles.headerSub}>Always here to help</div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyTitle}>How can I help you today?</div>
            <div style={styles.emptySub}>Ask me anything — code, questions, or just chat.</div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} style={m.user ? styles.userRow : styles.botRow}>
            {!m.user && <div style={styles.botAvatar}>AI</div>}
            <div style={m.user ? styles.userBubble : styles.botBubble}>
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code style={styles.inlineCode} {...props}>{children}</code>
                    );
                  },
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
            {m.user && <div style={styles.userAvatar}>You</div>}
          </div>
        ))}

        {loading && (
          <div style={styles.botRow}>
            <div style={styles.botAvatar}>AI</div>
            <div style={styles.typingBubble}>
              <span style={styles.dot1} />
              <span style={styles.dot2} />
              <span style={styles.dot3} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputWrapper}>
        <div style={styles.inputArea}>
          <textarea
            ref={textareaRef}
            style={styles.input}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Message AI Assistant..."
            rows={1}
          />
          <button style={{...styles.button, opacity: loading || !input.trim() ? 0.5 : 1}} onClick={sendMessage} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
        <div style={styles.inputHint}>Enter to send · Shift+Enter for new line</div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#ececec",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 24px",
    borderBottom: "1px solid #2a2a2a",
    backgroundColor: "#1f1f1f",
  },
  headerAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#ececec",
  },
  headerSub: {
    fontSize: "12px",
    color: "#666",
    marginTop: "1px",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: "80px",
    gap: "10px",
  },
  emptyIcon: {
    fontSize: "40px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ccc",
  },
  emptySub: {
    fontSize: "13px",
    color: "#555",
  },
  userRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: "8px",
  },
  botRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: "8px",
  },
  botAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  userAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#2f2f2f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "600",
    color: "#aaa",
    flexShrink: 0,
  },
  userBubble: {
    backgroundColor: "#2f2f2f",
    padding: "10px 16px",
    borderRadius: "18px 18px 4px 18px",
    maxWidth: "68%",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#ececec",
  },
  botBubble: {
    backgroundColor: "#252525",
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    maxWidth: "75%",
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#ddd",
    border: "1px solid #2e2e2e",
  },
  typingBubble: {
    backgroundColor: "#252525",
    padding: "14px 18px",
    borderRadius: "18px 18px 18px 4px",
    display: "flex",
    gap: "5px",
    alignItems: "center",
    border: "1px solid #2e2e2e",
  },
  dot1: {
    width: "7px", height: "7px", borderRadius: "50%",
    backgroundColor: "#666",
    display: "inline-block",
    animation: "bounce 1.2s infinite",
    animationDelay: "0s",
  },
  dot2: {
    width: "7px", height: "7px", borderRadius: "50%",
    backgroundColor: "#666",
    display: "inline-block",
    animation: "bounce 1.2s infinite",
    animationDelay: "0.2s",
  },
  dot3: {
    width: "7px", height: "7px", borderRadius: "50%",
    backgroundColor: "#666",
    display: "inline-block",
    animation: "bounce 1.2s infinite",
    animationDelay: "0.4s",
  },
  inlineCode: {
    backgroundColor: "#2f2f2f",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  inputWrapper: {
    padding: "12px 20px 16px",
    borderTop: "1px solid #2a2a2a",
    backgroundColor: "#1f1f1f",
  },
  inputArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    backgroundColor: "#2a2a2a",
    borderRadius: "16px",
    padding: "8px 8px 8px 16px",
    border: "1px solid #333",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#ececec",
    border: "none",
    fontSize: "14px",
    resize: "none",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
    lineHeight: "1.5",
    maxHeight: "160px",
    overflowY: "auto",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "15px",
    flexShrink: 0,
    transition: "opacity 0.2s",
  },
  inputHint: {
    fontSize: "11px",
    color: "#444",
    textAlign: "center",
    marginTop: "6px",
  },
};
