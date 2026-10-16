
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

const API = "http://localhost:8080/customers";

export default function Dashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [customerResponse, statsResponse] = await Promise.all([
        axios.get(API),
        axios.get(`${API}/stats`),
      ]);

      setCustomers(customerResponse.data);
      setStats(statsResponse.data);
      setError("");
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(
        "Unable to load dashboard data. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/login");
      return;
    }

    fetchData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const cards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers ?? 0,
      color: "#2563eb",
    },
    {
      label: "Predicted Churn",
      value: stats.highRisk ?? 0,
      color: "#dc2626",
    },
    {
      label: "Predicted Retention",
      value: stats.lowRisk ?? 0,
      color: "#059669",
    },
    {
      label: "Churn Rate",
      value: `${stats.churnRate ?? 0}%`,
      color: "#7c3aed",
    },
  ];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>RETAINAI / OVERVIEW</p>
          <h1 style={styles.title}>Customer Dashboard</h1>
          <p style={styles.subtitle}>
            Monitor customer churn and identify customers who may need attention.
          </p>
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </header>

      {error && <p style={styles.error}>{error}</p>}

      <section style={styles.statsGrid}>
        {cards.map((card) => (
          <article key={card.label} style={styles.statCard}>
            <p style={styles.statLabel}>{card.label}</p>
            <h2 style={{ ...styles.statValue, color: card.color }}>
              {loading ? "—" : card.value}
            </h2>
          </article>
        ))}
      </section>

      <section style={styles.section}>
        <CustomerForm refreshCustomers={fetchData} />
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Customers</h2>
            <p style={styles.sectionSubtitle}>
              Saved customer predictions and risk assessments.
            </p>
          </div>

          <span style={styles.count}>
            {customers.length} customers
          </span>
        </div>

        {loading ? (
          <p style={styles.message}>Loading customers...</p>
        ) : (
          <CustomerTable customers={customers} />
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px clamp(16px, 4vw, 48px)",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  title: {
    fontSize: "clamp(26px, 4vw, 34px)",
    margin: "8px 0",
  },
  subtitle: {
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
  },
  logout: {
    padding: "10px 18px",
    background: "#fff",
    color: "#334155",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 600,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#fff",
    padding: "22px",
    border: "1px solid #e8edf4",
    borderRadius: "14px",
    boxShadow: "0 3px 12px rgba(15, 23, 42, 0.03)",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },
  statValue: {
    fontSize: "32px",
    margin: "14px 0 0",
  },
  section: {
    marginBottom: "26px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "22px",
  },
  sectionSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  count: {
    color: "#475569",
    background: "#e8eef7",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  error: {
    padding: "12px 16px",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "8px",
  },
  message: {
    padding: "24px",
    background: "#fff",
    borderRadius: "12px",
    color: "#64748b",
  },
};
