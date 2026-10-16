
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header style={styles.navbar}>
      <nav style={styles.inner}>
        <button
          style={styles.logo}
          onClick={() => navigate("/")}
          aria-label="RetainAI home"
        >
          RetainAI
        </button>

        <div style={styles.actions}>
          {location.pathname !== "/login" && (
            <button
              style={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          )}

          {location.pathname !== "/signup" && (
            <button
              style={styles.signupBtn}
              onClick={() => navigate("/signup")}
            >
              Get started
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

const styles = {
  navbar: {
    width: "100%",
    padding: "0 24px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  inner: {
    maxWidth: "1200px",
    minHeight: "68px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontSize: "22px",
    fontWeight: "750",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  loginBtn: {
    padding: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  signupBtn: {
    padding: "10px 16px",
    border: "1px solid #4f46e5",
    borderRadius: "9px",
    background: "#4f46e5",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
