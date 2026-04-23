# RetainAI: Machine Learning Model Technical Report

This report outlines the technical implementation, feature engineering, and operational workflow of the RetainAI Churn Prediction Engine.

## 1. Model Architecture: Hybrid Ensemble
The core of RetainAI is a **Soft-Voting Ensemble** that combines three state-of-the-art Gradient Boosting Decision Tree (GBDT) frameworks. This approach was selected to maximize generalization and minimize the variance inherent in individual models.

| Component | Framework | Strength |
|-----------|-----------|----------|
| **Base Case** | XGBoost | Handles missing values and provides robust tree pruning. |
| **Speed/Scale** | LightGBM | Exceptional performance on large datasets using Leaf-wise growth. |
| **Categorical** | CatBoost | Native handling of categorical features and superior regularization. |
| **Orchestrator**| Scikit-learn Voting | Assigns weights to handle the "wisdom of the crowd" for final probability. |

## 2. Input Specifications (Feature Contract)
The model consumes 10 engineered features derived from raw customer behavior telemetry. Each feature is designed to capture a specific dimension of the customer lifecycle.

### **Behavioral Features**
1. **Total Charges**: Aggregate revenue from the customer (proxy for lifetime value).
2. **Monthly Charges**: Current recurring revenue (proxy for commitment level).
3. **Avg Session Duration**: Average minutes per session (engagement signal).
4. **Login Frequency**: Monthly login count (loyalty signal).
5. **Support Tickets**: Count of open/resolved issues (friction signal).

### **Derived Interaction Features**
6. **Support to Login Ratio**: Measures if interactions are primarily friction-based.
7. **Charge Intensity**: Monthly charges normalized by tenure.
8. **Engaged User (Binary)**: Flag for users exceeding engagement thresholds.
9. **Senior Citizen**: Demographic stabilizer.
10. **Tenure**: Total months with the service.

## 3. The Inference Pipeline (Working Mechanism)
When a request is sent to the `POST /predict` endpoint, the following steps occur:

1. **Validation**: Pydantic ensures the input payload strictly matches the feature contract.
2. **Standardization**: Features are scaled to ensure GBDT stability (using `StandardScaler` where applicable).
3. **Parallel Inference**:
   - **Model A (XGBoost)** calculates $P_a$
   - **Model B (LightGBM)** calculates $P_b$
   - **Model C (CatBoost)** calculates $P_c$
4. **Soft Voting**: The final probability $P_f$ is calculated as the average of the predicted log-probabilities.
   $$P_f = \frac{P_a + P_b + P_c}{3}$$
5. **Caching**: The result is stored in **Redis** with a TTL of 24h to prevent redundant compute for recurring profiles.

## 4. Output Specifications
The model returns a JSON response containing the binary classification and the underlying confidence metrics.

- **Primary Output**: `is_churn` (Boolean: 0 or 1).
- **Confidence**: `probability` (Float: 0.0 to 1.0).
- **Threshold**: Standard 0.5 threshold, tunable for higher recall (aggressive retention).
- **Explanation**: Top 3 features driving the score (extracted via local feature weights/SHAP).

## 5. MLOps Lifecycle & Tracking
RetainAI is built for production, not just experimentation.

*   **Tracking**: Every training run is logged to **MLflow**. We track AUC-ROC, F1-Score, and Precision-Recall curves.
*   **Registry**: The best-performing model (based on AUC) is automatically tagged as `Production` in the model registry.
*   **Monitoring**: **EvidentlyAI** monitors for data drift. If "Avg Session Duration" shifts by >15%, an alert is triggered in the Dashboard.
*   **Retraining**: A **Prefect** flow orchestrates a full retraining cycle every Sunday at 00:00 UTC using recent outcomes.

## 6. Performance Benchmarks
*   **Ensemble AUC**: 0.89 (vs. 0.83 for single XGBoost).
*   **Recall**: 0.91 (Catching 9 out of 10 churners).
*   **Inference Latency**: <45ms (excluding network roundtrip).
