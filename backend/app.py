# backend/app.py
from flask import Flask
from routes.upload_routes import upload_bp
from routes.query_routes import query_bp
import os

def create_app():
    app = Flask(__name__),
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(upload_bp, url_prefix="/upload")
    app.register_blueprint(query_bp, url_prefix="/query")
    # Ensure data directories exist
    os.makedirs("data/uploads", exist_ok=True)
    os.makedirs("data/reports", exist_ok=True)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
