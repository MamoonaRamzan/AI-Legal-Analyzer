# backend/app.py
from flask import Flask
from backend.routes.upload_routes import upload_bp
from backend.routes.query_routes import query_bp
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(upload_bp)   # /upload
    app.register_blueprint(query_bp)    # /analyze, /query, /report/<doc_id>
    # Ensure data directories exist
    os.makedirs("data/uploads", exist_ok=True)
    os.makedirs("data/reports", exist_ok=True)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)

## python -m backend.app