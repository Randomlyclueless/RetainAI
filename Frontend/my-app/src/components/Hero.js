import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div style={styles.hero}>
      <h1 style={styles.title}>
        Predict Customer Churn <br />
        <span style={styles.highlight}>Before It Happens</span>
      </h1>

      <p style={styles.subtitle}>
        Turn raw data into powerful insights and retain your customers smarter.
      </p>

      <button
        style={styles.button}
        onClick={() => navigate("/predictions")}
      >
        Get Started
      </button>
    </div>
  );
}

const styles = {
  hero: {
    textAlign: "center",
    padding: "120px 20px",
  },
  title: {
    fontSize: "52px",
    lineHeight: "1.2",
    background: "linear-gradient(90deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  highlight: {
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    marginTop: "20px",
    color: "#cbd5f5",
    fontSize: "18px",
  },
  button: {
    marginTop: "30px",
    padding: "14px 30px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 15px 30px rgba(99,102,241,0.4)",
  },
};

export default Hero;