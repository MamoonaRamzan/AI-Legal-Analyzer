import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/features";
import UploadBox from "../components/Demo/UploadBox";
import ChatBox from "../components/Demo/ChatBox";
import AnalysisResults from "../components/Demo/AnalysisResults";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";

export default function Home() {
  const [docId, setDocId] = useState("");
  const [results, setResults] = useState(null);

  function handleAnalyzed({ docId, results }) {
    setDocId(docId);
    setResults(results);
  }

  return (
    <div className="bg-gray-950 text-gray-100">
      <Navbar />
      <main>
        <Hero />
        
        <section id="howitworks">
          <HowItWorks />
        </section>
        
        <section id="features">
          <Features />
        </section>

        <section id="demo" className="py-20 bg-gray-900 px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <UploadBox API_BASE={API_BASE} onAnalyzed={handleAnalyzed} />
            <AnalysisResults results={results} />
            <ChatBox API_BASE={API_BASE} docId={docId} />
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}