"""
RetainAI Retraining Flow — Prefect orchestration for periodic model retraining and promotion.
"""

import os
import logging
from datetime import datetime
from pathlib import Path

import pandas as pd
from prefect import flow, task
from prefect.server.schemas.schedules import CronSchedule

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Import our custom components
from features import feature_store
from models.ensemble import train_ensemble

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@task(retries=2, retry_delay_seconds=60)
def extract_new_labels():
    """
    Simulates extracting fresh labeled outcomes from PostgreSQL.
    In a real scenario, this would use DB_URL.
    """
    db_url = os.getenv("DB_URL")
    logger.info(f"Targeting database: {db_url or 'Local fallback'}")
    
    # Mock behavior: Check if a local 'labels.csv' exists, otherwise return None to trigger fallback
    labels_file = Path("data/raw/labeled_outcomes.csv")
    if labels_file.exists():
        return pd.read_csv(labels_file)
    
    return None

@task
def merge_with_features(new_labels_df):
    """Joins new labels with existing features to create a retrain dataset."""
    feature_table = feature_store.load_feature_table()
    
    if new_labels_df is not None:
        logger.info("Merging fresh labels into feature table...")
        # Join on customer_id
        # In this prototype, we'll just return the original table as a proxy
        return feature_table
    
    logger.info("No new labels found. Using base feature table for retraining.")
    return feature_table

@task
def retrain_ensemble_task():
    """Calls the ensemble training script."""
    logger.info("Starting ensemble retraining...")
    comparison_results = train_ensemble()
    return comparison_results

@task
def validate_model(comparison_results):
    """
    Validate if the new ensemble meets promotion criteria.
    Criteria: Ensemble AUC > 0.85 (Production baseline)
    """
    ensemble_auc = comparison_results.get("Ensemble", {}).get("auc", 0)
    logger.info(f"Retrained Ensemble AUC: {ensemble_auc:.4f}")
    
    if ensemble_auc > 0.85:
        logger.info("✅ Model passed validation.")
        return True
    
    logger.warning("❌ Model failed validation (AUC too low).")
    return False

@task
def send_alert(status, results):
    """Simulates sending a retraining summary alert."""
    summary = f"Retraining {'SUCCESS' if status else 'FAILED'}\n"
    if results:
        summary += f"Ensemble AUC: {results.get('Ensemble', {}).get('auc', 'N/A')}"
    
    print("\n--- RETRAINING ALERT ---")
    print(summary)
    print("------------------------\n")

@flow(name="RetainAI Retraining Pipeline")
def retrain_churn_model():
    """Main retraining orchestration flow."""
    labels = extract_new_labels()
    retrain_data = merge_with_features(labels)
    
    comparison_stats = retrain_ensemble_task()
    
    is_valid = validate_model(comparison_stats)
    
    send_alert(is_valid, comparison_stats)
    
    return {"status": "complete", "valid": is_valid}

# Schedule: Sunday at 2am
# Cron: "0 2 * * 0"
if __name__ == "__main__":
    # Create the flow deployment (simulated for local execution)
    retrain_churn_model()
