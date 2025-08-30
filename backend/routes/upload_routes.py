from flask import Blueprint, request, jsonify

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/", methods=["POST"])
def upload_contract():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    # TODO: Add logic to parse and save file
    return jsonify({"message": f"Received {file.filename}"}), 200
