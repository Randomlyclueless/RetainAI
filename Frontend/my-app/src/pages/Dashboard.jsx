import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar showAuthButtons={false} />

      <div style={styles.container}>
        
        {/* Welcome */}
        <h1 style={styles.heading}>Dashboard 👋</h1>
        <p style={styles.subtext}>
          Manage your datasets and start analyzing customer retention.
        </p>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.primaryBtn}>
            Upload Dataset
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/report")}
          >
            View Reports
          </button>
        </div>

        {/* Placeholder Cards */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Total Datasets</h3>
            <p>0</p>
          </div>

          <div style={styles.card}>
            <h3>Models Trained</h3>
            <p>0</p>
          </div>

          <div style={styles.card}>
            <h3>Churn Predictions</h3>
            <p>0</p>
          </div>
        </div>

        {/* Empty State */}
        <div style={styles.empty}>
          <h3>No Activity Yet</h3>
          <p>
            Upload your dataset to start generating predictions and insights.
          </p>
        </div>

      </div>

      <Footer />
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

  actions: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  },

  primaryBtn: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "12px 20px",
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    flex: 1,
  },

  empty: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
};