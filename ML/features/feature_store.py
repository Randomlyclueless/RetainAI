"""
Feature Store — reads / writes the processed feature table.

For the prototype this is a simple CSV-backed store.  Later we'll swap in
PostgreSQL or Feast without changing the interface.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import pandas as pd

from features.feature_pipeline import (
    DEFAULT_OUTPUT_FILE,
    FEATURE_COLUMNS,
    ID_COLUMN,
    TARGET_COLUMN,
)

logger = logging.getLogger(__name__)


def load_feature_table(path: Optional[Path] = None) -> pd.DataFrame:
    """Load the processed feature table from CSV.

    Parameters
    ----------
    path : Path, optional
        Override default feature table location.

    Returns
    -------
    pd.DataFrame
        Feature table with customer_id, 10 features, and churn target.
    """
    path = path or DEFAULT_OUTPUT_FILE
    if not path.exists():
        raise FileNotFoundError(
            f"Feature table not found at {path}. "
            "Run `python -m features.feature_pipeline` first."
        )
    df = pd.read_csv(path)
    logger.info("Loaded feature table: %d rows × %d cols from %s",
                *df.shape, path)
    return df


def get_customer_features(
    customer_id: str,
    df: Optional[pd.DataFrame] = None,
    path: Optional[Path] = None,
) -> dict:
    """Retrieve a single customer's feature vector as a dict.

    Parameters
    ----------
    customer_id : str
        The customer ID to look up.
    df : pd.DataFrame, optional
        Pre-loaded feature table (avoids re-reading CSV).
    path : Path, optional
        Feature table CSV location.

    Returns
    -------
    dict
        Mapping of feature name → value for the requested customer.

    Raises
    ------
    KeyError
        If ``customer_id`` is not found in the feature table.
    """
    if df is None:
        df = load_feature_table(path)

    mask = df[ID_COLUMN] == customer_id
    if not mask.any():
        raise KeyError(f"Customer '{customer_id}' not found in feature table")

    row = df.loc[mask].iloc[0]
    return {col: row[col] for col in FEATURE_COLUMNS}


def get_feature_matrix(
    df: Optional[pd.DataFrame] = None,
    path: Optional[Path] = None,
) -> tuple[pd.DataFrame, pd.Series]:
    """Return (X, y) ready for model training.

    Parameters
    ----------
    df : pd.DataFrame, optional
        Pre-loaded feature table.
    path : Path, optional
        Feature table CSV location.

    Returns
    -------
    X : pd.DataFrame
        Feature matrix (n_samples × 10 features).
    y : pd.Series
        Binary target column.
    """
    if df is None:
        df = load_feature_table(path)

    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()
    logger.info("Feature matrix shape: %s, target balance: %.1f%% churn",
                X.shape, y.mean() * 100)
    return X, y


def list_customer_ids(
    df: Optional[pd.DataFrame] = None,
    path: Optional[Path] = None,
) -> list[str]:
    """Return all customer IDs in the feature table."""
    if df is None:
        df = load_feature_table(path)
    return df[ID_COLUMN].tolist()
