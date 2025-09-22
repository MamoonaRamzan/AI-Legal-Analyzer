import re

RISK_LIBRARY = {
    "Unlimited Liability": {
        "impact": "High — exposes party to unbounded financial risk",
        "likelihood": "High — often enforceable if signed",
        "factors": [
            "No liability cap",
            "Covers all damages including indirect/consequential"
        ],
        "mitigation": [
            "Negotiate a liability cap",
            "Exclude indirect or consequential damages"
        ]
    },
    "Auto Renewal": {
        "impact": "Medium — contract may continue without review",
        "likelihood": "High — auto-renew is typically enforceable",
        "factors": [
            "Renewal happens automatically unless notice given",
            "Counterparty benefits from inertia"
        ],
        "mitigation": [
            "Add requirement for explicit renewal",
            "Set reminders before renewal deadlines"
        ]
    },
    "Indemnity Mention": {
        "impact": "High — may shift legal/financial burdens",
        "likelihood": "Medium — scope depends on wording",
        "factors": [
            "Indemnity obligations may be one-sided",
            "Unclear scope of covered damages"
        ],
        "mitigation": [
            "Limit indemnity to direct damages caused by breach",
            "Require mutual indemnity obligations"
        ]
    }
}


def scan_clauses(clauses):
    flags = []
    for c in clauses:
        t = c["text"].lower()

        if re.search(r"unlimited liability|no cap on liability|no limit", t):
            tag = "Unlimited Liability"
            flags.append({
                "clause_id": c["clause_id"],
                "tag": tag,
                "match": c["text"],
                **RISK_LIBRARY[tag]
            })

        if re.search(r"automatic(ally)? renew|renew unless", t):
            tag = "Auto Renewal"
            flags.append({
                "clause_id": c["clause_id"],
                "tag": tag,
                "match": c["text"],
                **RISK_LIBRARY[tag]
            })

        if re.search(r"indemnif", t):
            tag = "Indemnity Mention"
            flags.append({
                "clause_id": c["clause_id"],
                "tag": tag,
                "match": c["text"],
                **RISK_LIBRARY[tag]
            })

    return flags



