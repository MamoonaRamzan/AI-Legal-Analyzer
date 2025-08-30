from flask import Blueprint, request, jsonify

query_bp = Blueprint("query", __name__)

@query_bp.route("/", methods=["POST"])
def query_contract():
    question = request.json.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    # TODO: Add logic to run RAG + Groq model
    return jsonify({"answer": f"Stub answer for: {question}"}), 200
