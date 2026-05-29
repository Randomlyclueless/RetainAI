from tools.explainability import explain_prediction


class ExplanationAgent:

    def explain(self, customer_data):

        top_features = explain_prediction(customer_data)

        reasons = []

        for item in top_features:

            feature = item["feature"]

            if feature == "MonthlyCharges":

                reasons.append(
                    "High monthly charges"
                )

            elif feature == "tenure":

                reasons.append(
                    "Low customer tenure"
                )

            elif feature == "TotalCharges":

                reasons.append(
                    "High accumulated billing"
                )

        return {

            "reasons": reasons,

            "topFeatures":
                top_features

        }