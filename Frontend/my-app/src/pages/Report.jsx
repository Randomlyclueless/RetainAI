import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Report() {
  return (
    <>
      <Navbar showAuthButtons={false} />

      <div style={styles.container}>
        
        {/* Header */}
        <h1 style={styles.heading}>Reports 📊</h1>
        <p style={styles.subtext}>
          View your churn predictions and insights here.
        </p>

        {/* Placeholder Insights */}
        <div style={styles.card}>
          <h3>No Reports Available</h3>
          <p>
            Run a model to generate reports and insights about your customers.
          </p>
        </div>

        {/* Sample Future Section */}
        <div style={styles.grid}>
          <div style={styles.smallCard}>
            <h4>Churn Rate</h4>
            <p>--%</p>
          </div>

          <div style={styles.smallCard}>
            <h4>At-Risk Users</h4>
            <p>--</p>
          </div>

          <div style={styles.smallCard}>
            <h4>Model Accuracy</h4>
            <p>--%</p>
          </div>
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

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },

  grid: {
    display: "flex",
    gap: "20px",
  },

  smallCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    flex: 1,
  },
};