import React, { useState } from "react";

import axios from "axios";

export default function AICopilot() {

  // =========================
  // STATES
  // =========================

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {

    if (!question.trim()) return;

    // Add user message
    const userMessage = {

      role: "user",

      text: question,

    };

    setMessages((prev) => [

      ...prev,

      userMessage,

    ]);

    setLoading(true);

    try {

      // Call AI Copilot API
      const response =
        await axios.post(

          "http://localhost:5000/copilot",

          {
            question: question,
          }

        );

      const aiMessage = {

        role: "assistant",

        text: response.data.answer,

      };

      // Add AI response
      setMessages((prev) => [

        ...prev,

        aiMessage,

      ]);

    } catch (error) {

      console.error(error);

    }

    setQuestion("");

    setLoading(false);

  };

  return (

    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        🤖 RetainAI Copilot

      </div>

      {/* CHAT AREA */}

      <div style={styles.chatArea}>

        {messages.length === 0 && (

          <div style={styles.empty}>

            Ask RetainAI about
            customer churn,
            analytics,
            retention strategy,
            and insights.

          </div>

        )}

        {messages.map((msg, index) => (

          <div
            key={index}
            style={

              msg.role === "user"

                ? styles.userMessage

                : styles.aiMessage

            }
          >

            {msg.text}

          </div>

        ))}

        {loading && (

          <div style={styles.loading}>

            RetainAI is thinking...

          </div>

        )}

      </div>

      {/* INPUT */}

      <div style={styles.inputContainer}>

        <input

          type="text"

          placeholder=
            "Ask RetainAI..."

          value={question}

          onChange={(e) =>
            setQuestion(e.target.value)
          }

          style={styles.input}

        />

        <button

          onClick={sendMessage}

          style={styles.button}

        >

          Send

        </button>

      </div>

    </div>

  );

}

const styles = {

  container: {

    background: "#ffffff",

    borderRadius: "20px",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.08)",

    padding: "20px",

    marginTop: "40px",

    display: "flex",

    flexDirection: "column",

    height: "600px",

  },

  header: {

    fontSize: "24px",

    fontWeight: "bold",

    marginBottom: "20px",

    color: "#111827",

  },

  chatArea: {

    flex: 1,

    overflowY: "auto",

    paddingRight: "10px",

    display: "flex",

    flexDirection: "column",

    gap: "15px",

  },

  empty: {

    color: "#6b7280",

    textAlign: "center",

    marginTop: "100px",

    lineHeight: "1.8",

  },

  userMessage: {

    alignSelf: "flex-end",

    background: "#4f46e5",

    color: "#ffffff",

    padding: "14px",

    borderRadius: "14px",

    maxWidth: "70%",

    lineHeight: "1.6",

  },

  aiMessage: {

    alignSelf: "flex-start",

    background: "#f3f4f6",

    color: "#111827",

    padding: "14px",

    borderRadius: "14px",

    maxWidth: "70%",

    lineHeight: "1.8",

    whiteSpace: "pre-wrap",

  },

  loading: {

    color: "#6b7280",

    fontStyle: "italic",

  },

  inputContainer: {

    display: "flex",

    gap: "10px",

    marginTop: "20px",

  },

  input: {

    flex: 1,

    padding: "14px",

    borderRadius: "12px",

    border: "1px solid #d1d5db",

    fontSize: "15px",

  },

  button: {

    background: "#4f46e5",

    color: "#ffffff",

    border: "none",

    padding: "14px 22px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "600",

  },

};