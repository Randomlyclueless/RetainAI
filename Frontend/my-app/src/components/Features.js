import React from "react";

function Features() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>📊 Smart Predictions</h3>
        <p>Detect churn patterns using ML models.</p>
      </div>

      <div style={styles.card}>
        <h3>⚡ Fast Analysis</h3>
        <p>Upload data and get instant results.</p>
      </div>

      <div style={styles.card}>
        <h3>🤖 AI Insights</h3>
        <p>Know exactly how to retain your users.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    padding: "60px 20px",
    flexWrap: "wrap",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "16px",
    width: "260px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
};

export default Features;