import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle, X } from "lucide-react";

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
    <div className="upload-container">
      {/* Glass Card Container */}
      <div className="glass-card">
        {/* Header */}
        <div className="header">
          <div className="icon-container">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="title">Contract Analysis</h4>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          {/* Drop Zone */}
          <div
            className={`drop-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="drop-content">
              {!file ? (
                <>
                  <div className="upload-icon">
                    <Upload className="w-8 h-8" />
                  </div>
                  
                  <div className="upload-text">
                    <p className="primary-text">Drop your contract here</p>
                    <p className="secondary-text">or click to browse files</p>
                  </div>
                  
                  <label className="upload-button">
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </>
              ) : (
                <div className="file-selected">
                  <div className="success-indicator">
                    <CheckCircle className="w-5 h-5" />
                    <span>File Selected</span>
                  </div>
                  
                  <div className="file-info">
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="remove-file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="progress-section">
              <div className="progress-info">
                <span>Processing contract...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`action-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Analyze Contract</span>
              </>
            )}
          </button>

          {/* File Info */}
          <div className="file-format-info">
            <p>Supports PDF, DOC, DOCX, TXT • Max 10MB</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .upload-container {
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

        .upload-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .drop-zone {
          border: 2px dashed var(--glass-border);
          border-radius: 20px;
          padding: 50px 50px;
          background: var(--glass-subtle);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .drop-zone:hover {
          border-color: var(--primary-cyan);
          background: var(--glass-blue);
          transform: translateY(-2px);
          box-shadow: 0 16px 32px -8px var(--shadow-primary);
        }

        .drop-zone.active {
          border-color: var(--primary-blue);
          background: var(--glass-blue);
          transform: scale(1.02);
          box-shadow: 
            0 20px 40px -8px var(--shadow-primary),
            0 0 0 1px var(--primary-blue);
        }

        .drop-zone.has-file {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
        }

        .upload-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 12px 24px -6px var(--shadow-primary);
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .primary-text {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0;
        }

        .secondary-text {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }

        .upload-button {
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 16px -4px var(--shadow-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .upload-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -4px var(--shadow-primary);
        }

        .file-selected {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .success-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #10b981;
          font-weight: 500;
          justify-content: center;
        }

        .file-info {
          background: var(--glass-subtle);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }

        .remove-file {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
          margin-left: 12px;
          flex-shrink: 0;
        }

        .remove-file:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .progress-bar {
          height: 8px;
          background: var(--glass-subtle);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-cyan));
          border-radius: 3px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 8px var(--shadow-primary);
        }

        .action-button {
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
          color: white;
          border: none;
          border-radius: 16px;
          padding: 16px 32px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 12px 24px -6px var(--shadow-primary);
          position: relative;
          overflow: hidden;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -8px var(--shadow-primary);
        }

        .action-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-button.loading {
          color: rgba(255, 255, 255, 0.8);
        }

        .file-format-info {
          text-align: center;
        }

        .file-format-info p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
          opacity: 0.8;
        }

        .hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 640px) {
          .upload-container {
            max-width: 100%;
            padding: 0 16px;
          }
          
          .glass-card {
            padding: 32px 24px;
            border-radius: 20px;
          }
          
          .drop-zone {
            padding: 40px 24px;
          }
          
          .upload-icon {
            width: 72px;
            height: 72px;
          }
          
          .primary-text {
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