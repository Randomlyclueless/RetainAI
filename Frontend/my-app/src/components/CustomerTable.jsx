
import React, { useState } from "react";

export default function CustomerTable({ customers = [] }) {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <input
          type="search"
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={styles.search}
        />
        <span style={styles.count}>
          {filteredCustomers.length} customers
        </span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Tenure</th>
              <th style={styles.th}>Risk level</th>
              <th style={styles.th}>Churn probability</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.empty}>
                  {search
                    ? "No matching customers found."
                    : "No customers yet. Add a customer above to get started."}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const risk = customer.riskLevel || "UNKNOWN";
                const riskStyle =
                  risk === "HIGH"
                    ? styles.highRisk
                    : risk === "MEDIUM"
                      ? styles.mediumRisk
                      : risk === "LOW"
                        ? styles.lowRisk
                        : styles.unknownRisk;

                return (
                  <tr key={customer.id}>
                    <td style={styles.td}>
                      <strong>{customer.name || "Unnamed customer"}</strong>
                      <div style={styles.email}>{customer.email || "—"}</div>
                    </td>
                    <td style={styles.td}>
                      {customer.tenure} months
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...riskStyle }}>
                        {risk}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {Number.isFinite(Number(customer.probability))
                        ? `${(Number(customer.probability) * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    border: "1px solid #e8edf4",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(15, 23, 42, 0.03)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  search: {
    flex: "1 1 250px",
    maxWidth: "420px",
    boxSizing: "border-box",
    padding: "11px 13px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    fontSize: "14px",
  },
  count: {
    color: "#64748b",
    fontSize: "13px",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "520px",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "13px 12px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    borderBottom: "1px solid #e8edf4",
  },
  td: {
    padding: "16px 12px",
    color: "#334155",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
  },
  email: {
    marginTop: "5px",
    color: "#64748b",
    fontSize: "12px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
  },
  highRisk: {
    background: "#fee2e2",
    color: "#b91c1c",
  },
  mediumRisk: {
    background: "#fef3c7",
    color: "#92400e",
  },
  lowRisk: {
    background: "#dcfce7",
    color: "#166534",
  },
  unknownRisk: {
    background: "#e2e8f0",
    color: "#475569",
  },
  empty: {
    padding: "32px 12px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
};
