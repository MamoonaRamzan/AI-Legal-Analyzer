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
    <div className="relative overflow-hidden" style={{
      background: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 p-0.5">
        <div className="w-full h-full rounded-2xl" style={{ background: 'var(--bg-card)' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Analysis Results
          </h4>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Document Info Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Document</span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {results.doc_id}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Contract ID</p>
          </div>

          {/* Clauses Count Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Analysis</span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {results.num_clauses}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Clauses</p>
          </div>

          {/* Risk Level Card */}
          <div className={`p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/50 hover:border-opacity-100 transition-all duration-300 ${riskInfo.bgColor}`}>
            <div className="flex items-center gap-3 mb-3">
              <RiskIcon className={`w-5 h-5 ${riskInfo.color}`} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Risk Level</span>
            </div>
            <p className={`text-2xl font-bold mb-1 ${riskInfo.color}`}>
              {riskInfo.level}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {results.flags?.length || 0} flag{(results.flags?.length || 0) !== 1 ? 's' : ''} detected
            </p>
          </div>
        </div>

        {/* Risk Flags Section */}
        {results.flags && results.flags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h5 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Risk Flags
                </h5>
                <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 font-medium">
                  {results.flags.length}
                </span>
              </div>
              {results.flags.length > 3 && (
                <button
                  onClick={() => setExpandedFlags(!expandedFlags)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  {expandedFlags ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {(expandedFlags ? results.flags : results.flags.slice(0, 3)).map((flag, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 via-orange-500/5 to-yellow-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300 font-mono">
                          {flag.clause_id}
                        </span>
                        <span className="text-sm font-medium text-red-400">
                          {flag.tag}
                        </span>
                      </div>
                      {flag.description && (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {flag.description}
                        </p>
                      )}
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>

            {!expandedFlags && results.flags.length > 3 && (
              <div className="mt-3 text-center">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {results.flags.length - 3} more flag{results.flags.length - 3 !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
          </div>
        )}

        {/* No Flags Message */}
        {(!results.flags || results.flags.length === 0) && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <h5 className="font-semibold text-green-400 mb-1">No Risk Flags Detected</h5>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  This contract appears to have standard terms with no immediate red flags.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {results.report && (
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={results.report}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open Detailed Report</span>
            </a>
            
            <button 
              onClick={() => window.print()}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS Variables */}
      <style jsx>{`
        :root {
          /* Primary Brand */
          --brand-cyan: #06b6d4;
          --brand-blue: #3b82f6;
          --brand-indigo: #6366f1;
          
          /* Backgrounds */
          --bg-primary: #020617;  /* slate-950 */
          --bg-secondary: #0f172a; /* slate-900 */
          --bg-card: #1e293b;     /* slate-800 */
          
          /* Text */
          --text-primary: #ffffff;
          --text-secondary: #cbd5e1; /* slate-300 */
          --text-muted: #94a3b8;    /* slate-400 */
          
          /* Borders */
          --border-primary: #334155; /* slate-700 */
          --border-accent: #06b6d4;  /* cyan-500 */
        }
      `}</style>
    </div>
  );
}