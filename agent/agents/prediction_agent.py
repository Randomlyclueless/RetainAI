import joblib
import pandas as pd


# =========================
# LOAD TRAINED MODEL
# =========================

model = joblib.load(
    "models/churn_model.pkl"
)


class PredictionAgent:

    def predict(self, customer_data):

        input_data = pd.DataFrame([{

            "tenure":
                customer_data.get(
                    "tenure",
                    0
                ),

            "MonthlyCharges":
                customer_data.get(
                    "monthlyCharges",
                    0
                ),

            "TotalCharges":
                customer_data.get(
                    "totalCharges",
                    0
                ),

        }])

        prediction = int(
            model.predict(input_data)[0]
        )

        probability = float(

            model.predict_proba(
                input_data
            )[0][1]

        )

        return {

            "prediction":
                prediction,

            "probability":
                round(probability, 2),

        }