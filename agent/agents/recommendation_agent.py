class RecommendationAgent:

    def recommend(self, customer_data):

        recommendations = []

        if customer_data["monthlyCharges"] > 80:

            recommendations.append(
                "Offer 15% loyalty discount"
            )

        if customer_data["contract"] == 0:

            recommendations.append(
                "Recommend yearly subscription"
            )

        if customer_data["tenure"] < 12:

            recommendations.append(
                "Assign onboarding specialist"
            )

        return {
            "recommendations": recommendations
        }