from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("churn_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    try:
        # IMPORTANT: same order as training
        features = np.array([[
            data['tenure'],
            data['MonthlyCharges'],
            data['TotalCharges'],
            data['Contract'],
            data['InternetService'],
            data['PaymentMethod']
        ]])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=5000)