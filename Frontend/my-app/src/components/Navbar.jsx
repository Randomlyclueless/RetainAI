import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header style={styles.navbar}>
      <nav style={styles.inner}>

        {/* LEFT */}
        <div style={styles.left}>
          <span style={styles.logo} onClick={() => navigate("/")}>
            RetainAI
          </span>

          <div style={styles.links}>
            <span
              style={styles.activeLink}
              onClick={() => navigate("/features")}
            >Features </span>
            <span
              style={styles.activeLink}
              onClick={() => navigate("/working")}
            >
              How it Works
            </span>
            <span
              style={styles.activeLink}
              onClick={() => navigate("/pricing")}
            >Pricing </span>
            <span
              style={styles.activeLink}
              onClick={() => navigate("/resources")}
            >Resources </span>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <button
            style={styles.ctaBtn}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>

      </nav>
    </header>
  );
}

const styles = {
  navbar: {
    width: "100%",
    padding: "30px 40px",
    background: "#ffffff",   // ✅ white background
    borderBottom: "1px solid #e5e7eb", // subtle border
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#4f46e5",  // ✅ purple like your image
    cursor: "pointer",
  },

  links: {
    display: "flex",
    gap: "20px",
  },

  link: {
    fontSize: "14px",
    color: "#6b7280", // gray
    cursor: "pointer",
  },

  activeLink: {
    fontSize: "14px",
    color: "#4f46e5", // active = purple
    fontWeight: "500",
    borderBottom: "2px solid #4f46e5",
    paddingBottom: "2px",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    gap: "12px",
  },

  loginBtn: {
    padding: "8px 14px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "6px",
    cursor: "pointer",
  },

  ctaBtn: {
    padding: "8px 14px",
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
};