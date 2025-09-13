#!/usr/bin/env python3
"""
run_app.py - single-file runnable AI Legal Analyzer MVP
- Upload a file (/upload)
- Analyze file: parse into clauses, index into Chroma (/analyze)
- Query a document (/query) -> retrieve top-k clauses + call Groq (if GROQ_API_KEY set)
- Init a sample document (/init_sample) for quick testing
"""

import os
import re
import json
from pathlib import Path
from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename

# External libs - ensure installed
try:
    import fitz  # pymupdf
except Exception as e:
    raise RuntimeError("Missing dependency 'pymupdf' (fitz). pip install pymupdf") from e

try:
    from sentence_transformers import SentenceTransformer
except Exception as e:
    raise RuntimeError("Missing 'sentence-transformers'. pip install sentence-transformers (and torch)") from e

try:
    import chromadb
    from chromadb.config import Settings
except Exception:
    # chromadb import may vary by version - try client simple import
    try:
        import chromadb
        from chromadb.config import Settings  # best-effort
    except Exception as e:
        raise RuntimeError("Missing 'chromadb'. pip install chromadb") from e

try:
    import requests
except Exception:
    raise RuntimeError("Missing 'requests'. pip install requests")

try:
    from jinja2 import Template
except Exception:
    raise RuntimeError("Missing 'jinja2'. pip install jinja2")

# --- Configuration ---
BASE_DIR = Path(__file__).parent.resolve()
UPLOAD_DIR = BASE_DIR / "data" / "uploads"
REPORTS_DIR = BASE_DIR / "data" / "reports"
CHROMA_PERSIST_DIR = os.environ.get("CHROMA_PERSIST_DIR", None)  # optional
EMBED_MODEL = os.environ.get("EMBED_MODEL", "all-MiniLM-L6-v2")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", None)
GROQ_URL = os.environ.get("GROQ_URL", "https://api.groq.com/openai/v1/chat/completions")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "compound-beta")

# create folders
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
if CHROMA_PERSIST_DIR:
    Path(CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)

# --- Init embedding model ---
print("Loading embedding model:", EMBED_MODEL)
sbert = SentenceTransformer(EMBED_MODEL)

# --- Init chromadb client (best-effort across versions) ---
try:
    if CHROMA_PERSIST_DIR:
        client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory=CHROMA_PERSIST_DIR))
    else:
        client = chromadb.Client()
except Exception:
    # fallback
    client = chromadb.Client()

def get_or_create_collection(name: str):
    # Cover multiple chroma versions
    try:
        return client.get_or_create_collection(name=name)
    except AttributeError:
        # older/newer API
        try:
            return client.get_collection(name=name)
        except Exception:
            try:
                return client.create_collection(name=name)
            except Exception:
                # final fallback: try a collection name access pattern
                return client.create_collection(name=name)

# --- Helper functions ---
def parse_document_simple(path: Path, max_clause_chars: int = 2000):
    """
    Support .pdf and .txt files.
    Returns list of {'clause_id','text'}
    """
    ext = path.suffix.lower()
    text = ""
    if ext == ".pdf":
        doc = fitz.open(str(path))
        pages = [p.get_text() for p in doc]
        text = "\n".join(pages)
    elif ext in [".txt", ".md"]:
        text = path.read_text(encoding="utf-8", errors="ignore")
    else:
        # attempt pdf read by fallback
        try:
            doc = fitz.open(str(path))
            pages = [p.get_text() for p in doc]
            text = "\n".join(pages)
        except Exception:
            text = path.read_text(encoding="utf-8", errors="ignore")

    # naive split: by double newline and numbered headings
    parts = [p.strip() for p in re.split(r"\n{2,}|\r\n{2,}", text) if p.strip()]
    clauses = []
    idx = 1
    for part in parts:
        if len(part) <= max_clause_chars:
            clauses.append({"clause_id": f"c{idx}", "text": part})
            idx += 1
        else:
            # chunk large part
            start = 0
            while start < len(part):
                chunk = part[start:start + max_clause_chars]
                clauses.append({"clause_id": f"c{idx}", "text": chunk})
                idx += 1
                start += max_clause_chars
    return clauses

def index_clauses(doc_id: str, clauses):
    """
    Encode and add to chroma collection
    """
    col = get_or_create_collection(doc_id)
    ids = [c["clause_id"] for c in clauses]
    docs = [c["text"] for c in clauses]
    embeddings = sbert.encode(docs, show_progress_bar=False).tolist()
    metadatas = [{"doc_id": doc_id} for _ in clauses]

    # attempt to delete existing docs with same ids (best-effort)
    try:
        # newer chroma API
        col.delete(where={"id": {"$in": ids}})
    except Exception:
        try:
            col.delete(ids=ids)
        except Exception:
            pass

    # add
    col.add(documents=docs, metadatas=metadatas, ids=ids, embeddings=embeddings)
    if CHROMA_PERSIST_DIR:
        try:
            client.persist()
        except Exception:
            pass

def retrieve(doc_id: str, query: str, top_k: int = 3):
    """
    Return list of hits: {'clause_id','text','metadata','distance'}
    """
    col = get_or_create_collection(doc_id)
    q_emb = sbert.encode([query])[0].tolist()
    res = col.query(query_embeddings=[q_emb], n_results=top_k)
    hits = []
    ids = res.get("ids", [[]])[0]
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0] if "metadatas" in res else [None]*len(ids)
    dists = res.get("distances", [[]])[0] if "distances" in res else [None]*len(ids)
    for i, cid in enumerate(ids):
        hits.append({
            "clause_id": cid,
            "text": docs[i] if i < len(docs) else "",
            "metadata": metas[i] if i < len(metas) else {},
            "distance": dists[i] if i < len(dists) else None
        })
    return hits

def generate_with_groq(query: str, hits):
    """
    If GROQ_API_KEY is set, call Groq OpenAI-compatible endpoint.
    Otherwise, return a stubbed answer using evidence concatenation.
    """
    if not GROQ_API_KEY:
        # return stub - useful for testing pipeline without Groq
        ev_parts = []
        for h in hits:
            cleaned_text = h['text'][:400].replace("\n", " ")  # replace newline safely
            ev_parts.append(f"[{h['clause_id']}]: {cleaned_text}")

        ev = "\n\n".join(ev_parts)

        return f"(GROQ_API_KEY not set) Evidence returned:\n\n{ev}"

    evidence_lines = []
    for h in hits:
        snippet = h["text"][:1000].replace("\n", " ")
        evidence_lines.append(f"[{h['clause_id']}]: {snippet}")
    evidence = "\n\n".join(evidence_lines)

    system_msg = {
        "role": "system",
        "content": "You are a strict legal assistant. Answer using ONLY the provided evidence. Cite clause ids in square brackets. If insufficient, reply 'INSUFFICIENT_CONTEXT'."
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
    # extract assistant content using OpenAI-like format
    try:
        return resp["choices"][0]["message"]["content"]
    except Exception:
        return resp

def scan_clauses(clauses):
    flags = []
    for c in clauses:
        t = c["text"].lower()
        if re.search(r"unlimited liability|no cap on liability|no limit on liability|no limit", t):
            flags.append({"clause_id": c["clause_id"], "tag": "Unlimited Liability"})
        if re.search(r"automatic(ally)? renew|automatically renew|renew unless", t):
            flags.append({"clause_id": c["clause_id"], "tag": "Auto Renewal"})
        if re.search(r"indemnif", t):
            flags.append({"clause_id": c["clause_id"], "tag": "Indemnity Mention"})
    return flags

REPORT_TEMPLATE = """
<html>
<head><meta charset="utf-8"><title>Report - {{doc_id}}</title></head>
<body>
  <h1>AI Legal Analyzer Report</h1>
  <h2>Document: {{doc_id}}</h2>
  <h3>Risk Flags</h3>
  {% if flags %}
    <ul>
    {% for f in flags %}
      <li><strong>{{f.clause_id}}</strong> — {{f.tag}}</li>
    {% endfor %}
    </ul>
  {% else %}
    <p>No risk flags detected.</p>
  {% endif %}
  <h3>First clauses</h3>
  <ol>
  {% for c in clauses %}
    <li id="{{c.clause_id}}"><pre style="white-space:pre-wrap;">{{c.clause_id}}: {{c.text}}</pre></li>
  {% endfor %}
  </ol>
</body>
</html>
"""

def build_and_save_report(doc_id: str, clauses, flags):
    tpl = Template(REPORT_TEMPLATE)
    html = tpl.render(doc_id=doc_id, clauses=clauses[:30], flags=flags)
    out_path = REPORTS_DIR / f"{doc_id}.html"
    with out_path.open("w", encoding="utf-8") as f:
        f.write(html)
    return str(out_path)

# --- Flask app & routes ---
app = Flask(__name__)
CORS(app)

@app.route("/healthz", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/upload", methods=["POST"])
def upload():
    print("Upload route hit!")
    f = request.files.get("file")
    if not f:
        return jsonify({"success": False, "error": "No file (use form field 'file')"}), 400
    
    fname = secure_filename(f.filename)
    save_to = UPLOAD_DIR / fname
    f.save(save_to)
    
    return jsonify({"success": True, "filename": fname}), 200

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}
    filename = data.get("filename")
    if not filename:
        return jsonify({"error": "provide filename in JSON body"}), 400
    path = UPLOAD_DIR / filename
    if not path.exists():
        return jsonify({"error": "file not found"}), 404

    clauses = parse_document_simple(path)
    index_clauses(filename, clauses)
    flags = scan_clauses(clauses)
    report_path = build_and_save_report(filename, clauses, flags)
    return jsonify({"doc_id": filename, "num_clauses": len(clauses), "flags": flags, "report_path": report_path}), 200

@app.route("/query", methods=["POST"])
def query():
    body = request.get_json() or {}
    doc_id = body.get("doc_id")
    query_text = body.get("query")
    top_k = int(body.get("top_k", 3))
    if not doc_id or not query_text:
        return jsonify({"error": "doc_id and query are required"}), 400

    try:
        hits = retrieve(doc_id, query_text, top_k=top_k)
    except Exception as e:
        return jsonify({"error": f"retrieval failed: {e}"}), 500

    try:
        answer = generate_with_groq(query_text, hits)
    except Exception as e:
        return jsonify({"error": f"generation failed: {e}"}), 500

    return jsonify({"answer": answer, "evidence": hits}), 200

@app.route("/report/<doc_id>", methods=["GET"])
def get_report(doc_id):
    p = REPORTS_DIR / f"{doc_id}.html"
    if not p.exists():
        return jsonify({"error": "report not found"}), 404
    return send_file(str(p), mimetype="text/html")

@app.route("/init_sample", methods=["POST"])
def init_sample():
    """
    Create a small sample text file, index it, and return doc_id and report path.
    Useful for quick testing without uploading files.
    """
    doc_id = "sample_contract.txt"
    sample_text = (
        "1. Liability\\nProvider's liability shall be limited to the fees paid in the prior 12 months.\\n\\n"
        "2. Indemnity\\nCustomer shall indemnify Provider for third party claims arising from Customer data.\\n\\n"
        "3. Term and Renewal\\nThis Agreement shall automatically renew for one-year terms unless either party gives 60 days notice.\\n\\n"
        "4. Confidentiality\\nBoth parties must keep confidential information secret for 3 years."
    )
    p = UPLOAD_DIR / doc_id
    p.write_text(sample_text, encoding="utf-8")
    clauses = parse_document_simple(p)
    index_clauses(doc_id, clauses)
    flags = scan_clauses(clauses)
    report = build_and_save_report(doc_id, clauses, flags)
    return jsonify({"doc_id": doc_id, "num_clauses": len(clauses), "flags": flags, "report_path": report}), 200


@app.errorhandler(Exception)
def handle_exception(e):
    # Catch-all for unexpected errors
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # run
    app.run(host="0.0.0.0", port=5000, debug=True)
