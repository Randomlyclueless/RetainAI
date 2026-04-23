"""
RetainAI Drift Detector — Monitor data drift using EvidentlyAI.
Compares training reference vs inference data.
"""

import os
from datetime import datetime
from pathlib import Path
import pandas as pd
import json
try:
    from evidently.report import Report
    from evidently.metric_preset import DataDriftPreset
    EVIDENTLY_AVAILABLE = True
except ImportError:
    EVIDENTLY_AVAILABLE = False

PROJECT_ROOT = Path(__file__).resolve().parent.parent
REPORT_DIR = PROJECT_ROOT / "monitoring" / "reports"
REFERENCE_DATA_PATH = PROJECT_ROOT / "data" / "processed" / "feature_table.csv"

def run_drift_check(current_df: pd.DataFrame = None):
    """
    Runs a data drift report comparing reference data to current inference features.
    """
    if not EVIDENTLY_AVAILABLE:
        return {"drifted": False, "info": "Evidently not installed"}
    
    Parameters
    ----------
    current_df : pd.DataFrame, optional
        The features collected during recent window. If None, uses reference data
        for demonstration (no drift).
    
    Returns
    -------
    dict
        Drift summary: {drifted: bool, drifted_features: list, drift_score: float}
    """
    # 1. Ensure report directory exists
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 2. Load reference data
    if not REFERENCE_DATA_PATH.exists():
        return {"error": "Reference data not found"}
    
    reference_df = pd.read_csv(REFERENCE_DATA_PATH)
    
    # Drop IDs and targets for drift detection on features
    X_ref = reference_df.drop(columns=["customer_id", "churn"], errors="ignore")
    
    # 3. Handle current data (if None, simulate current data from reference)
    if current_df is None:
        # For prototype/demo: take reference and add 5% noise to simulate "current"
        X_curr = X_ref.sample(frac=0.5, random_state=42).copy()
        # Add random noise to 'avg_session_duration_mins' to simulate slight shift
        X_curr['avg_session_duration_mins'] = X_curr['avg_session_duration_mins'] * 1.05
    else:
        X_curr = current_df.drop(columns=["customer_id", "churn"], errors="ignore")

    # 4. Generate Evidently Report
    drift_report = Report(metrics=[DataDriftPreset()])
    drift_report.run(reference_data=X_ref, current_data=X_curr)
    
    # 5. Save HTML report
    timestamp = datetime.now().strftime("%Y-%m-%d")
    report_path = REPORT_DIR / f"drift_{timestamp}.html"
    drift_report.save_html(str(report_path))
    
    # 6. Extract summary metrics
    results = drift_report.as_dict()
    # Looking at the DataDriftPreset structure
    drift_metrics = results["metrics"][0]["result"]
    dataset_drift = drift_metrics["dataset_drift"]
    
    # Extract specific drifted features
    drifted_features = [
        f_name for f_name, f_data in drift_metrics["drift_by_columns"].items()
        if f_data["drift_detected"]
    ]
    
    summary = {
        "drifted": dataset_drift,
        "drifted_features": drifted_features,
        "drift_score": drift_metrics["share_of_drifted_columns"],
        "report_url": f"/monitoring/reports/drift_{timestamp}.html",
        "timestamp": timestamp
    }
    
    # Save a JSON summary for easy API access
    with open(REPORT_DIR / f"summary_{timestamp}.json", "w") as f:
        json.dump(summary, f)
        
    return summary

if __name__ == "__main__":
    status = run_drift_check()
    print("\n--- Drift Detection Summary ---")
    print(f"Drift Detected: {status['drifted']}")
    print(f"Drift Score: {status['drift_score']:.2f}")
    print(f"Affected Features: {status['drifted_features']}")
    print(f"Report saved to: {status['report_url']}")
