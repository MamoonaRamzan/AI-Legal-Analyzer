import { useState } from "react";

export default function UploadBox({ API_BASE, onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload the file
      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw uploadData;

      const filename = uploadData.filename || uploadData.doc_id;
      if (!filename) throw new Error("No filename returned");

      // Step 2: Analyze the uploaded file
      const analyzeRes = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw analyzeData;

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
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h4 className="text-xl font-semibold mb-4">Upload a Contract</h4>
      <form onSubmit={handleUpload} className="flex gap-3 items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}
