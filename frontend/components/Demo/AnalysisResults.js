import { useState } from "react";
import { BarChart3, FileText, AlertTriangle, ExternalLink, Eye, Download, Shield, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function AnalysisResults({ results }) {
  const [expandedFlags, setExpandedFlags] = useState(false);

  if (!results) return null; // Nothing to show yet

  const getRiskLevel = (flagsCount) => {
    if (flagsCount === 0) return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-500/10', icon: CheckCircle2 };
    if (flagsCount <= 3) return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: AlertCircle };
    return { level: 'High', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: XCircle };
  };

  const riskInfo = getRiskLevel(results.flags?.length || 0);
  const RiskIcon = riskInfo.icon;

  return (
    <div className="analysis-container">
      {/* Glass Card Container */}
      <div className="glass-card">
        {/* Header */}
        <div className="header">
          <div className="icon-container">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h4 className="title">Analysis Results</h4>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          {/* Document Info Card */}
          <div className="summary-card">
            <div className="card-header">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="card-label">Document</span>
            </div>
            <div className="card-content">
              <p className="card-value">{results.doc_id}</p>
            </div>
          </div>

          {/* Clauses Count Card */}
          <div className="summary-card">
            <div className="card-header">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="card-label">Analysis</span>
            </div>
            <div className="card-content">
              <p className="card-value">{results.num_clauses}</p>
              <p className="card-subtitle">Total Clauses</p>
            </div>
          </div>

          {/* Risk Level Card */}
          <div className={`summary-card risk-card ${riskInfo.level.toLowerCase()}`}>
            <div className="card-header">
              <RiskIcon className={`w-5 h-5 ${riskInfo.color}`} />
              <span className="card-label">Risk Level</span>
            </div>
            <div className="card-content">
              <p className={`card-value ${riskInfo.color}`}>{riskInfo.level}</p>
              <p className="card-subtitle">
                {results.flags?.length || 0} flag{(results.flags?.length || 0) !== 1 ? 's' : ''} detected
              </p>
            </div>
          </div>
        </div>

        {/* Risk Flags Section */}
        {results.flags && results.flags.length > 0 && (
          <div className="flags-section">
            <div className="flags-header">
              <div className="flags-title">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h5 className="section-title">Risk Flags</h5>
                <span className="flags-badge">{results.flags.length}</span>
              </div>
              {results.flags.length > 3 && (
                <button
                  onClick={() => setExpandedFlags(!expandedFlags)}
                  className="expand-button"
                >
                  <Eye className="w-4 h-4" />
                  {expandedFlags ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>

            <div className="flags-list">
              {(expandedFlags ? results.flags : results.flags.slice(0, 3)).map((flag, i) => (
                <div key={i} className="flag-item">
                  <div className="flag-content">
                    <div className="flag-header">
                      <span className="flag-clause-id">{flag.clause_id}</span>
                      <span className="flag-tag">{flag.tag}</span>
                    </div>
                    {flag.description && (
                      <p className="flag-description">{flag.description}</p>
                    )}
                  </div>
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                </div>
              ))}
            </div>

            {!expandedFlags && results.flags.length > 3 && (
              <div className="flags-more">
                <span className="more-text">
                  {results.flags.length - 3} more flag{results.flags.length - 3 !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
          </div>
        )}

        {/* No Flags Message */}
        {(!results.flags || results.flags.length === 0) && (
          <div className="no-flags-section">
            <div className="no-flags-content">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <h5 className="no-flags-title">No Risk Flags Detected</h5>
                <p className="no-flags-text">
                  This contract appears to have standard terms with no immediate red flags.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {results.report && (
          <div className="actions-section">
            <a
              href={results.report}
              target="_blank"
              rel="noreferrer"
              className="primary-button"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open Detailed Report</span>
            </a>
            
            <button 
              onClick={() => window.print()}
              className="secondary-button"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .analysis-container {
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
          
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 
            0 24px 48px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            var(--glass-border) 20%, 
            var(--glass-border) 80%, 
            transparent
          );
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
        }

        .icon-container {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 16px -4px var(--shadow-primary);
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.025em;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .summary-card {
          background: var(--glass-subtle);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary-cyan);
          box-shadow: 0 12px 24px -6px var(--shadow-primary);
        }

        .summary-card.risk-card.high {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .summary-card.risk-card.medium {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.05);
        }

        .summary-card.risk-card.low {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.05);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .card-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
        }

        .card-content {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .card-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 0;
        }

        .card-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
          white-space: nowrap;
        }

        .flags-section {
          margin-bottom: 40px;
        }

        .flags-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .flags-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .flags-badge {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 8px;
          min-width: 20px;
          text-align: center;
        }

        .expand-button {
          background: none;
          border: none;
          color: var(--primary-cyan);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .expand-button:hover {
          background: var(--glass-subtle);
          color: var(--text-primary);
        }

        .flags-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .flag-item {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .flag-item:hover {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.08);
          transform: translateY(-1px);
        }

        .flag-content {
          flex: 1;
        }

        .flag-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .flag-clause-id {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .flag-tag {
          color: #ef4444;
          font-size: 14px;
          font-weight: 600;
        }

        .flag-description {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }

        .flags-more {
          text-align: center;
          margin-top: 16px;
        }

        .more-text {
          color: var(--text-muted);
          font-size: 14px;
        }

        .no-flags-section {
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .no-flags-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .no-flags-title {
          color: #22c55e;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .no-flags-text {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }

        .actions-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .actions-section {
            flex-direction: row;
          }
        }

        .primary-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 24px;
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 16px -4px var(--shadow-primary);
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px -8px var(--shadow-primary);
        }

        .secondary-button {
          background: var(--glass-subtle);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 16px 24px;
          border-radius: 16px;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .secondary-button:hover {
          background: var(--glass-border);
          border-color: var(--primary-cyan);
          transform: translateY(-1px);
        }

        .hidden {
          display: none;
        }

        @media (min-width: 640px) {
          .hidden.sm\\:inline {
            display: inline;
          }
        }

        @media (max-width: 768px) {
          .analysis-container {
            max-width: 100%;
            padding: 0 16px;
          }
          
          .glass-card {
            padding: 32px 24px;
            border-radius: 20px;
          }
          
          .summary-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .card-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .card-value {
            font-size: 16px;
          }
          
          .title {
            font-size: 20px;
          }
          
          .icon-container {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}