
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar2({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <>
      <header style={styles.navbar}>
        <nav style={styles.inner}>
          <div style={styles.left}>
            <span
              style={styles.logo}
              onClick={() => navigate("/dashboard")}
            >
              RetainAI
            </span>

            <div style={styles.links}>
              <span
                style={
                  location.pathname === "/dashboard"
                    ? styles.activeLink
                    : styles.link
                }
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>

              <span
                style={
                  location.pathname === "/report"
                    ? styles.activeLink
                    : styles.link
                }
                onClick={() => navigate("/report")}
              >
                Report
              </span>
            </div>
          </div>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}

const styles = {
  navbar: {
    width: "100%",
    padding: "18px 32px",
    boxSizing: "border-box",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  logo: {
    fontSize: "21px",
    fontWeight: "700",
    color: "#4f46e5",
    cursor: "pointer",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  link: {
    fontSize: "14px",
    color: "#6b7280",
    cursor: "pointer",
  },
  activeLink: {
    fontSize: "14px",
    color: "#4f46e5",
    fontWeight: "600",
    borderBottom: "2px solid #4f46e5",
    paddingBottom: "5px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "9px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
