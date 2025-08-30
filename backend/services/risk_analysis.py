def analyze_risks(text):
    """
    Very simple risk detection (later: advanced).
    """
    risks = []
    if "unlimited liability" in text.lower():
        risks.append("⚠️ Unlimited liability found")
    return risks
