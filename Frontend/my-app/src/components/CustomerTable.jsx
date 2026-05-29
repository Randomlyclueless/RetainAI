import React, { useState } from "react";

export default function CustomerTable({ customers }) {

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 5;

  // SEARCH
  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(search.toLowerCase()) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  // SORT
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {

    if (typeof a[sortField] === "string") {
      return a[sortField].localeCompare(b[sortField]);
    }

    return a[sortField] - b[sortField];

  });

  // PAGINATION
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;

  const currentCustomers =
    sortedCustomers.slice(indexOfFirst, indexOfLast);

  const totalPages =
    Math.ceil(sortedCustomers.length / customersPerPage);

  return (

    <div style={styles.container}>

      {/* TOP BAR */}
      <div style={styles.topBar}>

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          style={styles.select}
        >

          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="tenure">Sort by Tenure</option>
          <option value="probability">Sort by Probability</option>

        </select>

      </div>

      {/* TABLE */}
      <table style={styles.table}>

        <thead>

          <tr style={styles.tableHead}>

            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Tenure</th>
            <th style={styles.th}>Risk</th>
            <th style={styles.th}>Probability</th>
            <th style={styles.th}>AI Explanation</th>
            <th style={styles.th}>AI Recommendation</th>

          </tr>

        </thead>

        <tbody>

          {currentCustomers.map((customer) => (

            <tr key={customer.id} style={styles.row}>

              <td style={styles.td}>
                {customer.name}
              </td>

              <td style={styles.td}>
                {customer.email}
              </td>

              <td style={styles.td}>
                {customer.company}
              </td>

              <td style={styles.td}>
                {customer.tenure}
              </td>

              <td style={styles.td}>

                <span
                  style={{
                    ...styles.badge,
                    background:
                      customer.prediction === 1
                        ? "#fee2e2"
                        : "#dcfce7",
                    color:
                      customer.prediction === 1
                        ? "#dc2626"
                        : "#16a34a",
                  }}
                >
                  {customer.prediction === 1
                    ? "High Risk"
                    : "Low Risk"}
                </span>

              </td>

              <td style={styles.td}>
                {(customer.probability * 100).toFixed(1)}%
              </td>

              <td>
                {customer.explanation}
              </td>

              <td>
                {customer.recommendation}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* PAGINATION */}
      <div style={styles.pagination}>

        {[...Array(totalPages)].map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              ...styles.pageBtn,
              background:
                currentPage === index + 1
                  ? "#4f46e5"
                  : "#fff",
              color:
                currentPage === index + 1
                  ? "#fff"
                  : "#111827",
            }}
          >
            {index + 1}
          </button>

        ))}

      </div>

    </div>

  );

}

const styles = {

  container: {
    background: "#fff",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "20px",
    flexWrap: "wrap",
  },

  searchInput: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    minWidth: "250px",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHead: {
    background: "#f9fafb",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    color: "#6b7280",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #f3f4f6",
  },

  row: {
    transition: "0.2s",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  pagination: {
    marginTop: "25px",
    display: "flex",
    gap: "10px",
  },

  pageBtn: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    cursor: "pointer",
  },

};