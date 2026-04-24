"""
RetainAI Ensemble Model — Soft-voting ensemble combining XGBoost, LightGBM, and CatBoost.
Based on XCL-Churn architecture (Nature Scientific Reports, 2025).
"""

import json
import logging
import os
from pathlib import Path
import matplotlib.pyplot as plt
import mlflow
import mlflow.sklearn
import mlflow.xgboost
import mlflow.lightgbm
import mlflow.catboost
import numpy as np
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

import pandas as pd
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
from sklearn.ensemble import VotingClassifier
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    auc,
    precision_recall_curve
)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

from features.feature_store import get_feature_matrix
from models import (
    RANDOM_STATE,
    DEFAULT_THRESHOLD,
)

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def calculate_metrics(y_true, y_pred_proba, threshold=DEFAULT_THRESHOLD):
    """Calculate core classification metrics."""
    y_pred = (y_pred_proba >= threshold).astype(int)
    return {
        "auc": roc_auc_score(y_true, y_pred_proba),
        "precision": precision_score(y_true, y_pred, zero_division=0),
        "recall": recall_score(y_true, y_pred, zero_division=0),
        "f1": f1_score(y_true, y_pred, zero_division=0),
        "accuracy": accuracy_score(y_true, y_pred)
    }

def train_ensemble():
    """Trains individual models and a soft-voting ensemble, logging all to MLflow."""
    try:
        mlflow.set_experiment("RetainAI_Churn_Ensemble")
        mlflow_enabled = True
    except Exception as e:
        logger.warning(f"MLflow not available: {e}. Logging disabled.")
        mlflow_enabled = False
    
    # 1. Load & Split Data
    logger.info("Loading feature matrix...")
    X, y = get_feature_matrix()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=RANDOM_STATE, stratify=y
    )
    
    # Calculate imbalance ratio for models
    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    scale_pos_weight = neg_count / pos_count
    
    # 2. Define Individual Models
    xgb = XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        scale_pos_weight=scale_pos_weight,
        random_state=RANDOM_STATE,
        use_label_encoder=False,
        eval_metric="logloss"
    )
    
    lgbm = LGBMClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        is_unbalance=True,
        random_state=RANDOM_STATE,
        verbosity=-1
    )
    
    cat = CatBoostClassifier(
        iterations=100,
        depth=6,
        learning_rate=0.1,
        auto_class_weights='Balanced',
        random_seed=RANDOM_STATE,
        verbose=False
    )
    
    # 3. Create Voting Ensemble
    ensemble = VotingClassifier(
        estimators=[
            ('xgboost', xgb),
            ('lightgbm', lgbm),
            ('catboost', cat)
        ],
        voting='soft',
        weights=[0.4, 0.35, 0.25]
    )
    
    comparison_results = {}
    best_model_info = {"name": None, "auc": -1, "model": None}
    
    # 4. Train and Log Models
    models_to_train = [
        ("XGBoost", xgb, mlflow.xgboost),
        ("LightGBM", lgbm, mlflow.lightgbm),
        ("CatBoost", cat, mlflow.catboost),
        ("Ensemble", ensemble, mlflow.sklearn)
    ]
    
    if mlflow_enabled:
        with mlflow.start_run(run_name="Full_Ensemble_Training"):
            _run_training_loop(models_to_train, X_train, X_test, y_train, y_test, best_model_info, comparison_results, xgb)
    else:
        _run_training_loop(models_to_train, X_train, X_test, y_train, y_test, best_model_info, comparison_results, xgb, mlflow_enabled=False)

    # Save comparison results locally for API access
    os.makedirs("data/metadata", exist_ok=True)
    with open("data/metadata/model_comparison.json", "w") as f:
        json.dump(comparison_results, f)

    return comparison_results

def _run_training_loop(models_to_train, X_train, X_test, y_train, y_test, best_model_info, comparison_results, xgb, mlflow_enabled=True):
    for name, model, logger_module in models_to_train:
        logger.info(f"Training {name}...")
        model.fit(X_train, y_train)
        
        # Prediction
        y_proba = model.predict_proba(X_test)[:, 1]
        metrics = calculate_metrics(y_test, y_proba)
        comparison_results[name] = metrics
        
        if mlflow_enabled:
            # Log metrics to current run with prefix
            for m_name, m_val in metrics.items():
                mlflow.log_metric(f"{name.lower()}_{m_name}", m_val)
            
            # Artifacts (PR Curve)
            precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_proba)
            plt.figure(figsize=(8, 6))
            plt.plot(recall_vals, precision_vals, label=f"{name} (AUC={metrics['auc']:.3f})")
            plt.xlabel("Recall")
            plt.ylabel("Precision")
            plt.title(f"PR Curve - {name}")
            plt.legend()
            plt.grid(True)
            pr_path = f"pr_{name.lower()}.png"
            plt.savefig(pr_path)
            mlflow.log_artifact(pr_path)
            plt.close()
        
        # Track best model for registry
        if metrics["auc"] > best_model_info["auc"]:
            best_model_info["auc"] = metrics["auc"]
            best_model_info["name"] = name
            best_model_info["model"] = model
    
    # SHAP
    if SHAP_AVAILABLE:
        explainer_model = xgb 
        logger.info(f"Generating SHAP summary using {explainer_model.__class__.__name__}...")
        try:
            explainer = shap.TreeExplainer(explainer_model)
            shap_values = explainer.shap_values(X_test)
            
            plt.figure(figsize=(10, 6))
            shap.summary_plot(shap_values, X_test, show=False)
            shap_plot_path = "shap_summary_ensemble.png"
            plt.savefig(shap_plot_path, bbox_inches="tight")
            if mlflow_enabled:
                mlflow.log_artifact(shap_plot_path)
            plt.close()
        except Exception as e:
            logger.warning(f"SHAP explanation failed: {e}")
    else:
        logger.warning("SHAP library not found. Skipping explainability.")

    if mlflow_enabled:
        # Promoting the best model
        model_name = "RetainAI_Churn_Production"
        logger.info(f"Registering best model: {best_model_info['name']} to {model_name}")
        # Note: In a real scenario, we'd log the specific module type
        mlflow.sklearn.log_model(best_model_info["model"], "model", registered_model_name=model_name)

    return comparison_results

if __name__ == "__main__":
    results = train_ensemble()
    print("\n--- Model Comparison Results ---")
    for model, metrics in results.items():
        print(f"{model}: AUC={metrics['auc']:.4f}, F1={metrics['f1']:.4f}, Prec={metrics['precision']:.4f}, Rec={metrics['recall']:.4f}")
