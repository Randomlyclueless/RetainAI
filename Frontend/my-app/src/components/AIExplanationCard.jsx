import React from "react";

export default function AIExplanationCard({

  customer

}) {

  if (
    !customer ||
    !customer.explanation
  ) {

    return null;

  }

  // Convert explanation string into array
  const explanations =
    customer.explanation
      .replace("[", "")
      .replace("]", "")
      .split(",");

  return (

    <div style={styles.card}>

      <div style={styles.header}>

        <h2 style={styles.title}>
          Top AI Factors
        </h2>

        <span style={styles.badge}>
          AI Powered
        </span>

      </div>

      <p style={styles.subtitle}>
        Why this customer may churn
      </p>

      <div style={styles.factorContainer}>

        {explanations.map(
          (factor, index) => (

            <div
              key={index}
              style={styles.factor}
            >

              ⚠ {factor.trim()}

            </div>

          )
        )}

      </div>

    </div>

  );

}

const styles = {

  card: {

    background: "#ffffff",

    padding: "30px",

    borderRadius: "20px",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.05)",

    marginTop: "30px",

  },

  header: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "10px",

  },

  title: {

    fontSize: "24px",

    color: "#111827",

  },

  badge: {

    background: "#ede9fe",

    color: "#4f46e5",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "14px",

    fontWeight: "600",

  },

  subtitle: {

    color: "#6b7280",

    marginBottom: "20px",

  },

  factorContainer: {

    display: "flex",

    flexDirection: "column",

    gap: "15px",

  },

  factor: {

    background: "#fff7ed",

    border:
      "1px solid #fdba74",

    color: "#9a3412",

    padding: "14px 18px",

    borderRadius: "12px",

    fontWeight: "500",

  },

};