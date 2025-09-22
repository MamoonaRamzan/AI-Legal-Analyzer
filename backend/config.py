import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent.resolve()
UPLOAD_DIR = BASE_DIR / "data" / "uploads"
REPORTS_DIR = BASE_DIR / "data" / "reports"
CHROMA_PERSIST_DIR = os.environ.get("CHROMA_PERSIST_DIR", None)

# Model & API settings
EMBED_MODEL = os.environ.get("EMBED_MODEL", "all-MiniLM-L6-v2")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", None)
GROQ_URL = os.environ.get("GROQ_URL", "https://api.groq.com/openai/v1/chat/completions")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "compound-beta")

# Create folders
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
if CHROMA_PERSIST_DIR:
    Path(CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
