import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [docId, setDocId] = useState("");
  const [flags, setFlags] = useState([]);
  const [numClauses, setNumClauses] = useState(null);
  const [reportUrl, setReportUrl] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
  e.preventDefault();
  if (!file) { alert("Choose a file first"); return; }
  setStatus("Uploading...");
  const fd = new FormData();
  fd.append("file", file);

  try {
    console.log("Making request to:", `${API_BASE}/upload`);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: fd
    });

    console.log("Response status:", res.status, res.ok);
    
    const data = await res.json();
    console.log("Response data:", data);
    
    if (!res.ok) throw data;

    const filename = data.filename || data.doc_id || null;
    const message = data.message || "File uploaded successfully";

    setStatus(`Uploaded: ${message}`);
    console.log("About to call analyzeDocument with filename:", filename);
    
    if (filename) {
      await analyzeDocument(filename); // ← This might be throwing
    }

  } catch (err) {
    console.error("Full error object:", err);
    console.error("Error stack:", err.stack);
    setStatus("Upload failed: " + (err?.error || err?.message || JSON.stringify(err)));
  }
}


  async function analyzeDocument(filename) {
    setLoading(true);
    setStatus("Analyzing...");
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setDocId(data.doc_id || filename);
      setFlags(data.flags || []);
      setNumClauses(data.num_clauses || 0);
      // report endpoint:
      setReportUrl(`${API_BASE}/report/${encodeURIComponent(filename)}`);
      setStatus("Analysis complete");
    } catch (err) {
      console.error(err);
      setStatus("Analyze failed: " + (err?.error || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  async function handleInitSample() {
    setLoading(true);
    setStatus("Initializing sample...");
    try {
      const res = await fetch(`${API_BASE}/init_sample`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw data;
      setDocId(data.doc_id);
      setFlags(data.flags || []);
      setNumClauses(data.num_clauses || 0);
      setReportUrl(`${API_BASE}/report/${encodeURIComponent(data.doc_id)}`);
      setStatus("Sample ready: " + data.doc_id);
    } catch (err) {
      console.error(err);
      setStatus("Init sample failed: " + (err?.error || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  async function handleQuery(e) {
    e.preventDefault();
    if (!docId) { alert("Analyze a document first (upload or init sample)."); return; }
    if (!query) { alert("Type a question."); return; }
    setLoading(true);
    setStatus("Querying...");
    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, query, top_k: 4 })
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setAnswer(data.answer);
      setEvidence(data.evidence || []);
      setStatus("Query complete");
    } catch (err) {
      console.error(err);
      setStatus("Query failed: " + (err?.error || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>AI Legal Analyzer — Demo</h1>

      <section className="card">
        <h2>1. Upload & Analyze</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button type="submit" disabled={loading}>Upload & Analyze</button>
          <button type="button" onClick={handleInitSample} disabled={loading} style={{marginLeft: 8}}>Init Sample</button>
        </form>
        <p><strong>Status:</strong> {status}</p>
        {docId && <p><strong>Doc ID:</strong> {docId}</p>}
        {numClauses !== null && <p><strong>Clauses:</strong> {numClauses}</p>}
        {flags && flags.length > 0 && (
          <>
            <h4>Risk Flags</h4>
            <ul>
              {flags.map((f, i) => <li key={i}>{f.clause_id} — {f.tag}</li>)}
            </ul>
          </>
        )}
        {reportUrl && <p><a href={reportUrl} target="_blank" rel="noreferrer">Open HTML report</a></p>}
      </section>

      <section className="card">
        <h2>2. Ask a Question</h2>
        <form onSubmit={handleQuery}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g., What indemnity obligations exist?"
            style={{width: "70%"}}
          />
          <button type="submit" disabled={loading || !docId} style={{marginLeft: 8}}>Ask</button>
        </form>

        {answer && (
          <div className="result">
            <h4>Answer</h4>
            <pre style={{whiteSpace: "pre-wrap"}}>{answer}</pre>
          </div>
        )}

        {evidence && evidence.length > 0 && (
          <div>
            <h4>Evidence (retrieved clauses)</h4>
            <ol>
              {evidence.map((h, i) => (
                <li key={i}><strong>{h.clause_id}</strong>: {h.text?.slice(0, 200)}{h.text?.length > 200 ? "..." : ""}</li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <footer style={{marginTop: 24}}>
        <small>Frontend calling: <code>{API_BASE}</code></small>
      </footer>
    </div>
  );
}
