from flask import Blueprint, request, jsonify, send_file
from backend.config import UPLOAD_DIR, REPORTS_DIR
from backend.services.parser import parse_document_simple
from backend.services.retriever import index_clauses, retrieve
from backend.services.risk_analysis import scan_clauses
from backend.reports.report_generator import build_and_save_report
from backend.services.embedder import sbert
import requests
from backend.config import GROQ_API_KEY, GROQ_URL, GROQ_MODEL

query_bp = Blueprint("query", __name__)

@query_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}
    filename = data.get("filename")
    if not filename:
        return jsonify({"error": "provide filename"}), 400
    path = UPLOAD_DIR / filename
    if not path.exists():
        return jsonify({"error": "file not found"}), 404

    clauses = parse_document_simple(path)
    index_clauses(filename, clauses)
    flags = scan_clauses(clauses)
    report_path = build_and_save_report(filename, clauses, flags)
    return jsonify({"doc_id": filename, "num_clauses": len(clauses), "flags": flags, "report_path": report_path}), 200


@query_bp.route("/query", methods=["POST"])
def query():
    body = request.get_json() or {}
    doc_id = body.get("doc_id")
    query_text = body.get("query")
    top_k = int(body.get("top_k", 3))
    if not doc_id or not query_text:
        return jsonify({"error": "doc_id and query are required"}), 400

    hits = retrieve(doc_id, query_text, top_k=top_k)

    if not GROQ_API_KEY:
        return jsonify({"answer": "(No API Key) Evidence only", "evidence": hits})

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "You are a strict legal assistant. Use evidence only."},
            {"role": "user", "content": f"QUESTION: {query_text}\n\nEVIDENCE:\n{hits}"}
        ],
        "max_tokens": 512,
        "temperature": 0.0
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    r = requests.post(GROQ_URL, json=payload, headers=headers, timeout=60)
    answer = r.json()["choices"][0]["message"]["content"]

    return jsonify({"answer": answer, "evidence": hits}), 200


@query_bp.route("/report/<doc_id>", methods=["GET"])
def get_report(doc_id):
    p = REPORTS_DIR / f"{doc_id}.html"
    if not p.exists():
        return jsonify({"error": "report not found"}), 404
    return send_file(str(p), mimetype="text/html")
