
import React, { useCallback, useEffect, useState } from "react";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

const API_URL = "http://localhost:8080";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setError("");

    try {
      const [customersResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/customers`),
        fetch(`${API_URL}/customers/stats`),
      ]);

      if (!customersResponse.ok || !statsResponse.ok) {
        throw new Error("Could not load dashboard data.");
      }

      const [customerData, statsData] = await Promise.all([
        customersResponse.json(),
        statsResponse.json(),
      ]);

      if (!Array.isArray(customerData)) {
        throw new Error("Unexpected customer data returned by the API.");
      }

      setCustomers(customerData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const cards = [
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? customers.length,
      color: "#4f46e5",
    },
    {
      title: "Predicted Churn",
      value: stats?.highRisk ?? customers.filter(
        (c) => Number(c.prediction) === 1
      ).length,
      color: "#dc2626",
    },
    {
      title: "High Risk",
      value: customers.filter(
        (c) => String(c.riskLevel).toUpperCase() === "HIGH"
      ).length,
      color: "#d97706",
    },
    {
      title: "Predicted Retention",
      value: stats?.lowRisk ?? customers.filter(
        (c) => Number(c.prediction) === 0
      ).length,
      color: "#059669",
    },
  ];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>RETAINAI ANALYTICS</p>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subtitle}>
              Monitor customer churn predictions and identify customers
              who may need attention.
            </p>
          </div>


        </header>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
            <button onClick={loadDashboard} style={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p style={styles.message}>Loading dashboard...</p>
        ) : (
          <>
            <section style={styles.grid}>
              {cards.map((card) => (
                <article key={card.title} style={styles.card}>
                  <p style={styles.cardTitle}>{card.title}</p>
                  <h2 style={{ ...styles.cardValue, color: card.color }}>
                    {card.value}
                  </h2>
                </article>
              ))}
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Customer Management</h2>
                  <p style={styles.subtitle}>
                    Add customers and evaluate their predicted churn risk.
                  </p>
                </div>
                <button style={styles.refreshButton} onClick={loadDashboard}>
                  Refresh
                </button>
              </div>

              <CustomerForm onCustomerAdded={loadDashboard} />
            </section>

            <section style={styles.panel}>
              <h2 style={styles.sectionTitle}>Customer Predictions</h2>
              <p style={styles.subtitle}>
                Review customer details and model-generated risk levels.
              </p>

              {customers.length === 0 ? (
                <p style={styles.message}>
                  No customers available. Add a customer above to get started.
                </p>
              ) : (
                <CustomerTable customers={customers} />
              )}
            </section>

            <p style={styles.disclaimer}>
              Predictions estimate churn risk; they do not confirm that a
              customer has left.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "36px 24px",
    background: "#f5f7fb",
    color: "#111827",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: { maxWidth: "1200px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  heading: {
    margin: "0 0 8px",
    fontSize: "32px",
    fontWeight: 750,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    padding: "22px",
    background: "#fff",
    border: "1px solid #e8edf5",
    borderRadius: "14px",
    boxShadow: "0 3px 12px rgba(15,23,42,.03)",
  },
  cardTitle: { margin: 0, color: "#64748b", fontSize: "13px" },
  cardValue: { margin: "12px 0 0", fontSize: "32px" },
  panel: {
    padding: "24px",
    marginBottom: "22px",
    background: "#fff",
    border: "1px solid #e8edf5",
    borderRadius: "14px",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "22px",
  },
  sectionTitle: { margin: "0 0 8px", fontSize: "18px" },
  logoutButton: {
    padding: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
  refreshButton: {
    padding: "9px 13px",
    border: "1px solid #c7d2fe",
    borderRadius: "8px",
    background: "#eef2ff",
    color: "#4338ca",
    cursor: "pointer",
  },
  message: {
    padding: "24px 10px",
    color: "#64748b",
    textAlign: "center",
  },
  error: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "16px",
    marginBottom: "20px",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "8px",
  },
  retryButton: {
    padding: "6px 10px",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
  },
  disclaimer: { color: "#94a3b8", fontSize: "12px" },
};
