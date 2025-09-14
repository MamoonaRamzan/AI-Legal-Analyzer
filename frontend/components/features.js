export default function Features() {
  const features = [
    { title: "Clause Extraction", desc: "Automatically detect and extract clauses from contracts." },
    { title: "Risk Flags", desc: "AI highlights risky clauses such as indemnities and liabilities." },
    { title: "Interactive Q&A", desc: "Ask questions directly to your document with contextual answers." },
    { title: "Export Reports", desc: "Download structured reports for legal review and compliance." }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900 px-6">
      <h3 className="text-3xl font-semibold text-center mb-12">Key Features</h3>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold mb-2 text-indigo-400">{f.title}</h4>
            <p className="text-gray-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
