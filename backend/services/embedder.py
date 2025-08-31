# backend/services/embedder.py
"""
Embedding + indexing using sentence-transformers + chromadb (local).
Install: pip install sentence-transformers chromadb
"""
import os
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

EMBED_MODEL = os.environ.get("EMBED_MODEL", "all-MiniLM-L6-v2")

# create sentence-transformers model once
_sbert = SentenceTransformer(EMBED_MODEL)

# chroma client with local persistence (optional)
chroma_persist = os.environ.get("CHROMA_PERSIST_DIR", None)
if chroma_persist:
    client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory=chroma_persist))
else:
    client = chromadb.Client(Settings())

def index_clauses(doc_id, clauses):
    """
    Save clauses to a chroma collection named after doc_id.
    Clauses: list of {'clause_id', 'text'}
    """
    # transform lists
    ids = [c["clause_id"] for c in clauses]
    docs = [c["text"] for c in clauses]
    embeddings = _sbert.encode(docs, show_progress_bar=False).tolist()
    metadatas = [{"doc_id": doc_id} for _ in clauses]

    # get or create collection
    col = client.get_or_create_collection(name=doc_id)
    # remove existing collection content (idempotent for re-index) - optional
    try:
        # chroma provides delete method; to be safe, if exists, delete and recreate
        # but use simple add which will error if duplicate ids; to avoid duplicates, remove them first
        col.delete(where={"id": {"$in": ids}})
    except Exception:
        # ignore if delete not supported in this chroma version
        pass

    col.add(documents=docs, metadatas=metadatas, ids=ids, embeddings=embeddings)

    # persist if configured
    if chroma_persist:
        client.persist()
