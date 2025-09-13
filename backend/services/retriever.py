# backend/services/retriever.py
"""
Query embeddings from chroma and call Groq for generation.
Install: pip install requests
"""
import os
import requests
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

EMBED_MODEL = os.environ.get("EMBED_MODEL", "all-MiniLM-L6-v2")
MODEL = SentenceTransformer(EMBED_MODEL)

chroma_persist = os.environ.get("CHROMA_PERSIST_DIR", None)
if chroma_persist:
    client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory=chroma_persist))
else:
    client = chromadb.Client(Settings())

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = os.environ.get("GROQ_URL", "https://api.groq.com/openai/v1/chat/completions")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "compound-beta")  # adjust if needed

def retrieve(doc_id, query, top_k=3):
    """
    Return top_k hits: [{'clause_id','text','metadata','distance'}...]
    """
    col = client.get_collection(name=doc_id)
    q_emb = MODEL.encode([query])[0].tolist()
    res = col.query(query_embeddings=[q_emb], n_results=top_k)
    hits = []
    # chroma returns keys as lists of lists
    ids = res.get("ids", [[]])[0]
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0] if "metadatas" in res else [None]*len(ids)
    distances = res.get("distances", [[]])[0] if "distances" in res else [None]*len(ids)
    for i, cid in enumerate(ids):
        hits.append({
            "clause_id": cid,
            "text": docs[i] if i < len(docs) else "",
            "metadata": metas[i] if i < len(metas) else {},
            "distance": distances[i] if i < len(distances) else None
        })
    return hits

def generate_with_groq(query, hits):
    """
    Build a small prompt with retrieved evidence and call Groq (OpenAI-compatible).
    Returns the model reply dict or text.
    """
    if not GROQ_API_KEY:
        return "GROQ_API_KEY not set in environment"

    # Build evidence block
    evidence_lines = []
    for h in hits:
        # truncate clause text length to keep prompt small
        snippet = h["text"][:1000].replace("\n", " ")
        evidence_lines.append(f"[{h['clause_id']}]: {snippet}")
    evidence = "\n\n".join(evidence_lines)

    system_msg = {
    "role": "system",
    "content": (
        "You are a legal assistant. "
        "Answer using ONLY the provided evidence. "
        "Cite clause ids in square brackets. "
        "If evidence is insufficient, reply clearly with 'No relevant clause found.' "
        "Do NOT include hidden reasoning, do NOT use <think> tags."
    )
    }

    user_msg = {
        "role": "user",
        "content": f"QUESTION: {query}\n\nEVIDENCE:\n{evidence}"
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [system_msg, user_msg],
        "max_tokens": 512,
        "temperature": 0.0
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    r = requests.post(GROQ_URL, json=payload, headers=headers, timeout=60)
    r.raise_for_status()
    resp = r.json()
    # try to extract assistant text (OpenAI-like response structure)
    try:
        return resp["choices"][0]["message"]["content"]
    except Exception:
        return resp
