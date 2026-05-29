import shap
import joblib
import pandas as pd
import numpy as np

# ==========================================
# LOAD TRAINED MODEL
# ==========================================

model = joblib.load("models/churn_model.pkl")

# ==========================================
# CREATE SHAP EXPLAINER
# ==========================================

explainer = shap.TreeExplainer(model)


# ==========================================
# EXPLAIN PREDICTION
# ==========================================

def explain_prediction(customer_data):

    # ======================================
    # CONVERT INPUT TO DATAFRAME
    # ======================================

    df = pd.DataFrame([{

        "tenure":
            customer_data["tenure"],

        "monthlyCharges":
            customer_data["monthlyCharges"],

        "totalCharges":
            customer_data["totalCharges"]

    }])

    # ======================================
    # GENERATE SHAP VALUES
    # ======================================

    shap_values = explainer.shap_values(df)

    print("\n======================")
    print("SHAP VALUES")
    print("======================")

    print(shap_values)

    # ======================================
    # HANDLE DIFFERENT SHAP FORMATS
    # ======================================

    try:

        # Case 1 → list output
        if isinstance(shap_values, list):

            values = shap_values[0][0]

        else:

            values = shap_values[0]

    except Exception as e:

        print("SHAP FORMAT ERROR:")
        print(e)

        values = shap_values

    # ======================================
    # FEATURE NAMES
    # ======================================

    features = [

        "Tenure",
        "Monthly Charges",
        "Total Charges"

    ]

    explanations = []

    # ======================================
    # EXTRACT IMPACT VALUES SAFELY
    # ======================================

    for i in range(len(features)):

        value = values[i]

        # ----------------------------------
        # HANDLE ARRAY OUTPUT
        # Example:
        # [0.12, -0.12]
        # ----------------------------------

        if isinstance(
                value,
                (list, tuple, np.ndarray)
        ):

            # Use positive class impact
            impact = float(value[-1])

        else:

            impact = float(value)

        explanations.append({

            "feature": features[i],

            "impact": round(impact, 4)

        })

    # ======================================
    # SORT BY STRONGEST IMPACT
    # ======================================

    explanations = sorted(

        explanations,

        key=lambda x:
            abs(x["impact"]),

        reverse=True

    )

    print("\n======================")
    print("TOP FEATURES")
    print("======================")

    print(explanations)

    # ======================================
    # RETURN FINAL EXPLANATIONS
    # ======================================

    return explanations