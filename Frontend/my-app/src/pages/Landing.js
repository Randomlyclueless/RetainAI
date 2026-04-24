import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Pass navigation to Hero */}
      <Hero goToPredict={() => navigate("/predictions")} />

      {/* Optional: also make Features clickable */}
      <Features goToPredict={() => navigate("/predictions")} />

      <div style={styles.footer}>
        <p>© 2026 RetainAI — Smart Retention Starts Here</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1e293b, #0f172a)",
    color: "#fff",
    fontFamily: "Arial",
  },
  footer: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
  },
};

export default Landing;