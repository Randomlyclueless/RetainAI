from agents.prediction_agent import PredictionAgent
from agents.explanation_agent import ExplanationAgent
from agents.recommendation_agent import RecommendationAgent

prediction_agent = PredictionAgent()

explanation_agent = ExplanationAgent()

recommendation_agent = RecommendationAgent()


class RetentionWorkflow:

    def run(self, customer_data):

        prediction = prediction_agent.predict(customer_data)

        explanation = explanation_agent.explain(customer_data)

        recommendation = recommendation_agent.recommend(customer_data)

        return {

            "prediction": prediction,

            "explanation": explanation,

            "recommendation": recommendation,

        }