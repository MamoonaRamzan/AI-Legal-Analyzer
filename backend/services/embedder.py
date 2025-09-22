import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from backend.config import EMBED_MODEL, CHROMA_PERSIST_DIR

print("Loading embedding model:", EMBED_MODEL)
sbert = SentenceTransformer(EMBED_MODEL)

# Init chroma client
try:
    if CHROMA_PERSIST_DIR:
        client = chromadb.Client(
            Settings(chroma_db_impl="duckdb+parquet", persist_directory=CHROMA_PERSIST_DIR)
        )
    else:
        client = chromadb.Client()
except Exception:
    client = chromadb.Client()


def get_or_create_collection(name: str):
    try:
        return client.get_or_create_collection(name=name)
    except AttributeError:
        try:
            return client.get_collection(name=name)
        except Exception:
            return client.create_collection(name=name)
