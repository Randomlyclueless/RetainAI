"""
Feature Pipeline — ingests raw Telco CSV, engineers features, saves processed table.

Maps IBM Telco Customer Churn columns → our standard feature schema so the rest
of the platform (training, serving, drift detection) works against a single,
clean feature contract.

Telco column mapping (best-effort for prototype, real data swapped in later):
  tenure                     → days_since_last_login  (proxy: low tenure ≈ recent signup)
  tenure (inverted)          → login_frequency_30d    (proxy: longer tenure = more logins)
  OnlineSecurity + OnlineBackup + DeviceProtection
    + TechSupport + StreamingTV + StreamingMovies
                             → feature_adoption_rate  (% of 6 add-on services used)
  MonthlyCharges             → avg_session_duration_mins (proxy for engagement)
  PaymentMethod / Contract   → payment_delay_days     (proxy heuristic)
  PaperlessBilling           → failed_payments_3m     (proxy)
  TechSupport + Contract     → support_tickets_30d    (proxy)
  SeniorCitizen + Contract   → complaint_severity_score (proxy)
  PaperlessBilling           → email_open_rate        (proxy)
  tenure * 30                → days_as_customer

Target:
  Churn  (Yes/No → 1/0)
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd

# ─── Constants ────────────────────────────────────────────────────────────────

PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DATA_DIR = PROJECT_ROOT / "data" / "processed"

DEFAULT_RAW_FILE = RAW_DATA_DIR / "Telco-Customer-Churn.csv"
DEFAULT_OUTPUT_FILE = PROCESSED_DATA_DIR / "feature_table.csv"

# The final feature columns our model expects (order matters for consistency)
FEATURE_COLUMNS = [
    "days_since_last_login",
    "login_frequency_30d",
    "feature_adoption_rate",
    "avg_session_duration_mins",
    "payment_delay_days",
    "failed_payments_3m",
    "support_tickets_30d",
    "complaint_severity_score",
    "email_open_rate",
    "days_as_customer",
]

TARGET_COLUMN = "churn"
ID_COLUMN = "customer_id"

logger = logging.getLogger(__name__)


# ─── Loading ──────────────────────────────────────────────────────────────────


def load_raw_data(path: Optional[Path] = None) -> pd.DataFrame:
    """Load the raw Telco CSV from disk.

    Parameters
    ----------
    path : Path, optional
        Override default location of the raw CSV.

    Returns
    -------
    pd.DataFrame
        Raw dataframe exactly as the CSV was written.

    Raises
    ------
    FileNotFoundError
        If the CSV does not exist at the given path.
    """
    path = path or DEFAULT_RAW_FILE
    if not path.exists():
        raise FileNotFoundError(
            f"Raw data file not found at {path}. "
            f"Download the Telco CSV from: "
            f"https://raw.githubusercontent.com/IBM/telco-customer-churn-on-icp4d/"
            f"master/data/Telco-Customer-Churn.csv"
        )
    logger.info("Loading raw data from %s", path)
    df = pd.read_csv(path)
    logger.info("Loaded %d rows × %d columns", *df.shape)
    return df


# ─── Cleaning ─────────────────────────────────────────────────────────────────


def clean_raw_data(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning on the raw Telco dataframe.

    - Strips whitespace from column names
    - Converts TotalCharges to numeric (has whitespace-only values)
    - Drops rows with NaN TotalCharges (11 rows in the original dataset)
    - Converts Churn to binary int (Yes=1, No=0)

    Returns a cleaned copy — does NOT mutate the input.
    """
    df = df.copy()
    df.columns = df.columns.str.strip()

    # TotalCharges has ' ' entries that should be NaN
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    rows_before = len(df)
    df = df.dropna(subset=["TotalCharges"]).reset_index(drop=True)
    rows_dropped = rows_before - len(df)
    if rows_dropped:
        logger.info("Dropped %d rows with missing TotalCharges", rows_dropped)

    # Binary target
    df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})

    return df


# ─── Feature Engineering ──────────────────────────────────────────────────────


def _binary_yes_no(series: pd.Series) -> pd.Series:
    """Convert a Yes/No (or 'No phone service' / 'No internet service') column
    to 1/0."""
    return series.map(
        lambda v: 1 if v == "Yes" else 0
    )


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Transform cleaned Telco dataframe into our standard feature table.

    The mapping is a *prototype approximation* — each Telco column is mapped to
    the closest conceptual match in our feature contract.  When real data is
    available these proxy calculations will be replaced.

    Parameters
    ----------
    df : pd.DataFrame
        Cleaned Telco dataframe (output of ``clean_raw_data``).

    Returns
    -------
    pd.DataFrame
        Feature table with columns: customer_id, <FEATURE_COLUMNS>, churn.
    """
    features = pd.DataFrame()

    # ── ID ──
    features[ID_COLUMN] = df["customerID"]

    # ── days_since_last_login ──
    # Proxy: customers with shorter tenure are "newer" and may not have logged
    # in recently.  We invert tenure so low tenure → high days_since_last_login.
    max_tenure = df["tenure"].max()
    features["days_since_last_login"] = (max_tenure - df["tenure"]).clip(lower=0)

    # ── login_frequency_30d ──
    # Proxy: higher tenure → more habitual usage → higher login freq.
    # Scale to a reasonable range (0–30 logins per month).
    features["login_frequency_30d"] = (
        (df["tenure"] / max_tenure * 30).round(1)
    )

    # ── feature_adoption_rate ──
    # % of 6 add-on services the customer has enabled.
    addon_cols = [
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies",
    ]
    addon_binary = df[addon_cols].apply(_binary_yes_no)
    features["feature_adoption_rate"] = (
        addon_binary.sum(axis=1) / len(addon_cols)
    ).round(4)

    # ── avg_session_duration_mins ──
    # Proxy: MonthlyCharges scaled to look like session duration (5–90 min).
    mc = df["MonthlyCharges"]
    features["avg_session_duration_mins"] = (
        5 + (mc - mc.min()) / (mc.max() - mc.min()) * 85
    ).round(1)

    # ── payment_delay_days ──
    # Proxy: customers on month-to-month using electronic check ≈ higher risk
    # of late payment.  Assign a synthetic delay score.
    features["payment_delay_days"] = np.where(
        (df["Contract"] == "Month-to-month")
        & (df["PaymentMethod"] == "Electronic check"),
        np.random.default_rng(42).integers(1, 30, size=len(df)),  # noqa: S311
        0,
    )

    # ── failed_payments_3m ──
    # Proxy: PaperlessBilling=Yes → less oversight → higher chance of failure.
    features["failed_payments_3m"] = np.where(
        _binary_yes_no(df["PaperlessBilling"]) == 1,
        np.random.default_rng(99).integers(0, 4, size=len(df)),  # noqa: S311
        0,
    )

    # ── support_tickets_30d ──
    # Proxy: No TechSupport + month-to-month contract → more tickets.
    features["support_tickets_30d"] = np.where(
        (_binary_yes_no(df["TechSupport"]) == 0)
        & (df["Contract"] == "Month-to-month"),
        np.random.default_rng(7).integers(0, 8, size=len(df)),  # noqa: S311
        np.random.default_rng(7).integers(0, 2, size=len(df)),  # noqa: S311
    )

    # ── complaint_severity_score ──
    # Proxy: SeniorCitizen + month-to-month → higher complaint severity.
    base_severity = df["SeniorCitizen"] * 3  # 0 or 3
    contract_bump = np.where(df["Contract"] == "Month-to-month", 2, 0)
    features["complaint_severity_score"] = (base_severity + contract_bump).clip(
        upper=10
    )

    # ── email_open_rate ──
    # Proxy: PaperlessBilling=Yes → customer reads email → higher open rate.
    features["email_open_rate"] = np.where(
        _binary_yes_no(df["PaperlessBilling"]) == 1,
        np.random.default_rng(123).uniform(0.4, 0.9, size=len(df)).round(2),
        np.random.default_rng(123).uniform(0.05, 0.3, size=len(df)).round(2),
    )

    # ── days_as_customer ──
    # Telco tenure is in months; convert to days.
    features["days_as_customer"] = (df["tenure"] * 30).astype(int)

    # ── Target ──
    features[TARGET_COLUMN] = df["Churn"]

    return features


# ─── Validation ───────────────────────────────────────────────────────────────


def validate_feature_table(df: pd.DataFrame) -> None:
    """Run lightweight integrity checks on the engineered feature table.

    Raises ValueError with a descriptive message on the first failure.
    """
    # All expected columns present
    expected = [ID_COLUMN] + FEATURE_COLUMNS + [TARGET_COLUMN]
    missing = set(expected) - set(df.columns)
    if missing:
        raise ValueError(f"Feature table is missing columns: {missing}")

    # No NaN in feature columns
    nan_counts = df[FEATURE_COLUMNS].isna().sum()
    bad_cols = nan_counts[nan_counts > 0]
    if not bad_cols.empty:
        raise ValueError(f"Feature table has NaN values in: {bad_cols.to_dict()}")

    # Target is binary
    unique_targets = set(df[TARGET_COLUMN].unique())
    if not unique_targets.issubset({0, 1}):
        raise ValueError(
            f"Target column must be binary (0/1), got: {unique_targets}"
        )

    # All feature values are numeric
    for col in FEATURE_COLUMNS:
        if not pd.api.types.is_numeric_dtype(df[col]):
            raise ValueError(f"Feature '{col}' is not numeric (dtype={df[col].dtype})")

    logger.info("✓ Feature table validation passed (%d rows, %d features)",
                len(df), len(FEATURE_COLUMNS))


# ─── Pipeline Entrypoint ─────────────────────────────────────────────────────


def run_pipeline(
    raw_path: Optional[Path] = None,
    output_path: Optional[Path] = None,
) -> pd.DataFrame:
    """Execute the full feature pipeline: load → clean → engineer → validate → save.

    Parameters
    ----------
    raw_path : Path, optional
        Location of the raw Telco CSV.
    output_path : Path, optional
        Where to write the processed feature table CSV.

    Returns
    -------
    pd.DataFrame
        The validated feature table.
    """
    output_path = output_path or DEFAULT_OUTPUT_FILE

    # 1. Load
    raw_df = load_raw_data(raw_path)

    # 2. Clean
    clean_df = clean_raw_data(raw_df)

    # 3. Engineer features
    feature_df = engineer_features(clean_df)

    # 4. Validate
    validate_feature_table(feature_df)

    # 5. Save
    output_path.parent.mkdir(parents=True, exist_ok=True)
    feature_df.to_csv(output_path, index=False)
    logger.info("Saved feature table to %s (%d rows)", output_path, len(feature_df))

    return feature_df


# ─── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    )
    feature_table = run_pipeline()
    print(f"\n✅ Feature pipeline complete — {len(feature_table)} customers processed.")
    print(feature_table.head(10).to_string(index=False))
