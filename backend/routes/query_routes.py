# backend/routes/query_routes.py
from flask import Blueprint, request, jsonify
from services import retriever

query_bp = Blueprint("query", __name__)

@query_bp.route("/", methods=["POST"])
def query_contract():
    """
    Request body JSON:
    {
      "doc_id": "filename.pdf",
      "query": "What does the indemnity clause say?",
      "top_k": 3
    }
    """
    data = request.get_json() or {}
    doc_id = data.get("doc_id")
    query = data.get("query")
    top_k = int(data.get("top_k", 3))

    if not doc_id or not query:
        return jsonify({"error": "doc_id and query are required"}), 400

    try:
        hits = retriever.retrieve(doc_id, query, top_k=top_k)
    except Exception as e:
        return jsonify({"error": f"Retrieval error: {e}"}), 500

    # Call Groq to generate an answer based on evidence (hits)
    try:
        answer = retriever.generate_with_groq(query, hits)
    except Exception as e:
        return jsonify({"error": f"Generation error: {e}"}), 500

    return jsonify({
        "answer": answer,
        "evidence": hits
    }), 200
