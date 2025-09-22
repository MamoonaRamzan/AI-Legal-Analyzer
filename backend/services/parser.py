import re
import fitz
from pathlib import Path

def parse_document_simple(path: Path, max_clause_chars: int = 2000):
    ext = path.suffix.lower()
    text = ""
    if ext == ".pdf":
        doc = fitz.open(str(path))
        pages = [p.get_text() for p in doc]
        text = "\n".join(pages)
    elif ext in [".txt", ".md"]:
        text = path.read_text(encoding="utf-8", errors="ignore")
    else:
        try:
            doc = fitz.open(str(path))
            pages = [p.get_text() for p in doc]
            text = "\n".join(pages)
        except Exception:
            text = path.read_text(encoding="utf-8", errors="ignore")

    parts = [p.strip() for p in re.split(r"\n{2,}|\r\n{2,}", text) if p.strip()]
    clauses, idx = [], 1
    for part in parts:
        if len(part) <= max_clause_chars:
            clauses.append({"clause_id": f"c{idx}", "text": part})
            idx += 1
        else:
            start = 0
            while start < len(part):
                chunk = part[start:start + max_clause_chars]
                clauses.append({"clause_id": f"c{idx}", "text": chunk})
                idx += 1
                start += max_clause_chars
    return clauses
