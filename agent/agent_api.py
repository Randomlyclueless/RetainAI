from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# ✅ Allow all origins + all methods (important)
CORS(app)

@app.route("/agent/advice", methods=["POST"])
def get_advice():
    data = request.get_json()

    prob = data.get("probability", 0)
    tenure = data.get("tenure", 0)
    contract = data.get("contract", "")

    if prob > 0.7:
        reason = f"High churn probability ({round(prob*100,2)}%). Customer shows strong disengagement signals."

        action = (
            "1. Immediately offer personalized discount or loyalty benefit.\n"
            "2. Recommend switching to long-term contract (1–2 years).\n"
            "3. Assign customer success manager for retention.\n"
            "4. Send targeted email with value highlights.\n"
            "5. Monitor activity for next 7 days."
        )

    elif prob > 0.4:
        reason = f"Moderate churn risk ({round(prob*100,2)}%). Customer engagement is declining."

        action = (
            "1. Send engagement campaigns (offers, reminders).\n"
            "2. Promote bundled services for higher value.\n"
            "3. Provide small incentives (cashback, upgrades).\n"
            "4. Track usage trends weekly."
        )

    else:
        reason = f"Low churn risk ({round(prob*100,2)}%). Customer is stable and satisfied."

        action = (
            "1. Maintain current service quality.\n"
            "2. Upsell premium features.\n"
            "3. Encourage referrals.\n"
            "4. Reward loyalty with points or perks."
        )

    # 📧 Auto Email Generator

    if prob > 0.7:
        email_subject = "We Value You – Exclusive Offer Inside!"
        email_body = (
            f"Dear Customer,\n\n"
            f"We noticed that your recent engagement has decreased, and we truly value having you with us.\n\n"
            f"As a token of appreciation, we are offering you a special discount on your current plan.\n"
            f"You can also switch to a long-term contract to enjoy additional benefits.\n\n"
            f"Our support team is always here to assist you.\n\n"
            f"Best regards,\nRetainAI Team"
        )

    elif prob > 0.4:
        email_subject = "Let’s Enhance Your Experience!"
        email_body = (
            f"Dear Customer,\n\n"
            f"We want to make sure you are getting the best value from our services.\n"
            f"We have some exciting offers and upgrades that might interest you.\n\n"
            f"Stay connected and explore more features tailored for you.\n\n"
            f"Best regards,\nRetainAI Team"
        )

    else:
        email_subject = "Thank You for Being with Us!"
        email_body = (
            f"Dear Customer,\n\n"
            f"We appreciate your continued trust in our services.\n"
            f"As a valued customer, we encourage you to explore our premium features and referral rewards.\n\n"
            f"Thank you for being a part of our journey.\n\n"
            f"Best regards,\nRetainAI Team"
        )

    return jsonify({
    "reason": reason,
    "recommendation": action,
    "email_subject": email_subject,
    "email_body": email_body
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=7000, debug=True)
