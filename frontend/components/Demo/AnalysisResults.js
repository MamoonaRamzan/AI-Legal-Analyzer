export default function AnalysisResults({ results }) {
  if (!results) return null; // Nothing to show yet

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h4 className="text-2xl font-semibold mb-4">📊 Analysis Results</h4>

      <p><strong>Doc ID:</strong> {results.doc_id}</p>
      <p><strong>Total Clauses:</strong> {results.num_clauses}</p>

      {results.flags && results.flags.length > 0 && (
        <div className="mt-4">
          <h5 className="font-semibold mb-2">⚠️ Risk Flags</h5>
          <div className="flex flex-wrap gap-2">
            {results.flags.map((f, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-red-600/70"
              >
                {f.clause_id}: {f.tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {results.report && (
        <a
            href={results.report}
            target="_blank"
            rel="noreferrer"
            className="block mt-3 text-indigo-400 hover:underline"
        >
        Open Detailed Report →
        </a>
        )}
    </div>
  );
}
