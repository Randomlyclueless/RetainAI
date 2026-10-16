
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)
from xgboost import XGBClassifier

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "TelcoCustomerChurn.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(DATA_PATH)

# Keep the same six features used by the RetainAI form.
df["contract"] = df["Contract"].map({
    "Month-to-Month": 1,
    "One Year": 2,
    "Two Year": 3,
})

df["internetService"] = df["InternetService"].map({
    "No": 0,
    "Yes": 1,
})

df["paymentMethod"] = df["PaymentMethod"].map({
    "Bank Withdrawal": 1,
    "Credit Card": 2,
    "Mailed Check": 3,
})

df["ChurnLabel"] = df["ChurnLabel"].map({
    "No": 0,
    "Yes": 1,
})

feature_columns = [
    "TenureinMonths",
    "MonthlyCharge",
    "TotalCharges",
    "contract",
    "internetService",
    "paymentMethod",
]

X = df[feature_columns].copy()
X.columns = [
    "tenure",
    "monthlyCharges",
    "totalCharges",
    "contract",
    "internetService",
    "paymentMethod",
]
y = df["ChurnLabel"]

# Fail clearly if the dataset's category labels differ from expectations.
if X.isnull().any().any() or y.isnull().any():
    raise ValueError(
        "Missing or unmapped values found. Check dataset column names "
        "and category labels before training."
    )

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

model = XGBClassifier(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1,
    tree_method="hist",
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, 1]

metrics = {
    "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
    "precision": round(
        float(precision_score(y_test, predictions, zero_division=0)), 4
    ),
    "recall": round(
        float(recall_score(y_test, predictions, zero_division=0)), 4
    ),
    "f1": round(float(f1_score(y_test, predictions, zero_division=0)), 4),
    "roc_auc": round(float(roc_auc_score(y_test, probabilities)), 4),
    "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
    "features": list(X.columns),
    "model": "XGBoost",
    "test_size": 0.20,
    "random_state": 42,
}

joblib.dump(model, MODEL_DIR / "churn_pipeline.joblib")

with open(MODEL_DIR / "metrics.json", "w", encoding="utf-8") as file:
    json.dump(metrics, file, indent=4)

print("\nXGBoost Training Results")
print("-" * 30)
for key, value in metrics.items():
    print(f"{key}: {value}")

print(f"\nModel saved to: {MODEL_DIR / 'churn_pipeline.joblib'}")
print(f"Metrics saved to: {MODEL_DIR / 'metrics.json'}")
