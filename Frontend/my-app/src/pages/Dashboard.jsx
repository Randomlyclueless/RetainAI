import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import AICopilot from "../components/AICopilot";
import FileUpload from "../components/FileUpload";
import AnalyticsCharts from "../components/AnalyticsCharts";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";
import AIInsights from "../components/AIInsights";
import AIExplanationCard from "../components/AIExplanationCard";
import axios from "axios";

export default function Dashboard() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "userEmail"
    );

    navigate("/login");

  };

  const [customers, setCustomers] = useState([]);

  const highRiskCustomer =
      customers.find(
          (customer) =>
              customer.prediction === 1
      );

  const [stats, setStats] = useState({});

  const fetchCustomers = () => {

    axios
        .get("http://localhost:8080/customers")
        .then((response) => {
          setCustomers(response.data);
        })
        .catch((error) => {
          console.log("Error fetching customers:", error);
        });

  };

  const fetchStats = () => {

    axios
        .get("http://localhost:8080/customers/stats")
        .then((response) => {

          setStats(response.data);

        })
        .catch((error) => {

          console.log("Error fetching stats:", error);

        });

  };

  useEffect(() => {

    fetchCustomers();
    fetchStats();

  }, []);

  useEffect(() => {

    const loggedIn =
        localStorage.getItem(
            "isLoggedIn"
        );

    if (!loggedIn) {

      navigate("/login");

    }

  }, [navigate]);

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    console.log(file);
  };

  return (
      <>

        <div style={styles.container}>

          {/* Header */}
          <div style={styles.header}>

            <div>
              <h1 style={styles.heading}>
                Customer Retention Dashboard
              </h1>

              <p style={styles.subtext}>
                Monitor churn analytics and customer predictions in real-time.
              </p>
            </div>

            <div style={styles.actions}>

              <>
                <button
                    style={styles.primaryBtn}
                    onClick={handleUploadClick}
                >
                  Upload Dataset
                </button>

                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
              </>

              <button
                  style={styles.secondaryBtn}
                  onClick={() => navigate("/report")}
              >
                View Reports
              </button>

              <button
                  style={styles.logoutBtn}
                  onClick={logout}
              >
                Logout
              </button>

            </div>

          </div>

          <CustomerForm
              refreshCustomers={() => {
                fetchCustomers();
                fetchStats();
              }}
          />

          {/* Stats Cards */}
          <div style={styles.grid}>

            <div style={styles.card}>

              <p style={styles.cardTitle}>Total Customers</p>

              <h2 style={styles.cardNumber}>
                {stats.totalCustomers || 0}
              </h2>

            </div>

            <div style={styles.card}>

              <p style={styles.cardTitle}>High Risk Customers</p>

              <h2 style={styles.cardNumber}>
                {stats.highRiskCustomers || 0}
              </h2>

            </div>

            <div style={styles.card}>

              <p style={styles.cardTitle}>Predictions Generated</p>

              <h2 style={styles.cardNumber}>
                {stats.totalCustomers || 0}
              </h2>

            </div>

            <div style={styles.card}>

              <p style={styles.cardTitle}>
                Retention Rate
              </p>

              <h2 style={styles.cardNumber}>
                {stats.retentionRate || 0}%
              </h2>

            </div>

          </div>

          <FileUpload
              refreshCustomers={fetchCustomers}
              refreshStats={fetchStats}
          />

          <AnalyticsCharts stats={stats} />

          <AIInsights />

          <AICopilot />

          <CustomerTable customers={customers} />

          <AIExplanationCard
              customer={highRiskCustomer}
          />

          {/* Table */}
          {/* <div style={styles.tableContainer}>

          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>
              Customer Predictions
            </h2>
          </div>

          <table style={styles.table}>

            <thead>

              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Tenure</th>
                <th style={styles.th}>Monthly Charges</th>
                <th style={styles.th}>Total Charges</th>
                <th style={styles.th}>Prediction</th>
                <th style={styles.th}>Probability</th>
              </tr>

            </thead>

            <tbody>

              {customers.map((customer) => (

                <tr
                  key={customer.id}
                  style={styles.tableRow}
                >

                  <td style={styles.td}>
                    {customer.id}
                  </td>

                  <td style={styles.td}>
                    {customer.tenure}
                  </td>

                  <td style={styles.td}>
                    ₹ {customer.monthlyCharges}
                  </td>

                  <td style={styles.td}>
                    ₹ {customer.totalCharges}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.badge,
                        background:
                          customer.prediction === 1
                            ? "#fee2e2"
                            : "#dcfce7",
                        color:
                          customer.prediction === 1
                            ? "#dc2626"
                            : "#16a34a",
                      }}
                    >
                      {customer.prediction === 1
                        ? "High Risk"
                        : "Low Risk"}
                    </span>

                  </td>

                  <td style={styles.td}>
                    {(customer.probability * 100).toFixed(1)}%
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div> */}

        </div>



      </>
  );
}

const styles = {

  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "#f3f4f6",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },

  heading: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "10px",
  },

  subtext: {
    fontSize: "16px",
    color: "#6b7280",
  },

  actions: {
    display: "flex",
    gap: "15px",
  },

  primaryBtn: {
    padding: "12px 22px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  secondaryBtn: {
    padding: "12px 22px",
    background: "#fff",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },

  card: {
    background: "#fff",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    color: "#6b7280",
    fontSize: "15px",
    marginBottom: "10px",
  },

  cardNumber: {
    fontSize: "40px",
    color: "#4f46e5",
    fontWeight: "700",
  },

  tableContainer: {
    background: "#fff",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    overflowX: "auto",
  },

  tableHeader: {
    marginBottom: "20px",
  },

  tableTitle: {
    fontSize: "24px",
    color: "#111827",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeadRow: {
    background: "#f9fafb",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    color: "#6b7280",
    fontWeight: "600",
    fontSize: "14px",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "18px 16px",
    borderBottom: "1px solid #f3f4f6",
    color: "#111827",
    fontSize: "15px",
  },

  tableRow: {
    transition: "0.2s",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  logoutBtn: {

    background: "#ef4444",

    color: "#ffffff",

    border: "none",

    padding: "14px 22px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "600",

  },

};