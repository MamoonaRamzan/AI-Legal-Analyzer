from flask import Flask
from routes.upload_routes import upload_bp
from routes.query_routes import query_bp

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(upload_bp, url_prefix="/upload")
    app.register_blueprint(query_bp, url_prefix="/query")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
