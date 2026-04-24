import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./Dashboard.css";

// Mapping for backend values to display names
const contractMap = ["Month-to-month", "One year", "Two year"];
const internetMap = ["DSL", "Fiber optic", "No"];
const paymentMap = ["Electronic", "Mail", "Bank", "Card"];

const Dashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  // ✅ CHANGED: Now fetches from backend API instead of localStorage
  const loadPredictions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/customers");
      setPredictions(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Memoized statistics for performance
  const statistics = useMemo(() => {
    const total = predictions.length;
    const highRisk = predictions.filter(p => p.prediction === 1).length;
    const lowRisk = total - highRisk;
    const avgProbability = total > 0
      ? (predictions.reduce((sum, p) => sum + p.probability, 0) / total) * 100
      : 0;
    
    // Contract distribution - FIXED with mapping
    const contractStats = {
      "Month-to-month": { count: 0, totalRisk: 0, avgRisk: 0 },
      "One year": { count: 0, totalRisk: 0, avgRisk: 0 },
      "Two year": { count: 0, totalRisk: 0, avgRisk: 0 }
    };
    
    predictions.forEach(p => {
      const contract = contractMap[p.contract];
      if (contractStats[contract]) {
        contractStats[contract].count++;
        contractStats[contract].totalRisk += p.probability;
      }
    });
    
    Object.keys(contractStats).forEach(key => {
      if (contractStats[key].count > 0) {
        contractStats[key].avgRisk = (contractStats[key].totalRisk / contractStats[key].count) * 100;
      }
    });
    
    // Tenure buckets
    const tenureBuckets = {
      "0-6 months": { count: 0, totalRisk: 0, avgRisk: 0 },
      "7-12 months": { count: 0, totalRisk: 0, avgRisk: 0 },
      "13-24 months": { count: 0, totalRisk: 0, avgRisk: 0 },
      "25+ months": { count: 0, totalRisk: 0, avgRisk: 0 }
    };
    
    predictions.forEach(p => {
      if (p.tenure <= 6) {
        tenureBuckets["0-6 months"].count++;
        tenureBuckets["0-6 months"].totalRisk += p.probability;
      } else if (p.tenure <= 12) {
        tenureBuckets["7-12 months"].count++;
        tenureBuckets["7-12 months"].totalRisk += p.probability;
      } else if (p.tenure <= 24) {
        tenureBuckets["13-24 months"].count++;
        tenureBuckets["13-24 months"].totalRisk += p.probability;
      } else {
        tenureBuckets["25+ months"].count++;
        tenureBuckets["25+ months"].totalRisk += p.probability;
      }
    });
    
    Object.keys(tenureBuckets).forEach(key => {
      if (tenureBuckets[key].count > 0) {
        tenureBuckets[key].avgRisk = (tenureBuckets[key].totalRisk / tenureBuckets[key].count) * 100;
      }
    });
    
    // Internet service distribution - FIXED with mapping
    const internetStats = {
      "Fiber optic": 0,
      "DSL": 0,
      "No": 0
    };
    
    predictions.forEach(p => {
      const service = internetMap[p.internetService];
      if (internetStats[service] !== undefined) {
        internetStats[service]++;
      }
    });
    
    return {
      total,
      highRisk,
      lowRisk,
      avgProbability,
      highRiskPercent: total > 0 ? (highRisk / total) * 100 : 0,
      contractStats,
      tenureBuckets,
      internetStats
    };
  }, [predictions]);

  const getRiskLevel = (probability) => {
    if (probability >= 70) return { text: "Critical", color: "#EF4444", icon: "🔴" };
    if (probability >= 50) return { text: "High", color: "#F59E0B", icon: "⚠️" };
    if (probability >= 30) return { text: "Medium", color: "#FBBF24", icon: "📊" };
    return { text: "Low", color: "#10B981", icon: "✅" };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🎯 RetainAI Analytics Dashboard</h1>
          <p className="dashboard-subtitle">Customer churn prediction insights & analytics</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={loadPredictions}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{statistics.total}</h3>
            <p className="kpi-label">Total Predictions</p>
          </div>
        </div>
        
        <div className="kpi-card warning">
          <div className="kpi-icon">⚠️</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{statistics.highRisk}</h3>
            <p className="kpi-label">High Risk Customers</p>
            <span className="kpi-trend">{statistics.highRiskPercent.toFixed(1)}% of total</span>
          </div>
        </div>
        
        <div className="kpi-card success">
          <div className="kpi-icon">✅</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{statistics.lowRisk}</h3>
            <p className="kpi-label">Low Risk Customers</p>
          </div>
        </div>
        
        <div className="kpi-card primary">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{statistics.avgProbability.toFixed(1)}%</h3>
            <p className="kpi-label">Average Risk Score</p>
          </div>
        </div>
      </div>

      {/* Risk Distribution - Simple CSS Chart */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Risk Distribution</h3>
            <p className="chart-subtitle">High risk vs low risk customers</p>
          </div>
          <div className="simple-chart">
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div 
                  className="pie-segment high-risk-segment" 
                  style={{ 
                    transform: `rotate(${(statistics.highRiskPercent / 100) * 360}deg)`,
                    background: `conic-gradient(#F59E0B 0deg ${(statistics.highRiskPercent / 100) * 360}deg, #10B981 ${(statistics.highRiskPercent / 100) * 360}deg 360deg)`
                  }}
                >
                  <div className="pie-inner"></div>
                </div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-color high-risk"></span>
                  <span>High Risk: {statistics.highRisk} ({statistics.highRiskPercent.toFixed(1)}%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color low-risk"></span>
                  <span>Low Risk: {statistics.lowRisk} ({((statistics.lowRisk/statistics.total)*100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Analysis Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Contract Type Risk Analysis</h3>
            <p className="chart-subtitle">Month-to-month contracts show highest risk</p>
          </div>
          <div className="bar-chart">
            {Object.entries(statistics.contractStats).map(([contract, data]) => (
              <div key={contract} className="bar-item">
                <div className="bar-label">{contract}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${data.avgRisk}%`,
                      backgroundColor: data.avgRisk > 50 ? "#F59E0B" : "#10B981"
                    }}
                  >
                    <span className="bar-value">{data.avgRisk.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="bar-count">({data.count} customers)</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenure Analysis */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tenure vs Risk Analysis</h3>
            <p className="chart-subtitle">Higher tenure typically means lower risk</p>
          </div>
          <div className="bar-chart">
            {Object.entries(statistics.tenureBuckets).map(([tenure, data]) => (
              <div key={tenure} className="bar-item">
                <div className="bar-label">{tenure}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${data.avgRisk}%`,
                      backgroundColor: "#3B82F6"
                    }}
                  >
                    <span className="bar-value">{data.avgRisk.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="bar-count">({data.count} customers)</div>
              </div>
            ))}
          </div>
        </div>

        {/* Internet Service Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Internet Service Distribution</h3>
            <p className="chart-subtitle">Fiber optic users have higher churn tendency</p>
          </div>
          <div className="horizontal-bars">
            {Object.entries(statistics.internetStats).map(([service, count]) => {
              const percentage = (count / statistics.total) * 100;
              return (
                <div key={service} className="hbar-item">
                  <div className="hbar-label">{service}</div>
                  <div className="hbar-wrapper">
                    <div 
                      className="hbar-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: service === "Fiber optic" ? "#8B5CF6" : service === "DSL" ? "#3B82F6" : "#64748B"
                      }}
                    >
                      <span className="hbar-value">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">📋 Recent Predictions</h3>
          <span className="table-count">{predictions.length} total records</span>
        </div>
        
        <div className="table-responsive">
          <table className="predictions-table">
            <thead>
              <tr>
                <th>Tenure</th>
                <th>Monthly</th>
                <th>Total</th>
                <th>Contract</th>
                <th>Internet</th>
                <th>Payment</th>
                <th>Risk</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {predictions.slice().reverse().slice(0, 10).map((prediction, index) => {
                const riskLevel = getRiskLevel(prediction.probability * 100);
                return (
                  <tr key={index}>
                    <td>{prediction.tenure} mo</td>
                    <td>${prediction.monthlyCharges}</td>
                    <td>${prediction.totalCharges}</td>
                    {/* ✅ FIXED: Using maps to display readable values */}
                    <td>{contractMap[prediction.contract]}</td>
                    <td>{internetMap[prediction.internetService]}</td>
                    <td>{paymentMap[prediction.paymentMethod]}</td>
                    <td>
                      <span className="risk-badge" style={{ backgroundColor: riskLevel.color }}>
                        {riskLevel.icon} {riskLevel.text}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${prediction.probability * 100}%`,
                            backgroundColor: riskLevel.color
                          }}
                        />
                        <span className="progress-text">
                          {(prediction.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {predictions.length === 0 && (
          <div className="empty-state">
            <p>No predictions yet. Make some predictions to see data!</p>
          </div>
        )}
      </div>

      {/* Insight Section */}
      {predictions.length > 0 && (
        <div className="insights-section">
          <div className="insight-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h4>Key Insight</h4>
              <p>
                {statistics.avgProbability > 60
                  ? "⚠️ Critical: High churn risk detected. Implement immediate retention strategies focusing on month-to-month contract customers."
                  : statistics.avgProbability > 40
                  ? "📊 Moderate risk: Consider targeted campaigns for high-risk segments and loyalty programs."
                  : "✅ Healthy: Low churn risk overall. Maintain current strategies and monitor fiber optic customers."}
              </p>
            </div>
          </div>
          
          <div className="recommendations">
            <h4>🎯 Recommendations</h4>
            <ul>
              {statistics.contractStats["Month-to-month"]?.avgRisk > 50 && (
                <li>🏆 Offer contract conversion incentives for month-to-month customers</li>
              )}
              {statistics.internetStats["Fiber optic"] > (statistics.total * 0.3) && (
                <li>🌐 Fiber optic customers show higher risk - consider loyalty programs</li>
              )}
              {statistics.tenureBuckets["0-6 months"]?.avgRisk > 50 && (
                <li>🆕 New customers (0-6 months) have high churn rate - improve onboarding</li>
              )}
              <li>📞 Implement proactive customer support for high-risk segments</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;