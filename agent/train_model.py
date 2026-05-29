import pandas as pd

from sklearn.ensemble import RandomForestClassifier

import joblib


# =========================
# LOAD DATASET
# =========================

df = pd.read_csv("telecom.csv")


# =========================
# CLEAN DATA
# =========================

# Convert TotalCharges to numeric
df["TotalCharges"] = pd.to_numeric(
    df["TotalCharges"],
    errors="coerce"
)

# Remove null rows
df = df.dropna()


# =========================
# CONVERT TARGET
# =========================

df["Churn"] = df["Churn"].map({

    "Yes": 1,

    "No": 0

})


# =========================
# FEATURES
# =========================

X = df[[

    "tenure",

    "MonthlyCharges",

    "TotalCharges"

]]


# =========================
# TARGET
# =========================

y = df["Churn"]


# =========================
# TRAIN MODEL
# =========================

model = RandomForestClassifier()

model.fit(X, y)


# =========================
# SAVE MODEL
# =========================

joblib.dump(

    model,

    "models/churn_model.pkl"

)

print("✅ Model Trained Successfully")