from flask import Flask, request, jsonify
from flask_cors import CORS

from workflows.retention_workflow import RetentionWorkflow
from agents.copilot_agent import CopilotAgent

app = Flask(__name__)

CORS(app)

workflow = RetentionWorkflow()
copilot = CopilotAgent()

@app.route("/copilot", methods=["POST"])

def copilot_chat():

    data = request.json

    question = data.get("question")

    result = copilot.answer(question)

    return jsonify(result)

@app.route("/analyze", methods=["POST"])
def analyze():

    customer_data = request.json

    result = workflow.run(customer_data)

    return jsonify(result)

@app.route("/")

def home():

    return {

        "message":
            "RetainAI Agent Server Running"

    }


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )