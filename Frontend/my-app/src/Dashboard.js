import React, { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/customers/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Churn Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Customers</h3>
          <p>{stats.totalCustomers}</p>
        </div>

        <div style={cardStyle}>
          <h3>High Risk</h3>
          <p>{stats.highRisk}</p>
        </div>

        <div style={cardStyle}>
          <h3>Low Risk</h3>
          <p>{stats.lowRisk}</p>
        </div>

        <div style={cardStyle}>
          <h3>Churn Rate</h3>
          <p>{stats.churnRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "150px",
  textAlign: "center",
};

export default Dashboard;