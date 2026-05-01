import React from "react";
import Navbar2 from "../components/Navbar2";
export default function Home() {
  return (
    <>
      {/* Navbar without login/signup */}
        <Navbar2 />
      <div style={styles.container}>
        
        {/* Welcome */}
        <h1 style={styles.heading}>Welcome to RetainAI 👋</h1>
        <p style={styles.subtext}>
          Start by uploading your dataset to predict customer churn.
        </p>

        {/* Main Action */}
        <button style={styles.primaryBtn}>
          Upload Dataset
        </button>

        {/* Placeholder */}
        <div style={styles.card}>
          <h3>No Data Yet</h3>
          <p>
            Upload your first dataset to begin analysis and see insights here.
          </p>
        </div>

      </div>

      
    </>
  );
}

const styles = {
  container: {
    padding: "40px",
    minHeight: "70vh",
    background: "#f9fafb",
  },

  heading: {
    fontSize: "28px",
    marginBottom: "10px",
    color: "#111827",
  },

  subtext: {
    fontSize: "16px",
    marginBottom: "25px",
    color: "#6b7280",
  },

  primaryBtn: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "30px",
    fontWeight: "500",
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    maxWidth: "500px",
  },
};