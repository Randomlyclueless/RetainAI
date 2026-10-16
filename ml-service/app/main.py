
from pathlib import Path
import json

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "churn_pipeline.joblib"
METRICS_PATH = BASE_DIR / "models" / "metrics.json"

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

if not METRICS_PATH.exists():
    raise FileNotFoundError(f"Metrics not found: {METRICS_PATH}")

model = joblib.load(MODEL_PATH)

with open(METRICS_PATH, "r", encoding="utf-8") as file:
    metrics = json.load(file)

FEATURE_NAMES = metrics["features"]

app = FastAPI(
    title="RetainAI Churn Prediction API",
    description="Predicts customer churn using six customer features.",
    version="2.0.0",
)


class PredictionRequest(BaseModel):
    tenure: int = Field(ge=0, description="Customer tenure in months")
    monthlyCharges: float = Field(ge=0)
    totalCharges: float = Field(ge=0)
    contract: int = Field(ge=1, le=3)
    internetService: int = Field(ge=0, le=1)
    paymentMethod: int = Field(ge=1, le=3)


@app.get("/")
def root():
    return {
        "service": "RetainAI Churn Prediction API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "feature_count": len(FEATURE_NAMES),
    }


@app.get("/model/features")
def get_features():
    return {"features": FEATURE_NAMES}


@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        customer_df = pd.DataFrame(
            [{
                "tenure": request.tenure,
                "monthlyCharges": request.monthlyCharges,
                "totalCharges": request.totalCharges,
                "contract": request.contract,
                "internetService": request.internetService,
                "paymentMethod": request.paymentMethod,
            }],
            columns=FEATURE_NAMES,
        )

        prediction = int(model.predict(customer_df)[0])
        probability = float(model.predict_proba(customer_df)[0][1])

        if probability >= 0.70:
            risk_level = "HIGH"
        elif probability >= 0.40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return {
            "prediction": prediction,
            "churn": prediction == 1,
            "churn_probability": round(probability, 4),
            "risk_level": risk_level,
        }

    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid feature values: {exc}",
        ) from exc
