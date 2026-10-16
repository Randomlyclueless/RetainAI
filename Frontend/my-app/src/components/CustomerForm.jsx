
import React, { useState } from "react";
import axios from "axios";

const initialFormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  tenure: "",
  monthlyCharges: "",
  totalCharges: "",
  contract: "1",
  internetService: "1",
  paymentMethod: "1",
};

const fields = [
  { name: "name", label: "Customer name", type: "text", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  { name: "company", label: "Company", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "tenure", label: "Tenure (months)", type: "number", required: true },
  {
    name: "monthlyCharges",
    label: "Monthly charges",
    type: "number",
    required: true,
  },
  {
    name: "totalCharges",
    label: "Total charges",
    type: "number",
    required: true,
  },
];

export default function CustomerForm({ refreshCustomers }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const customerData = {
        ...formData,
        tenure: Number(formData.tenure),
        monthlyCharges: Number(formData.monthlyCharges),
        totalCharges: Number(formData.totalCharges),
        contract: Number(formData.contract),
        internetService: Number(formData.internetService),
        paymentMethod: Number(formData.paymentMethod),
      };

      await axios.post("http://localhost:8080/customers", customerData);

      setFormData({ ...initialFormData });
      setMessage("Prediction generated and customer saved successfully.");

      if (refreshCustomers) {
        await refreshCustomers();
      }
    } catch (error) {
      console.error("Error saving customer:", error.response?.data || error);
      setMessage(
        error.response?.data?.message ||
          "Could not save the customer. Check the backend logs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Predict customer churn</h2>
      <p style={styles.description}>
        Enter customer details to generate a prediction and save the result.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {fields.map((field) => (
          <label key={field.name} style={styles.field}>
            <span>{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              min={field.type === "number" ? "0" : undefined}
              step={
                ["monthlyCharges", "totalCharges"].includes(field.name)
                  ? "0.01"
                  : field.name === "tenure"
                    ? "1"
                    : undefined
              }
              style={styles.input}
            />
          </label>
        ))}

        <label style={styles.field}>
          <span>Contract</span>
          <select
            name="contract"
            value={formData.contract}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="1">Month-to-Month</option>
            <option value="2">One Year</option>
            <option value="3">Two Year</option>
          </select>
        </label>

        <label style={styles.field}>
          <span>Internet service</span>
          <select
            name="internetService"
            value={formData.internetService}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </label>

        <label style={styles.field}>
          <span>Payment method</span>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="1">Bank Withdrawal</option>
            <option value="2">Credit Card</option>
            <option value="3">Mailed Check</option>
          </select>
        </label>

        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? "Generating prediction..." : "Predict & Save Customer"}
        </button>
      </form>

      {message && (
        <p role="status" style={styles.message}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "24px",
    border: "1px solid #e8edf4",
    borderRadius: "14px",
    boxShadow: "0 3px 12px rgba(15, 23, 42, 0.03)",
  },
  heading: {
    margin: "0 0 8px",
    fontSize: "22px",
    color: "#172033",
  },
  description: {
    margin: "0 0 22px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
  },
  input: {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    padding: "12px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    color: "#172033",
    fontSize: "14px",
  },
  button: {
    gridColumn: "1 / -1",
    padding: "14px 18px",
    background: "#3157d5",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  message: {
    margin: "16px 0 0",
    padding: "12px",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "14px",
  },
};
