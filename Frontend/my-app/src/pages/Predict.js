import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Predict.css";

const Predict = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [formData, setFormData] = useState({
    tenure: "",
    monthlyCharges: "",
    totalCharges: "",
    contract: "",
    internetService: "",
    paymentMethod: ""
  });

  const contractOptions = [
    { value: "", label: "Select Contract Type" },
    { value: "0", label: "Month-to-month" },
    { value: "1", label: "One year" },
    { value: "2", label: "Two year" }
  ];

  const internetOptions = [
    { value: "", label: "Select Internet Service" },
    { value: "0", label: "DSL" },
    { value: "1", label: "Fiber Optic" },
    { value: "2", label: "No Internet" }
  ];

  const paymentOptions = [
    { value: "", label: "Select Payment Method" },
    { value: "0", label: "Electronic Check" },
    { value: "1", label: "Mailed Check" },
    { value: "2", label: "Bank Transfer" },
    { value: "3", label: "Credit Card" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      tenure: "",
      monthlyCharges: "",
      totalCharges: "",
      contract: "",
      internetService: "",
      paymentMethod: ""
    });
    setResult(null);
    setFile(null);
    setAdvice(null);
  };

  const handleSinglePrediction = async () => {
    // Validate required fields
    const requiredFields = ['tenure', 'monthlyCharges', 'totalCharges', 'contract', 'internetService', 'paymentMethod'];
    const isEmpty = requiredFields.some(field => !formData[field]);
    
    if (isEmpty) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8080/customers/ml-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenure: Number(formData.tenure),
          monthlyCharges: Number(formData.monthlyCharges),
          totalCharges: Number(formData.totalCharges),
          contract: Number(formData.contract),
          internetService: Number(formData.internetService),
          paymentMethod: Number(formData.paymentMethod)
        })
      });

      const data = await response.json();
      setResult(data);

      // 🔥 Agent API call
      try {
        const agentRes = await fetch("http://localhost:7000/agent/advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            probability: data.probability,
            tenure: Number(formData.tenure),
            contract: formData.contract
          })
        });

        const agentData = await agentRes.json();
        setAdvice(agentData);
      } catch (err) {
        console.error("Agent error:", err);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPrediction = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    setLoading(true);
    
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/upload-csv", {
        method: "POST",
        body: formDataObj
      });

      if (response.ok) {
        alert("CSV processed successfully! Check results in dashboard.");
        setFile(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to process CSV file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-page">
      {/* Header */}
      <div className="predict-header">
        <h1 className="predict-title">🎯 Customer Churn Prediction</h1>
        <button 
          className="dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          📊 View Dashboard
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="predict-grid">
        
        {/* Left Column - Single Prediction */}
        <div className="prediction-card">
          <div className="card-header">
            <span className="card-icon">🔍</span>
            <h2 className="card-title">Single Customer Prediction</h2>
          </div>
          
          <div className="form-group">
            <label>Tenure (months)</label>
            <input
              type="number"
              name="tenure"
              placeholder="e.g., 24"
              value={formData.tenure}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Monthly Charges ($)</label>
            <input
              type="number"
              name="monthlyCharges"
              placeholder="e.g., 79.85"
              value={formData.monthlyCharges}
              onChange={handleInputChange}
              className="form-input"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Total Charges ($)</label>
            <input
              type="number"
              name="totalCharges"
              placeholder="e.g., 1500.50"
              value={formData.totalCharges}
              onChange={handleInputChange}
              className="form-input"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Contract Type</label>
            <select
              name="contract"
              value={formData.contract}
              onChange={handleInputChange}
              className="form-select"
            >
              {contractOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Internet Service</label>
            <select
              name="internetService"
              value={formData.internetService}
              onChange={handleInputChange}
              className="form-select"
            >
              {internetOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="form-select"
            >
              {paymentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button 
              onClick={handleSinglePrediction}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Processing..." : "Predict Churn Risk"}
            </button>
            <button 
              onClick={resetForm}
              className="btn btn-secondary"
            >
              Reset Form
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`result-card ${result.prediction === 1 ? 'high-risk' : 'low-risk'}`}>
              <div className="result-icon">
                {result.prediction === 1 ? "⚠️" : "✅"}
              </div>
              <div className="result-content">
                <h3 className="result-title">
                  {result.prediction === 1 ? "High Risk of Churn" : "Low Risk of Churn"}
                </h3>
                <div className="result-probability">
                  <div className="probability-bar">
                    <div 
                      className="probability-fill"
                      style={{ width: `${(result.probability * 100)}%` }}
                    ></div>
                  </div>
                  <p className="probability-text">
                    Churn Probability: {(result.probability * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 🔥 AI AGENT OUTPUT */}
          {advice && (
            <div className="result-card" style={{ marginTop: "15px" }}>
              <div className="result-content">
                <h3 className="result-title">🤖 AI Retention Insights</h3>

                <p><strong>Reason:</strong> {advice.reason}</p>

                <p><strong>Recommended Actions:</strong></p>
                <pre style={{ whiteSpace: "pre-wrap", marginTop: "5px" }}>
                  {advice.recommendation}
                </pre>

                <p><strong>Email Subject:</strong> {advice.email_subject}</p>

                <p><strong>Email Content:</strong></p>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {advice.email_body}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Bulk Prediction */}
        <div className="prediction-card">
          <div className="card-header">
            <span className="card-icon">📁</span>
            <h2 className="card-title">Bulk Prediction</h2>
          </div>

          <div className="bulk-content">
            <div className="upload-icon">📄</div>
            <p className="upload-text">
              Upload CSV file with multiple customer records
            </p>
            <p className="upload-hint">
              File should contain columns: tenure, monthlyCharges, totalCharges, 
              contract, internetService, paymentMethod
            </p>
            
            <label className="file-upload-label">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-upload-button">
                📂 Choose CSV File
              </span>
            </label>

            {file && (
              <div className="file-info">
                <span className="file-name">📎 {file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}

            <button 
              onClick={handleBulkPrediction}
              disabled={loading || !file}
              className="btn btn-bulk"
            >
              {loading ? "Uploading..." : "Upload & Process CSV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;