from jinja2 import Template
from backend.config import REPORTS_DIR
from pathlib import Path

REPORT_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AI Legal Analyzer Report - {{doc_id}}</title>
  <style>
    :root {
      --primary-blue: #2563eb;
      --primary-cyan: #0ea5e9;
      --deep-blue: #1e40af;
      --bg-primary: #0a0a0f;
      --bg-secondary: #1a1a2e;
      --bg-card: #2a2a40;
      --text-primary: #ffffff;
      --text-secondary: #e0e0e0;
      --text-muted: #a0a0a0;
      --glass-blue: rgba(37, 99, 235, 0.1);
      --glass-subtle: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.1);
      --shadow-primary: rgba(37, 99, 235, 0.15);
      --success-green: #10b981;
      --warning-amber: #f59e0b;
      --danger-red: #ef4444;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #1f2937;
      line-height: 1.7;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .doc-id {
      font-size: 1.2rem;
      color: #64748b;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 12px 24px;
      background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
      color: #ffffff;
      border: none;
      border-radius: 12px;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px var(--shadow-primary);
      cursor: pointer;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--shadow-primary);
    }

    .btn:active {
      transform: translateY(0);
    }

    .section {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .risk-flags {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    .flag-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .flag-item:hover {
      background: #f1f5f9;
      border-color: var(--primary-blue);
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
    }

    .flag-icon {
      width: 8px;
      height: 8px;
      background: var(--warning-amber);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .flag-content {
      flex: 1;
    }

    .flag-id {
      font-weight: 600;
      color: var(--primary-cyan);
      font-size: 0.9rem;
    }

    .flag-tag {
      color: #64748b;
      margin-top: 0.25rem;
    }

    .no-flags {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      color: var(--success-green);
      font-weight: 500;
    }

    .clauses-grid {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    .clause-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .clause-item:hover {
      border-color: var(--primary-blue);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    }

    .clause-header {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
      color: var(--primary-blue);
      font-size: 0.9rem;
    }

    .clause-content {
      padding: 1.5rem;
      font-family: 'JetBrains Mono', 'Consolas', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #374151;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    footer {
      text-align: center;
      padding: 2rem;
      color: #64748b;
      font-size: 0.9rem;
      border-top: 1px solid #e2e8f0;
      margin-top: 3rem;
    }

    .stats-bar {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      min-width: 120px;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary-blue);
      display: block;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .stats-bar {
        gap: 1rem;
      }
      
      .stat-item {
        min-width: 100px;
        padding: 0.75rem;
      }
    }

    /* Print styles */
    @media print {
      body {
        background: white;
        color: black;
      }
      
      .section {
        border: 1px solid #ddd;
        box-shadow: none;
        background: white;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>AI Legal Analyzer Report</h1>
      <div class="doc-id">Document: {{doc_id}}</div>
      
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{% if flags %}{{flags|length}}{% else %}0{% endif %}</span>
          <span class="stat-label">Risk Flags</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{clauses|length}}</span>
          <span class="stat-label">Clauses</span>
        </div>
      </div>
      
      <button class="btn" onclick="window.print()">
        <span>📄</span>
        Download Report
      </button>
    </header>

    <div class="section">
      <h3>
        <div class="section-icon">⚠️</div>
        Risk Assessment
      </h3>
      
      {% if flags %}
        <div class="risk-flags">
          {% for f in flags %}
            <div class="flag-item">
              <div class="flag-icon"></div>
              <div class="flag-content">
                <div class="flag-id">{{f.clause_id}}</div>
                <div class="flag-tag">{{f.tag}}</div>
              </div>
            </div>
          {% endfor %}
        </div>
      {% else %}
        <div class="no-flags">
          <span>✅</span>
          <span>No risk flags detected - Document appears compliant</span>
        </div>
      {% endif %}
    </div>

    <div class="section">
      <h3>
        <div class="section-icon">📋</div>
        Contract Clauses ({{clauses|length}} total)
      </h3>
      
      <div class="clauses-grid">
        {% for c in clauses %}
          <div class="clause-item" id="{{c.clause_id}}">
            <div class="clause-header">
              Clause {{c.clause_id}}
            </div>
            <div class="clause-content">{{c.text}}</div>
          </div>
        {% endfor %}
      </div>
    </div>

    <footer>
      <p>Generated by AI Legal Analyzer • Report created on {{ timestamp or 'current date' }}</p>
    </footer>
  </div>
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
