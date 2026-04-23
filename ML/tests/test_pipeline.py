"""
Tests for the feature pipeline and feature store.

Run:  python -m pytest tests/test_pipeline.py -v
"""

from __future__ import annotations

import pandas as pd
import pytest

from features.feature_pipeline import (
    FEATURE_COLUMNS,
    ID_COLUMN,
    TARGET_COLUMN,
    clean_raw_data,
    engineer_features,
    load_raw_data,
    validate_feature_table,
)
from features.feature_store import get_customer_features, get_feature_matrix


# ── Fixtures ──────────────────────────────────────────────────────────────────


@pytest.fixture(scope="module")
def raw_df() -> pd.DataFrame:
    """Load the raw Telco CSV once for the whole test module."""
    return load_raw_data()


@pytest.fixture(scope="module")
def clean_df(raw_df: pd.DataFrame) -> pd.DataFrame:
    return clean_raw_data(raw_df)


@pytest.fixture(scope="module")
def feature_df(clean_df: pd.DataFrame) -> pd.DataFrame:
    return engineer_features(clean_df)


# ── Tests: loading ────────────────────────────────────────────────────────────


class TestLoadRawData:
    def test_loads_non_empty(self, raw_df: pd.DataFrame):
        assert len(raw_df) > 0, "Raw dataframe should not be empty"

    def test_has_expected_columns(self, raw_df: pd.DataFrame):
        expected = {"customerID", "tenure", "Churn", "MonthlyCharges", "TotalCharges"}
        assert expected.issubset(set(raw_df.columns))

    def test_missing_file_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            load_raw_data(tmp_path / "nonexistent.csv")


# ── Tests: cleaning ──────────────────────────────────────────────────────────


class TestCleanRawData:
    def test_churn_is_binary(self, clean_df: pd.DataFrame):
        assert set(clean_df["Churn"].unique()).issubset({0, 1})

    def test_total_charges_numeric(self, clean_df: pd.DataFrame):
        assert pd.api.types.is_numeric_dtype(clean_df["TotalCharges"])

    def test_no_na_in_total_charges(self, clean_df: pd.DataFrame):
        assert clean_df["TotalCharges"].isna().sum() == 0

    def test_does_not_mutate_input(self, raw_df: pd.DataFrame):
        original_cols = list(raw_df.columns)
        _ = clean_raw_data(raw_df)
        assert list(raw_df.columns) == original_cols, "clean_raw_data mutated input"


# ── Tests: feature engineering ────────────────────────────────────────────────


class TestEngineerFeatures:
    def test_output_has_all_feature_columns(self, feature_df: pd.DataFrame):
        expected = {ID_COLUMN} | set(FEATURE_COLUMNS) | {TARGET_COLUMN}
        assert expected.issubset(set(feature_df.columns))

    def test_no_nans_in_features(self, feature_df: pd.DataFrame):
        nan_counts = feature_df[FEATURE_COLUMNS].isna().sum()
        assert (nan_counts == 0).all(), f"NaN found: {nan_counts[nan_counts > 0]}"

    def test_feature_adoption_rate_in_range(self, feature_df: pd.DataFrame):
        col = feature_df["feature_adoption_rate"]
        assert col.min() >= 0.0
        assert col.max() <= 1.0

    def test_email_open_rate_in_range(self, feature_df: pd.DataFrame):
        col = feature_df["email_open_rate"]
        assert col.min() >= 0.0
        assert col.max() <= 1.0

    def test_days_as_customer_positive(self, feature_df: pd.DataFrame):
        assert (feature_df["days_as_customer"] >= 0).all()

    def test_row_count_matches_clean(self, clean_df, feature_df):
        assert len(feature_df) == len(clean_df)


# ── Tests: validation ────────────────────────────────────────────────────────


class TestValidateFeatureTable:
    def test_valid_table_passes(self, feature_df: pd.DataFrame):
        # Should not raise
        validate_feature_table(feature_df)

    def test_missing_column_raises(self, feature_df: pd.DataFrame):
        bad_df = feature_df.drop(columns=["email_open_rate"])
        with pytest.raises(ValueError, match="missing columns"):
            validate_feature_table(bad_df)

    def test_nan_raises(self, feature_df: pd.DataFrame):
        bad_df = feature_df.copy()
        bad_df.loc[0, "days_since_last_login"] = None
        with pytest.raises(ValueError, match="NaN"):
            validate_feature_table(bad_df)

    def test_non_binary_target_raises(self, feature_df: pd.DataFrame):
        bad_df = feature_df.copy()
        bad_df.loc[0, TARGET_COLUMN] = 2
        with pytest.raises(ValueError, match="binary"):
            validate_feature_table(bad_df)


# ── Tests: feature store ─────────────────────────────────────────────────────


class TestFeatureStore:
    def test_get_customer_features_returns_dict(self, feature_df: pd.DataFrame):
        cid = feature_df[ID_COLUMN].iloc[0]
        result = get_customer_features(cid, df=feature_df)
        assert isinstance(result, dict)
        assert set(result.keys()) == set(FEATURE_COLUMNS)

    def test_get_customer_features_missing_raises(self, feature_df: pd.DataFrame):
        with pytest.raises(KeyError, match="NOT_A_CUSTOMER"):
            get_customer_features("NOT_A_CUSTOMER", df=feature_df)

    def test_get_feature_matrix_shapes(self, feature_df: pd.DataFrame):
        X, y = get_feature_matrix(df=feature_df)
        assert X.shape[1] == len(FEATURE_COLUMNS)
        assert len(X) == len(y)
        assert set(y.unique()).issubset({0, 1})
