import joblib
import pandas as pd

# ==========================================
# LOAD TRAINED PIPELINE
# ==========================================

model = joblib.load("models/churn_model.pkl")


class PredictionAgent:

    def predict(self, customer_data):

        # ==========================================
        # CREATE INPUT DATAFRAME
        # ==========================================

        input_data = pd.DataFrame([{

            "gender": customer_data.get("gender", "Male"),

            "SeniorCitizen": customer_data.get("seniorCitizen", 0),

            "Partner": customer_data.get("partner", "No"),

            "Dependents": customer_data.get("dependents", "No"),

            "tenure": customer_data.get("tenure", 0),

            "PhoneService": customer_data.get("phoneService", "Yes"),

            "MultipleLines": customer_data.get("multipleLines", "No"),

            "InternetService": customer_data.get("internetService", "DSL"),

            "OnlineSecurity": customer_data.get("onlineSecurity", "No"),

            "OnlineBackup": customer_data.get("onlineBackup", "No"),

            "DeviceProtection": customer_data.get("deviceProtection", "No"),

            "TechSupport": customer_data.get("techSupport", "No"),

            "StreamingTV": customer_data.get("streamingTV", "No"),

            "StreamingMovies": customer_data.get("streamingMovies", "No"),

            "Contract": customer_data.get("contract", "Month-to-month"),

            "PaperlessBilling": customer_data.get("paperlessBilling", "Yes"),

            "PaymentMethod": customer_data.get(
                "paymentMethod",
                "Electronic check"
            ),

            "MonthlyCharges": customer_data.get("monthlyCharges", 0),

            "TotalCharges": customer_data.get("totalCharges", 0)

        }])

        # ==========================================
        # MODEL PREDICTION
        # ==========================================

        prediction = int(model.predict(input_data)[0])

        probability = float(
            model.predict_proba(input_data)[0][1]
        )

        # ==========================================
        # BUSINESS INTELLIGENCE
        # ==========================================

        if probability >= 0.80:
            risk_level = "High"
            priority = "Immediate Action"
            recommendation = (
                "Immediately contact the customer. "
                "Assign a relationship manager and offer a loyalty discount."
            )

        elif probability >= 0.50:
            risk_level = "Medium"
            priority = "Contact Within 7 Days"
            recommendation = (
                "Offer personalized retention plans and monitor engagement."
            )

        else:
            risk_level = "Low"
            priority = "Routine Monitoring"
            recommendation = (
                "Maintain regular customer engagement through loyalty programs."
            )

        # ==========================================
        # CUSTOMER HEALTH SCORE
        # ==========================================

        customer_health = round((1 - probability) * 100)

        retention_score = customer_health

        confidence_score = max(
            probability,
            1 - probability
        )

        if confidence_score >= 0.90:
            confidence = "Very High"
        elif confidence_score >= 0.75:
            confidence = "High"
        elif confidence_score >= 0.60:
            confidence = "Medium"
        else:
            confidence = "Low"

        # ==========================================
        # SIMPLE RISK DRIVERS
        # ==========================================

        risk_drivers = []

        if customer_data.get("tenure", 0) < 12:
            risk_drivers.append("Short customer tenure")

        if customer_data.get("monthlyCharges", 0) > 80:
            risk_drivers.append("High monthly charges")

        if customer_data.get("contract", "") == "Month-to-month":
            risk_drivers.append("Month-to-month contract")

        if customer_data.get("onlineSecurity", "") == "No":
            risk_drivers.append("No online security service")

        if customer_data.get("techSupport", "") == "No":
            risk_drivers.append("No tech support subscription")

        if len(risk_drivers) == 0:
            risk_drivers.append(
                "No significant churn indicators detected."
            )

        # ==========================================
        # RETURN RESPONSE
        # ==========================================

        return {

            "prediction": prediction,

            "probability": round(probability, 4),

            "riskLevel": risk_level,

            "confidence": confidence,

            "customerHealth": customer_health,

            "retentionScore": retention_score,

            "priority": priority,

            "recommendedAction": recommendation,

            "riskDrivers": risk_drivers

        }