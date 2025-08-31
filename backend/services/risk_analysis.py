# backend/services/risk_analysis.py
import re

def scan_clauses(clauses):
    """
    Very simple rule-based risk detection. Clauses is list of {'clause_id','text'}
    Returns list of {'clause_id','tag','match_text'}
    """
    flags = []
    for c in clauses:
        txt = c["text"].lower()
        if re.search(r"unlimited liability|no cap on liability|no limit on liability|no limit", txt):
            flags.append({"clause_id": c["clause_id"], "tag": "Unlimited Liability", "match": "found pattern 'unlimited liability'"})
        if re.search(r"automatic(ally)? renew|automatically renew|renew unless", txt):
            flags.append({"clause_id": c["clause_id"], "tag": "Auto Renewal", "match": "found auto-renewal language"})
        if re.search(r"indemnif", txt):
            flags.append({"clause_id": c["clause_id"], "tag": "Indemnity Mention", "match": "indemnity wording present"})
    return flags
