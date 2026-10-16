
import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const API_URL = "http://localhost:8080/api/chat";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm RetainAI Assistant. Ask me about churn predictions, customer risk, or retention strategies.",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event) {
    event.preventDefault();

    const question = input.trim();
    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to get a response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: data.response },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: `Sorry, I couldn't respond. ${error.message || "Please try again."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="retainai-chatbot">
      {isOpen && (
        <section className="chatbot-panel" aria-label="RetainAI Assistant">
          <header className="chatbot-header">
            <div className="chatbot-brand">
              <div className="chatbot-avatar">R</div>
              <div>
                <h3>RetainAI Assistant</h3>
                <span>AI-powered churn insights</span>
              </div>
            </div>

            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${message.role}`}
              >
                <div className="chat-message-label">
                  {message.role === "user" ? "You" : "RetainAI"}
                </div>
                <div className="chat-message-bubble">{message.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <div className="chat-message-label">RetainAI</div>
                <div className="chat-message-bubble chatbot-typing">
                  Thinking…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about customer churn..."
              aria-label="Your message"
              maxLength={2000}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </form>

          <div className="chatbot-disclaimer">
            AI responses may be inaccurate. Verify important decisions.
          </div>
        </section>
      )}

      <button
        type="button"
        className={`chatbot-launcher ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close RetainAI Assistant" : "Open RetainAI Assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? "×" : "AI"}
      </button>
    </div>
  );
}
