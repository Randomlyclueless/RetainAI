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
# 🚀 RetainAI – Customer Churn Prediction System

## 📌 Overview
RetainAI is a full-stack machine learning system that predicts customer churn, stores results in a database, and provides analytics via a dashboard.

---

## 🧠 Architecture

Frontend (React)  
↓  
Backend (Spring Boot)  
↓  
ML API (Flask)  
↓  
MySQL Database  

---

## 📁 Project Structure

RetainAI/
│
├── backend/              # Spring Boot (Java backend)
│   ├── controller/       # Handles API requests
│   ├── service/          # Business logic + ML integration
│   ├── repository/       # Database operations (JPA)
│   ├── model/            # Entity (DB table structure)
│   ├── BackendApplication.java  # Main entry point
│   └── application.properties   # DB + config
│
├── ML/                   # Flask ML API
│   ├── app.py            # Prediction API
│   ├── train_model.py    # Model training
│   └── churn_model.pkl   # Trained model
│
├── frontend/             # React frontend
│   └── my-app/
│       ├── src/
│       │   ├── pages/    # Predict page
│       │   ├── Dashboard.js
│       │   └── App.js

---

## ⚙️ Backend (Java) – File Roles

- BackendApplication.java → Starts the Spring Boot server  
- Customer.java → Defines customer data (mapped to MySQL table)  
- CustomerRepository.java → Handles database operations (save, fetch, count)  
- CustomerService.java → Core logic (calls ML API, saves data, computes stats)  
- CustomerController.java → Exposes REST APIs (/ml-predict, /stats)  

---

## 🧪 Setup & Run

### 1. Start MySQL

mysql -u root -p

Then run:

CREATE DATABASE churn_db;

---

### 2. Run ML API (Flask)

cd ML  
pip install flask pandas scikit-learn joblib  
python app.py  

Runs on: http://localhost:5000  

---

### 3. Run Backend (Spring Boot)

cd backend/backend  
.\mvnw.cmd spring-boot:run  

Runs on: http://localhost:8080  

---

### 4. Run Frontend (React)

cd frontend/my-app  
npm install  
npm start  

Runs on: http://localhost:3000  

---

## 🔌 API Endpoints

POST /customers/ml-predict → Predict churn  
GET /customers → Get all customers  
GET /customers/stats → Get analytics  

---

## 📊 Features

- ML-based churn prediction  
- Data stored in MySQL  
- REST API using Spring Boot  
- Analytics (high risk, low risk, churn rate)  
- React dashboard  

---

## 🚀 Future Improvements

- Add charts (pie/bar graphs)  
- Dockerize project  
- Add authentication  
- Model monitoring (MLOps)  

---

## 👨‍💻 Team

- Kimaya Chavan  
- Rutuja Bidarkar  
- Hitu Bharal  
