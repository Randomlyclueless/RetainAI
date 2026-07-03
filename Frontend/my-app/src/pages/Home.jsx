import Navbar2 from "../components/Navbar2";
import React, { useRef } from "react";
export default function Home() {
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
        {/*<Navbar2 />*/}

        <div style={styles.container}>
          {/* Welcome */}
          <h1 style={styles.heading}>Welcome to RetainAI 👋</h1>
          <p style={styles.subtext}>
            Start by uploading your dataset to predict customer churn.
          </p>

          {/* Main Action */}
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

          {/* Placeholder Card */}
          <div style={styles.card}>
            <h3>No Data Yet</h3>
            <p>
              Upload your first dataset to begin analysis and see insights here.
            </p>
          </div>
        </div>
      </>
  );
}

const styles = {
  container: {
    padding: "40px",
    minHeight: "calc(100vh - 100px)", // Adjusted for navbar
    background: "#f9fafb",
  },

  heading: {
    fontSize: "32px",
    marginBottom: "12px",
    color: "#111827",
    fontWeight: "700",
  },

  subtext: {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#6b7280",
    maxWidth: "600px",
  },

  primaryBtn: {
    padding: "14px 28px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "40px",
    transition: "all 0.2s",
  },

  card: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    maxWidth: "520px",
    textAlign: "center",
  },
};