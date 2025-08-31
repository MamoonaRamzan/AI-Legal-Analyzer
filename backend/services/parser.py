# backend/services/parser.py
"""
Simple parser: extract text with PyMuPDF (fitz) and split into naive clauses.
Install: pip install pymupdf
"""
import fitz  # PyMuPDF

def parse_document_simple(path, max_clause_chars=2000):
    """
    Returns list of clauses: [{'clause_id': 'c1', 'text': '...'}, ...]
    Naive splitting: by double newlines and headings. Trim long clauses.
    """
    doc = fitz.open(path)
    pages = []
    for p in doc:
        pages.append(p.get_text())
    text = "\n".join(pages)

    # Basic split heuristic
    raw_parts = []
    # try to split by section-like patterns first
    for part in text.split("\n\n"):
        part = part.strip()
        if part:
            raw_parts.append(part)

    clauses = []
    idx = 1
    for part in raw_parts:
        # further split long parts into windows
        if len(part) <= max_clause_chars:
            clauses.append({"clause_id": f"c{idx}", "text": part})
            idx += 1
        else:
            # sliding window split
            start = 0
            while start < len(part):
                chunk = part[start:start + max_clause_chars]
                clauses.append({"clause_id": f"c{idx}", "text": chunk})
                idx += 1
                start += max_clause_chars
    return clauses
