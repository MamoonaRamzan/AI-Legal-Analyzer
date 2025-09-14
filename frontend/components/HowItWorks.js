export default function HowItWorks() {
  const steps = [
    { title: "Upload Document", desc: "Drag & drop or upload your contract in seconds." },
    { title: "AI Analysis", desc: "Our model extracts and evaluates clauses for risks." },
    { title: "Ask Questions", desc: "Chat directly with your contract and get answers." },
    { title: "Generate Reports", desc: "Download detailed, structured risk reports instantly." }
  ];

  return (
    <section id="howitworks" className="py-20 bg-gray-950 px-6">
      <h3 className="text-3xl font-semibold text-center mb-12">How It Works</h3>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
            <div className="text-indigo-400 text-4xl font-bold mb-4">{i + 1}</div>
            <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
            <p className="text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
