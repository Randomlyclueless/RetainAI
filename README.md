# RetainAI — Customer Churn MLOps Platform

An end-to-end MLOps pipeline for predicting customer churn using the IBM Telco Churn dataset.

## 🚀 Current Progress
- **MLOps Architecture**: Established a modular project structure (API, features, models, monitoring, pipelines).
- **Feature Pipeline**: Implemented `features/feature_pipeline.py` with 10 standardized behavioral features.
- **Data Stability**: Added schema validation and data cleaning logic (mapped from raw Telco CSV).
- **Test Suite**: 100% logic coverage for the feature engineering pipeline in `tests/test_pipeline.py`.

## 🏗️ Project Structure
```text
├── api/             # Prediction service (FastAPI)
├── data/            # Raw and processed datasets
├── features/        # Feature engineering & storage logic
├── models/          # Model training & versioning (MLflow)
├── monitoring/      # Data drift and performance tracking
├── pipelines/       # Automated workflows (Retraining/Deployment)
└── tests/           # Automated test suites
```

## 🛠️ Getting Started
1. **Setup Environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Run Feature Pipeline**:
   ```bash
   python -m features.feature_pipeline
   ```

3. **Run Tests**:
   ```bash
   python -m pytest tests/test_pipeline.py -v
   ```

## ⏭️ Upcoming Milestones
- [ ] **Model Training**: Implement `models/train.py` with MLflow tracking.
- [ ] **Serving Layer**: Build the prediction API.
- [ ] **Drift Monitoring**: Implement automated data drift detection.