# backend/routes/upload_routes.py
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from backend.config import UPLOAD_DIR

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload():
    f = request.files.get("file")
    if not f:
        return jsonify({"success": False, "error": "No file provided"}), 400
    
    fname = secure_filename(f.filename)
    save_to = UPLOAD_DIR / fname
    f.save(save_to)
    
    return jsonify({"success": True, "filename": fname}), 200
