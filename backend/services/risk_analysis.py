import re

def scan_clauses(clauses):
    flags = []
    for c in clauses:
        t = c["text"].lower()
        if re.search(r"unlimited liability|no cap on liability|no limit", t):
            flags.append({"clause_id": c["clause_id"], "tag": "Unlimited Liability"})
        if re.search(r"automatic(ally)? renew|renew unless", t):
            flags.append({"clause_id": c["clause_id"], "tag": "Auto Renewal"})
        if re.search(r"indemnif", t):
            flags.append({"clause_id": c["clause_id"], "tag": "Indemnity Mention"})
    return flags
