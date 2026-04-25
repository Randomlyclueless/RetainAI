
---

## ⚙️ Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Frontend     | React.js                                        |
| Backend      | Spring Boot (Java)                              |
| ML (Planned) | Python (Flask / FastAPI, Scikit-learn, SHAP)    |
| Database     | MySQL                                           |
| Integration  | REST APIs                                       |

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/customers/ml-predict`     | Predict churn *(ML integration WIP)* |
| GET    | `/customers`                | Fetch all customers                  |
| GET    | `/customers/stats`          | Analytics data                       |

---

## 📊 Current Features

- ✅ Backend APIs for customer data management  
- ✅ Database integration with MySQL  
- ✅ React dashboard for visualization  
- ✅ Structured architecture for ML integration  
- 🚧 ML model training pipeline (in progress)  
- 🚧 Explainability layer (planned)  

---

## 🚧 ML Pipeline (Rebuild Plan)

The ML module is being redesigned to include:

- 🔍 Churn prediction model (improved accuracy)  
- 🧠 Explainability (feature importance / SHAP)  
- 🔄 Feedback loop for continuous learning  
- 📈 Model monitoring & drift detection  
- ⚡ Scalable API (Flask/FastAPI)  

---

## 🚀 Future Enhancements

- 🎯 Retention recommendation engine (action system)  
- 🐳 Docker-based deployment  
- 🔐 Authentication & role-based access  
- ☁️ Cloud deployment (AWS/GCP)  
- 📊 Advanced analytics dashboard  

---

## 🧠 Problem Statement

Customer churn significantly impacts business revenue.  
RetainAI aims to help organizations **identify high-risk customers early and take data-driven actions to improve retention**.

---

## 🧪 Setup & Run (Current Version)

> ⚠️ **Note:** ML module is under reconstruction. Current setup runs **Frontend + Backend only**.
## backend commmands to run java - cd backend/backend
```backend

./mvnw spring-boot:run
```
## frontend  commands - cd frontend/my-app
```frontend 
npm install
npm start

```

### 1️⃣ Start MySQL

Make sure MySQL is running:

```sql
mysql -u root -p
CREATE DATABASE churn_db;


