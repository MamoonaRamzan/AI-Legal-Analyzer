from backend.services.embedder import sbert, get_or_create_collection, client
from backend.config import CHROMA_PERSIST_DIR

def index_clauses(doc_id: str, clauses):
    col = get_or_create_collection(doc_id)
    ids = [c["clause_id"] for c in clauses]
    docs = [c["text"] for c in clauses]
    embeddings = sbert.encode(docs, show_progress_bar=False).tolist()
    metadatas = [{"doc_id": doc_id} for _ in clauses]

    try:
        col.delete(where={"id": {"$in": ids}})
    except Exception:
        try:
            col.delete(ids=ids)
        except Exception:
            pass

    col.add(documents=docs, metadatas=metadatas, ids=ids, embeddings=embeddings)
    if CHROMA_PERSIST_DIR:
        try:
            client.persist()
        except Exception:
            pass


def retrieve(doc_id: str, query: str, top_k: int = 3):
    col = get_or_create_collection(doc_id)
    q_emb = sbert.encode([query])[0].tolist()
    res = col.query(query_embeddings=[q_emb], n_results=top_k)
    hits = []
    for i, cid in enumerate(res.get("ids", [[]])[0]):
        hits.append({
            "clause_id": cid,
            "text": res["documents"][0][i],
            "metadata": res.get("metadatas", [[]])[0][i],
            "distance": res.get("distances", [[]])[0][i]
        })
    return hits
