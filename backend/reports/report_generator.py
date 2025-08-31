# backend/reports/report_generator.py
from jinja2 import Template
import os
import json

TEMPLATE = """
<html>
<head><meta charset="utf-8"><title>Report - {{doc_id}}</title></head>
<body>
  <h1>AI Legal Analyzer Report</h1>
  <h2>Document: {{doc_id}}</h2>
  <h3>Risk Flags</h3>
  {% if flags %}
    <ul>
    {% for f in flags %}
      <li><strong>{{f.clause_id}}</strong> — {{f.tag}} — {{f.match}}</li>
    {% endfor %}
    </ul>
  {% else %}
    <p>No risk flags detected.</p>
  {% endif %}

  <h3>Clauses (first {{clauses|length}})</h3>
  <ol>
  {% for c in clauses %}
    <li id="{{c.clause_id}}"><pre style="white-space:pre-wrap;">{{c.clause_id}}: {{c.text}}</pre></li>
  {% endfor %}
  </ol>
</body>
</html>
"""

def build_and_save_report(doc_id, clauses, flags):
    tpl = Template(TEMPLATE)
    html = tpl.render(doc_id=doc_id, clauses=clauses, flags=flags)
    out_dir = os.path.join("data", "reports")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{doc_id}.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    return out_path
