from jinja2 import Template
from backend.config import REPORTS_DIR
from pathlib import Path

REPORT_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AI Legal Analyzer Report - {{ doc_id }}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 40px;
      background: #f9f9f9;
      color: #333;
    }
    header {
      text-align: center;
      padding: 40px;
      background: #003366;
      color: white;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    h1, h2, h3 {
      margin-bottom: 10px;
    }
    h1 {
      font-size: 2.5em;
    }
    h2 {
      color: #003366;
      margin-top: 30px;
    }
    h3 {
      margin-top: 20px;
      color: #444;
    }
    .button-container {
      text-align: right;
      margin-bottom: 20px;
    }
    .download-btn {
      padding: 10px 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      font-weight: bold;
    }
    .download-btn:hover {
      background: #004c99;
    }
    .flag {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .flag h3 {
      margin: 0 0 10px;
      color: #003366;
    }
    .flag p {
      margin: 6px 0;
    }
    ul {
      margin: 6px 0 12px 20px;
    }
    pre {
      background: #f0f0f0;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.95em;
    }
  </style>
</head>
<body>

<header>
  <h1>AI Legal Analyzer Report</h1>
  <p><strong>Document:</strong> {{ doc_id }}</p>
</header>

<div class="button-container">
  <button class="download-btn" onclick="window.print()">⬇ Download as PDF</button>
</div>

<h2>Risk Analysis</h2>
{% if flags %}
  {% for f in flags %}
    <div class="flag">
      <h3>{{ f.tag }} ({{ f.clause_id }})</h3>
      <p><strong>Clause Snippet:</strong></p>
      <pre>{{ f.match }}</pre>
      <p><strong>Impact:</strong> {{ f.impact }}</p>
      <p><strong>Likelihood:</strong> {{ f.likelihood }}</p>
      <p><strong>Contributing Factors:</strong></p>
      <ul>
        {% for fact in f.factors %}
          <li>{{ fact }}</li>
        {% endfor %}
      </ul>
      <p><strong>Mitigation Strategies:</strong></p>
      <ul>
        {% for strat in f.mitigation %}
          <li>{{ strat }}</li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
{% else %}
  <p>No risks detected 🎉</p>
{% endif %}

<h2>All Clauses</h2>
<ol>
{% for c in clauses %}
  <li id="{{ c.clause_id }}">
    <pre>{{ c.clause_id }}: {{ c.text }}</pre>
  </li>
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
