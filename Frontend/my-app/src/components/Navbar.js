import React from "react";

function Navbar() {
  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>RetainAI</h2>
    </div>
  );
}

const styles = {
  nav: {
    padding: "20px 50px",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "24px",
    color: "#fff",
    letterSpacing: "1px",
  },
};

export default Navbar;