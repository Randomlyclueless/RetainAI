from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load("churn_model.pkl")

# Encoding maps
contract_map = {
    "Month-to-month": 0,
    "One year": 1,
    "Two year": 2
}

internet_map = {
    "DSL": 0,
    "Fiber optic": 1,
    "No": 2
}

payment_map = {
    "Bank transfer": 0,
    "Credit card": 1,
    "Electronic check": 2,
    "Mailed check": 3
}

@app.route('/')
def home():
    return "ML API is running"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Convert categorical → numeric
        contract = contract_map.get(data['Contract'], 0)
        internet = internet_map.get(data['InternetService'], 0)
        payment = payment_map.get(data['PaymentMethod'], 0)

        # Use DataFrame (fixes warning)
        df = pd.DataFrame([{
            "tenure": float(data['tenure']),
            "MonthlyCharges": float(data['MonthlyCharges']),
            "TotalCharges": float(data['TotalCharges']),
            "Contract": contract,
            "InternetService": internet,
            "PaymentMethod": payment
        }])

        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)