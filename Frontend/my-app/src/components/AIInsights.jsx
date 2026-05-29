import React from "react";

export default function AIInsights() {

  const insights = [

    {
      title:
        "High Risk Segment Detected",

      description:
        "Month-to-month customers show elevated churn probability.",
    },

    {
      title:
        "Retention Opportunity",

      description:
        "Customers with high monthly charges respond better to loyalty discounts.",
    },

    {
      title:
        "AI Recommendation",

      description:
        "Promote yearly contracts to reduce churn by estimated 18%.",
    },

  ];

  return (

    <div style={styles.container}>

      <h2 style={styles.heading}>
        AI Retention Insights
      </h2>

      <div style={styles.grid}>

        {insights.map((item, index) => (

          <div
            key={index}
            style={styles.card}
          >

            <h3 style={styles.title}>
              {item.title}
            </h3>

            <p style={styles.description}>
              {item.description}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

const styles = {

  container: {
    marginTop: "40px",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "28px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.05)",
  },

  title: {
    marginBottom: "10px",
    color: "#4f46e5",
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.6",
  },

};