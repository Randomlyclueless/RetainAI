import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#ffffff",
        padding: "20px 40px",
        marginTop: "50px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        {/* LEFT */}
        <div>
          <span style={{ fontWeight: "600", fontSize: "16px" }}>
            RetainAI
          </span>
          <p style={{ fontSize: "13px", opacity: 0.7, margin: "5px 0 0" }}>
            © {new Date().getFullYear()} RetainAI Intelligence. All rights reserved.
          </p>
        </div>

        {/* CENTER LINKS */}
        <div style={{ display: "flex", gap: "15px", fontSize: "13px" }}>
          <a href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
            Privacy Policy
          </a>
          <a href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
            Terms of Service
          </a>
          <a href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
            Security
          </a>
          <a href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
            Status
          </a>
        </div>

        {/* RIGHT */}
        <div style={{ fontSize: "13px" }}>
          Write to us at{" "}
          <a
            href="mailto:support@retainai.com"
            style={{
              color: "#4f46e5",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            support@retainai.com
          </a>
        </div>

      </div>
    </footer>
  );
}