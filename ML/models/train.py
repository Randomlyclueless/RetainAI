"""
Baseline Model Training Script.
Loads features, trains an XGBoost model, logs to MLflow with SHAP and PR curves.
"""

import logging
from pathlib import Path

import matplotlib.pyplot as plt
import mlflow
import mlflow.xgboost
import numpy as np
import pandas as pd
import shap
from sklearn.metrics import (
    accuracy_score,
    auc,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from features.feature_store import get_feature_matrix
from models import (
    DEFAULT_LEARNING_RATE,
    DEFAULT_MAX_DEPTH,
    DEFAULT_N_ESTIMATORS,
    DEFAULT_THRESHOLD,
    RANDOM_STATE,
)

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def log_metrics(y_true, y_pred_proba, prefix="val", threshold=DEFAULT_THRESHOLD):
    """Calculate and log metrics to MLflow."""
    y_pred = (y_pred_proba >= threshold).astype(int)
    
    metrics = {
        f"{prefix}_accuracy": accuracy_score(y_true, y_pred),
        f"{prefix}_precision": precision_score(y_true, y_pred, zero_division=0),
        f"{prefix}_recall": recall_score(y_true, y_pred, zero_division=0),
        f"{prefix}_f1": f1_score(y_true, y_pred, zero_division=0),
        f"{prefix}_roc_auc": roc_auc_score(y_true, y_pred_proba),
    }
    
    for name, value in metrics.items():
        mlflow.log_metric(name, value)
        logger.info(f"{name}: {value:.4f}")
    
    return metrics

def train_baseline():
    """Main training orchestrator."""
    mlflow.set_experiment("Churn_Prediction_Baseline")
    
    with mlflow.start_run(run_name="XGBoost_Baseline_SHAP"):
        # 1. Load Data
        logger.info("Loading feature matrix...")
        X, y = get_feature_matrix()
        
        # 2. 70/15/15 Split
        # First split off the test set (15%)
        X_train_val, X_test, y_train_val, y_test = train_test_split(
            X, y, test_size=0.15, random_state=RANDOM_STATE, stratify=y
        )
        # Then split remaining into train and validation (70/15 of total = ~82/18 of remaining)
        X_train, X_val, y_train, y_val = train_test_split(
            X_train_val, y_train_val, test_size=0.1765, random_state=RANDOM_STATE, stratify=y_train_val
        )
        
        logger.info(f"Split sizes: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")
        
        # 3. Imbalance Handling
        # scale_pos_weight = sum(negative cases) / sum(positive cases)
        neg_count = (y_train == 0).sum()
        pos_count = (y_train == 1).sum()
        scale_pos_weight = neg_count / pos_count
        logger.info(f"Imbalance ratio (neg/pos): {scale_pos_weight:.2f}")
        
        # 4. Train Model
        params = {
            "max_depth": DEFAULT_MAX_DEPTH,
            "learning_rate": DEFAULT_LEARNING_RATE,
            "n_estimators": DEFAULT_N_ESTIMATORS,
            "scale_pos_weight": scale_pos_weight,
            "random_state": RANDOM_STATE,
            "use_label_encoder": False,
            "eval_metric": "logloss",
        }
        
        mlflow.log_params(params)
        mlflow.log_param("threshold", DEFAULT_THRESHOLD)
        
        logger.info("Training XGBoost classifier...")
        model = XGBClassifier(**params)
        model.fit(X_train, y_train)
        
        # 5. Evaluate on Validation Set (used for tuning/decisions)
        logger.info("Evaluating on Validation set...")
        y_val_proba = model.predict_proba(X_val)[:, 1]
        log_metrics(y_val, y_val_proba, prefix="val")
        
        # 6. Evaluate on Test Set (final holdout - NO TUNING BASED ON THIS)
        logger.info("Evaluating on Test set (final holdout)...")
        y_test_proba = model.predict_proba(X_test)[:, 1]
        log_metrics(y_test, y_test_proba, prefix="test")
        
        # 7. Generate PR Curve
        precision, recall, _ = precision_recall_curve(y_test, y_test_proba)
        pr_auc = auc(recall, precision)
        mlflow.log_metric("test_pr_auc", pr_auc)
        
        plt.figure(figsize=(10, 6))
        plt.plot(recall, precision, label=f"PR Curve (AUC = {pr_auc:.2f})")
        plt.xlabel("Recall")
        plt.ylabel("Precision")
        plt.title("Precision-Recall Curve (Test Set)")
        plt.legend()
        plt.grid(True)
        pr_curve_path = "pr_curve.png"
        plt.savefig(pr_curve_path)
        mlflow.log_artifact(pr_curve_path)
        plt.close()
        
        # 8. SHAP Interpretability
        logger.info("Generating SHAP summary plot...")
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X_val)
        
        plt.figure(figsize=(10, 6))
        shap.summary_plot(shap_values, X_val, show=False)
        shap_plot_path = "shap_summary.png"
        plt.savefig(shap_plot_path, bbox_inches="tight")
        mlflow.log_artifact(shap_plot_path)
        plt.close()
        
        # 9. Log Model
        mlflow.xgboost.log_model(model, "model")
        
        logger.info("Training baseline complete. Metrics and artifacts logged to MLflow.")

if __name__ == "__main__":
    train_baseline()
