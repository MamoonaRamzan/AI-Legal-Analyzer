import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

export default function UploadBox({ API_BASE, onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload the file
      setUploadProgress(25);
      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw uploadData;

      const filename = uploadData.filename || uploadData.doc_id;
      if (!filename) throw new Error("No filename returned");

      setUploadProgress(50);

      // Step 2: Analyze the uploaded file
      const analyzeRes = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw analyzeData;

      setUploadProgress(100);

      // Pass results back to parent
      onAnalyzed({
        docId: analyzeData.doc_id || filename,
        results: {
          ...analyzeData,
          report: `${API_BASE}/report/${encodeURIComponent(filename)}`
        }
      });
    } catch (err) {
      console.error("Upload/Analyze failed:", err);
      alert("Error: " + (err.error || err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative overflow-hidden" style={{
      background: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10 pointer-events-none"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 p-0.5">
        <div className="w-full h-full rounded-2xl" style={{ background: 'var(--bg-card)' }}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Upload Contract
          </h4>
        </div>

        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
              dragActive
                ? 'border-cyan-400 bg-cyan-500/10 scale-105'
                : 'border-slate-600 hover:border-cyan-500/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ 
              borderColor: dragActive ? 'var(--border-accent)' : 'var(--border-primary)',
              background: dragActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent'
            }}
          >
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              
              {!file ? (
                <>
                  <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Drop your contract here
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    or click to browse files
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium cursor-pointer hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      File Selected
                    </span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 max-w-xs mx-auto">
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {file.name}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Choose different file
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95"
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Contract...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Analyze Contract</span>
                </>
              )}
            </div>
          </button>

          {/* File Format Info */}
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Supports PDF, DOC, DOCX, and TXT files • Maximum file size: 10MB
            </p>
          </div>
        </div>
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