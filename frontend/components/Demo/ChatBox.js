import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ChatBox({ API_BASE, docId }) {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleQuery(e) {
    e.preventDefault();
    if (!docId) return alert("Analyze a document first");
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, query, top_k: 4 }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: query },
        { role: "ai", text: data.answer, evidence: data.evidence }
      ]);
      setQuery("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h4 className="text-xl font-semibold mb-4">Ask Questions</h4>
      <form onSubmit={handleQuery} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What indemnity obligations exist?"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" disabled={loading || !docId} className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin inline" /> : "Ask"}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`p-4 rounded-lg max-w-xl ${msg.role === "user" ? "bg-indigo-600 ml-auto" : "bg-gray-700"}`}>
            <p className="whitespace-pre-wrap">{msg.text}</p>
            {msg.role === "ai" && msg.evidence && (
              <div className="mt-3 text-sm text-gray-400">
                <h5 className="font-semibold mb-1">Evidence:</h5>
                <ul className="space-y-2">
                  {msg.evidence.map((h, j) => (
                    <li key={j} className="bg-gray-600 p-2 rounded">
                      <strong>{h.clause_id}</strong>: {h.text?.slice(0, 150)}...
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
