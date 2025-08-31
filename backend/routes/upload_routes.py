# backend/routes/upload_routes.py
from flask import Blueprint, request, jsonify
import os
from services import parser, embedder, risk_analysis, reports

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/", methods=["POST"])
def upload_contract():
    """
    Upload a file (multipart form-data with key 'file').
    Saves file, parses clauses, indexes clauses, runs basic risk scan and creates a simple report.
    """
    f = request.files.get("file")
    if not f:
        return jsonify({"error": "No file uploaded (field name 'file')"}), 400

    filename = f.filename
    save_path = os.path.join("data", "uploads", filename)
    f.save(save_path)

    # Parse into clauses
    clauses = parser.parse_document_simple(save_path)

    # Index clauses (embeddings -> chroma)
    try:
        embedder.index_clauses(filename, clauses)
    except Exception as e:
        return jsonify({"error": f"Indexing failed: {e}"}), 500

    # Basic risk scan
    flags = risk_analysis.scan_clauses(clauses)

    # Build a small HTML report and save
    report_path = reports.build_and_save_report(filename, clauses, flags)

    return jsonify({
        "message": "File uploaded, parsed and indexed",
        "filename": filename,
        "num_clauses": len(clauses),
        "risk_flags": flags,
        "report_path": report_path
    }), 200
