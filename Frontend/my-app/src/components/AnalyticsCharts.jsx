import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,

  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,

  LineChart,
  Line,

} from "recharts";

export default function AnalyticsCharts({ stats }) {

  // PIE CHART DATA
  const pieData = [

    {
      name: "High Risk",
      value: stats.highRiskCustomers || 0,
    },

    {
      name: "Low Risk",
      value: stats.lowRiskCustomers || 0,
    },

  ];

  // BAR CHART DATA
  const contractData = [

    {
      name: "Month-to-Month",
      customers: 45,
    },

    {
      name: "One Year",
      customers: 30,
    },

    {
      name: "Two Year",
      customers: 25,
    },

  ];

  // LINE CHART DATA
  const churnTrendData = [

    {
      month: "Jan",
      churn: 12,
    },

    {
      month: "Feb",
      churn: 18,
    },

    {
      month: "Mar",
      churn: 10,
    },

    {
      month: "Apr",
      churn: 15,
    },

    {
      month: "May",
      churn: 9,
    },

    {
      month: "Jun",
      churn: 6,
    },

  ];

  const COLORS = [
    "#ef4444",
    "#22c55e",
  ];

  return (

    <div style={styles.container}>

      {/* PIE CHART */}
      <div style={styles.chartCard}>

        <h3 style={styles.chartTitle}>
          Customer Risk Distribution
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >

              {pieData.map((entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* BAR CHART */}
      <div style={styles.chartCard}>

        <h3 style={styles.chartTitle}>
          Contract Type Analysis
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={contractData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="customers"
              fill="#4f46e5"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* LINE CHART */}
      <div style={styles.chartCard}>

        <h3 style={styles.chartTitle}>
          Monthly Churn Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={churnTrendData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="churn"
              stroke="#ef4444"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

const styles = {

  container: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",

    gap: "25px",

    marginBottom: "40px",

  },

  chartCard: {

    background: "#fff",

    padding: "25px",

    borderRadius: "20px",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.06)",

  },

  chartTitle: {

    marginBottom: "20px",

    color: "#111827",

    fontSize: "20px",

    fontWeight: "600",

  },

};