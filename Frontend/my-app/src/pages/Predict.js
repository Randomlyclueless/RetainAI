import React, { useState } from "react";
import "../styles/predict.css";

function Predict() {
  const [form, setForm] = useState({
    tenure: "", monthlyCharges: "", totalCharges: "",
    contract: "", internetService: "", paymentMethod: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/customers/ml-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenure: Number(form.tenure),
          monthlyCharges: Number(form.monthlyCharges),
          totalCharges: Number(form.totalCharges),
          contract: Number(form.contract),
          internetService: Number(form.internetService),
          paymentMethod: Number(form.paymentMethod)
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ tenure: "", monthlyCharges: "", totalCharges: "", contract: "", internetService: "", paymentMethod: "" });
    setResult(null);
  };

  return (
    <div className="predict-container">
      <div className="predict-card">
        <div className="card-header">
          <div className="header-content">
            <h1>ChurnGuard AI</h1>
            <p>Advanced Customer Churn Prediction</p>
          </div>
        </div>

        <div className="card-body">
          <div className="form-grid">
            <div className="form-column">
              <div className="input-group">
                <label>Tenure (months)</label>
                <input type="number" name="tenure" placeholder="e.g. 24" value={form.tenure} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Monthly Charges ($)</label>
                <input type="number" name="monthlyCharges" placeholder="e.g. 65.50" value={form.monthlyCharges} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Total Charges ($)</label>
                <input type="number" name="totalCharges" placeholder="e.g. 1560.75" value={form.totalCharges} onChange={handleChange} />
              </div>
            </div>

            <div className="form-column">
              <div className="input-group">
                <label>Contract Type</label>
                <select name="contract" value={form.contract} onChange={handleChange}>
                  <option value="">Select Contract</option>
                  <option value="0">Month-to-month</option>
                  <option value="1">One year</option>
                  <option value="2">Two year</option>
                </select>
              </div>
              <div className="input-group">
                <label>Internet Service</label>
                <select name="internetService" value={form.internetService} onChange={handleChange}>
                  <option value="">Select Internet Service</option>
                  <option value="0">DSL</option>
                  <option value="1">Fiber optic</option>
                  <option value="2">No Internet</option>
                </select>
              </div>
              <div className="input-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  <option value="">Select Payment Method</option>
                  <option value="0">Electronic check</option>
                  <option value="1">Mailed check</option>
                  <option value="2">Bank transfer</option>
                  <option value="3">Credit card</option>
                </select>
              </div>
            </div>
          </div>

          <div className="action-area">
            <button className="predict-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Analyzing Risk..." : "Predict Churn Risk"}
            </button>
            <button className="reset-btn" onClick={resetForm}>Reset</button>
          </div>

          {result && (
            <div className={`result-card ${result.prediction === 1 ? 'high-risk' : 'low-risk'}`}>
              <div className="risk-circle">
                <div className="circle-inner">
                  <span className="risk-icon">{result.prediction === 1 ? "⚠️" : "✅"}</span>
                  <span className="probability-value">
                    {(result.probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <h3>{result.prediction === 1 ? "High Churn Risk Detected" : "Low Churn Risk"}</h3>
              <p className="risk-subtitle">
                This customer has a {(result.probability * 100).toFixed(1)}% probability of churning
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predict;