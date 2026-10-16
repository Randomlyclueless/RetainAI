
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8080";

export default function Report() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [customersResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/customers`),
        fetch(`${API_URL}/customers/stats`),
      ]);

      if (!customersResponse.ok) {
        throw new Error(`Customers API failed: ${customersResponse.status}`);
      }

      if (!statsResponse.ok) {
        throw new Error(`Stats API failed: ${statsResponse.status}`);
      }

      const customerData = await customersResponse.json();
      const statsData = await statsResponse.json();

      // Accept the response formats supported by this page.
      const customerList = Array.isArray(customerData)
        ? customerData
        : Array.isArray(customerData?.value)
        ? customerData.value
        : Array.isArray(customerData?.content)
        ? customerData.content
        : Array.isArray(customerData?.data)
        ? customerData.data
        : null;

      if (!customerList) {
        console.error("Unexpected customers API response:", customerData);
        throw new Error(
          "Could not read customer records. Check the browser Network response."
        );
      }

      setCustomers(customerList);
      setStats(statsData);
    } catch (err) {
      console.error("Report loading failed:", err);
      setError(err.message || "Unable to load report data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const riskCounts = useMemo(() => {
    return customers.reduce(
      (counts, customer) => {
        const risk = String(customer.riskLevel || "").toUpperCase();

        if (risk === "HIGH") counts.high += 1;
        else if (risk === "MEDIUM") counts.medium += 1;
        else if (risk === "LOW") counts.low += 1;

        return counts;
      },
      { high: 0, medium: 0, low: 0 }
    );
  }, [customers]);

  const predictedChurn = useMemo(
    () => customers.filter((c) => Number(c.prediction) === 1).length,
    [customers]
  );

  const predictedRetention = useMemo(
    () => customers.filter((c) => Number(c.prediction) === 0).length,
    [customers]
  );

  const topCustomers = useMemo(
    () =>
      [...customers]
        .sort(
          (a, b) =>
            getProbability(b) - getProbability(a)
        )
        .slice(0, 10),
    [customers]
  );

  const exportCSV = () => {
    if (!customers.length) return;

    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Company",
      "Phone",
      "Tenure (Months)",
      "Monthly Charges",
      "Total Charges",
      "Churn Probability (%)",
      "Risk Level",
      "Prediction",
      "Explanation",
      "Recommendation",
    ];

    const rows = topCustomers.map((customer) => [
      customer.id,
      customer.name,
      customer.email,
      customer.company,
      customer.phone,
      customer.tenure,
      customer.monthlyCharges,
      customer.totalCharges,
      (getProbability(customer) * 100).toFixed(2),
      customer.riskLevel,
      Number(customer.prediction) === 1
        ? "Predicted Churn"
        : "Predicted Retention",
      customer.explanation,
      customer.recommendation,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "retainai-churn-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>RETAINAI / ANALYTICS</p>
            <h1 style={styles.heading}>Churn Reports</h1>
            <p style={styles.subtitle}>
              Analyze predicted customer churn, identify at-risk customers,
              and review retention recommendations.
            </p>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={loadReport}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              type="button"
              style={{
                ...styles.primaryButton,
                opacity: customers.length ? 1 : 0.5,
              }}
              onClick={exportCSV}
              disabled={!customers.length}
            >
              Export CSV
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" style={styles.error}>
            <div>
              <strong>Unable to load report</strong>
              <p style={styles.errorText}>{error}</p>
            </div>
            <button style={styles.retryButton} onClick={loadReport}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={styles.message}>Loading report data...</div>
        ) : !error ? (
          <>
            <section style={styles.statsGrid}>
              <StatCard
                title="Total Customers"
                value={stats?.totalCustomers ?? customers.length}
                note="Customers in the database"
                color="#4f46e5"
                icon="01"
              />

              <StatCard
                title="Predicted Churn"
                value={predictedChurn}
                note="Model predicts they may leave"
                color="#dc2626"
                icon="02"
              />

              <StatCard
                title="High Risk"
                value={riskCounts.high}
                note="Customers with HIGH risk level"
                color="#d97706"
                icon="03"
              />

              <StatCard
                title="Predicted Retention"
                value={predictedRetention}
                note="Model predicts they may stay"
                color="#059669"
                icon="04"
              />
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Risk Distribution</h2>
                  <p style={styles.sectionDescription}>
                    Customers grouped by the risk levels returned by the model.
                  </p>
                </div>

                <span style={styles.countBadge}>
                  {customers.length} customers
                </span>
              </div>

              {customers.length === 0 ? (
                <EmptyState message="No customers available yet. Add a customer from the dashboard to generate report insights." />
              ) : (
                <div style={styles.riskList}>
                  <RiskBar
                    label="High Risk"
                    count={riskCounts.high}
                    total={customers.length}
                    color="#dc2626"
                  />
                  <RiskBar
                    label="Medium Risk"
                    count={riskCounts.medium}
                    total={customers.length}
                    color="#d97706"
                  />
                  <RiskBar
                    label="Low Risk"
                    count={riskCounts.low}
                    total={customers.length}
                    color="#059669"
                  />
                </div>
              )}
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Customers Requiring Attention
                  </h2>
                  <p style={styles.sectionDescription}>
                    The top 10 customers ranked by predicted churn probability.
                  </p>
                </div>
              </div>

              {topCustomers.length === 0 ? (
                <EmptyState message="No customer records are available." />
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Company</th>
                        <th style={styles.th}>Tenure</th>
                        <th style={styles.th}>Monthly Charges</th>
                        <th style={styles.th}>Churn Probability</th>
                        <th style={styles.th}>Risk Level</th>
                      </tr>
                    </thead>

                    <tbody>
                      {topCustomers.map((customer, index) => (
                        <tr key={customer.id ?? customer.email ?? index}>
                          <td style={styles.td}>
                            <strong style={styles.customerName}>
                              {customer.name || "Unnamed customer"}
                            </strong>
                            <div style={styles.email}>
                              {customer.email || "—"}
                            </div>
                          </td>

                          <td style={styles.td}>
                            {customer.company || "—"}
                          </td>

                          <td style={styles.td}>
                            {customer.tenure ?? "—"}
                            {customer.tenure != null ? " months" : ""}
                          </td>

                          <td style={styles.td}>
                            {formatCurrency(customer.monthlyCharges)}
                          </td>

                          <td style={styles.td}>
                            <div style={styles.probabilityCell}>
                              <strong>
                                {(getProbability(customer) * 100).toFixed(2)}%
                              </strong>
                              <div style={styles.miniTrack}>
                                <div
                                  style={{
                                    ...styles.miniFill,
                                    width: `${
                                      getProbability(customer) * 100
                                    }%`,
                                    background: riskColor(customer.riskLevel),
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td style={styles.td}>
                            <RiskBadge level={customer.riskLevel} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Retention Recommendations
                  </h2>
                  <p style={styles.sectionDescription}>
                    Suggestions returned by the prediction service for
                    customers predicted to churn.
                  </p>
                </div>
              </div>

              {topCustomers.filter((c) => Number(c.prediction) === 1).length ===
              0 ? (
                <EmptyState message="No customers are currently predicted to churn." />
              ) : (
                <div style={styles.recommendationList}>
                  {topCustomers
                    .filter((c) => Number(c.prediction) === 1)
                    .slice(0, 5)
                    .map((customer) => (
                      <article
                        key={customer.id}
                        style={styles.recommendationCard}
                      >
                        <div style={styles.recommendationHeader}>
                          <div>
                            <h3 style={styles.customerHeading}>
                              {customer.name || "Unnamed customer"}
                            </h3>
                            <p style={styles.email}>{customer.email || "—"}</p>
                          </div>

                          <RiskBadge level={customer.riskLevel} />
                        </div>

                        <div style={styles.recommendationDetails}>
                          <span>
                            Churn probability:{" "}
                            <strong>
                              {(getProbability(customer) * 100).toFixed(2)}%
                            </strong>
                          </span>
                        </div>

                        <p style={styles.recommendationText}>
                          {customer.recommendation ||
                            "Review the customer's account and service experience."}
                        </p>

                        {customer.explanation && (
                          <p style={styles.explanation}>
                            {customer.explanation}
                          </p>
                        )}
                      </article>
                    ))}
                </div>
              )}
            </section>

            <div style={styles.disclaimer}>
              Churn probability and risk level are model predictions, not
              confirmed customer departures. Retention recommendations are
              suggestions and should be reviewed before taking action.
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

function getProbability(customer) {
  const probability = Number(customer.probability ?? 0);

  if (!Number.isFinite(probability)) return 0;

  return Math.min(1, Math.max(0, probability > 1 ? probability / 100 : probability));
}

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function riskColor(level) {
  switch (String(level || "").toUpperCase()) {
    case "HIGH":
      return "#dc2626";
    case "MEDIUM":
      return "#d97706";
    case "LOW":
      return "#059669";
    default:
      return "#64748b";
  }
}

function StatCard({ title, value, note, color, icon }) {
  return (
    <article style={styles.statCard}>
      <div style={styles.statTop}>
        <p style={styles.statTitle}>{title}</p>
        <span style={{ ...styles.statIcon, color }}>{icon}</span>
      </div>
      <h2 style={{ ...styles.statValue, color }}>{value}</h2>
      <p style={styles.statNote}>{note}</p>
    </article>
  );
}

function RiskBar({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div style={styles.riskRow}>
      <div style={styles.riskLabels}>
        <span>{label}</span>
        <strong>
          {count} · {percentage.toFixed(1)}%
        </strong>
      </div>

      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ level }) {
  const normalized = String(level || "UNKNOWN").toUpperCase();
  const color = riskColor(normalized);

  return (
    <span
      style={{
        ...styles.riskBadge,
        color,
        background: `${color}18`,
      }}
    >
      {normalized}
    </span>
  );
}

function EmptyState({ message }) {
  return <div style={styles.emptyState}>{message}</div>;
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "36px 24px 56px",
    background: "#f5f7fb",
    color: "#111827",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 28,
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#4f46e5",
    fontSize: 11,
    fontWeight: 750,
    letterSpacing: "1.5px",
  },
  heading: {
    margin: "0 0 8px",
    fontSize: 32,
    fontWeight: 750,
    letterSpacing: "-1px",
  },
  subtitle: {
    maxWidth: 680,
    margin: 0,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    padding: "11px 16px",
    border: "1px solid #4f46e5",
    borderRadius: 9,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 650,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "11px 16px",
    border: "1px solid #dbe2ee",
    borderRadius: 9,
    background: "#fff",
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  statCard: {
    padding: 22,
    border: "1px solid #e8edf5",
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(15,23,42,.025)",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  statTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 13,
  },
  statIcon: {
    display: "grid",
    placeItems: "center",
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "#f1f5f9",
    fontSize: 11,
    fontWeight: 750,
  },
  statValue: {
    margin: "16px 0 8px",
    fontSize: 30,
    fontWeight: 750,
  },
  statNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 12,
  },
  panel: {
    marginBottom: 22,
    padding: 24,
    border: "1px solid #e8edf5",
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(15,23,42,.025)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    margin: "0 0 7px",
    fontSize: 18,
    fontWeight: 700,
  },
  sectionDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.7,
  },
  countBadge: {
    padding: "7px 10px",
    borderRadius: 7,
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: 12,
    fontWeight: 650,
  },
  riskList: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  riskRow: {
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  riskLabels: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    color: "#475569",
    fontSize: 13,
  },
  track: {
    height: 9,
    overflow: "hidden",
    borderRadius: 999,
    background: "#eef2f7",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 250ms ease",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "13px 14px",
    borderBottom: "1px solid #e8edf5",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 14px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontSize: 13,
    whiteSpace: "nowrap",
  },
  customerName: {
    display: "block",
    marginBottom: 4,
    color: "#111827",
  },
  email: {
    color: "#94a3b8",
    fontSize: 12,
  },
  probabilityCell: {
    minWidth: 115,
  },
  miniTrack: {
    height: 5,
    marginTop: 7,
    borderRadius: 999,
    background: "#eef2f7",
    overflow: "hidden",
  },
  miniFill: {
    height: "100%",
    borderRadius: 999,
  },
  riskBadge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 750,
    letterSpacing: "0.4px",
  },
  recommendationList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  recommendationCard: {
    padding: 18,
    border: "1px solid #e8edf5",
    borderRadius: 10,
    background: "#fbfcff",
  },
  recommendationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  customerHeading: {
    margin: "0 0 5px",
    fontSize: 14,
    fontWeight: 700,
  },
  recommendationDetails: {
    marginTop: 14,
    color: "#475569",
    fontSize: 12,
  },
  recommendationText: {
    margin: "12px 0 6px",
    color: "#334155",
    fontSize: 13,
    lineHeight: 1.7,
  },
  explanation: {
    margin: 0,
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.7,
  },
  emptyState: {
    padding: "28px 12px",
    color: "#64748b",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 1.7,
  },
  message: {
    padding: "28px 12px",
    color: "#64748b",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 1.7,
  },
  error: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    padding: 16,
    marginBottom: 20,
    border: "1px solid #fecaca",
    borderRadius: 9,
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 14,
  },
  errorText: {
    margin: "6px 0 0",
    lineHeight: 1.6,
  },
  retryButton: {
    padding: "8px 12px",
    border: "1px solid #fca5a5",
    borderRadius: 7,
    background: "#fff",
    color: "#b91c1c",
    cursor: "pointer",
  },
  disclaimer: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.7,
  },
};
