export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-5xl font-extrabold mb-6">
        AI-Powered Legal Clause Analyzer
      </h2>
      <p className="text-lg text-gray-400 max-w-2xl mb-8">
        Upload contracts, detect risky clauses, chat with your documents, and generate instant reports.
      </p>
      <div className="flex gap-4">
        <a href="#demo" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Try Demo
        </a>
        <a href="#features" className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800">
          Learn More
        </a>
      </div>
    </section>
  );
}
