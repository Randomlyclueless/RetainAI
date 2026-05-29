import React, { useState } from "react";
import axios from "axios";

export default function CustomerForm({ refreshCustomers }) {

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    company: "",
    phone: "",

    tenure: "",
    monthlyCharges: "",
    totalCharges: "",

    contract: 1,
    internetService: 1,
    paymentMethod: 1,

  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const customerData = {

        ...formData,

        prediction: 0,
        probability: 0.0,
        riskLevel: "LOW",

      };

      await axios.post(
        "http://localhost:8080/customers/ml-predict",
        customerData
      );

      alert("Customer Added Successfully!");

      setFormData({

        name: "",
        email: "",
        company: "",
        phone: "",

        tenure: "",
        monthlyCharges: "",
        totalCharges: "",

        contract: 1,
        internetService: 1,
        paymentMethod: 1,

      });

      refreshCustomers();

    } catch (error) {

      console.log(error);

      alert("Error adding customer");

    }

  };

  return (

    <div style={styles.container}>

      <h2 style={styles.heading}>
        Add New Customer
      </h2>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="tenure"
          placeholder="Tenure"
          value={formData.tenure}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          step="0.01"
          name="monthlyCharges"
          placeholder="Monthly Charges"
          value={formData.monthlyCharges}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          step="0.01"
          name="totalCharges"
          placeholder="Total Charges"
          value={formData.totalCharges}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button
          type="submit"
          style={styles.button}
        >
          Add Customer
        </button>

      </form>

    </div>

  );

}

const styles = {

  container: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  heading: {
    marginBottom: "25px",
    color: "#111827",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },

  button: {
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },

};