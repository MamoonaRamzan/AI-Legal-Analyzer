import { useState, useEffect, useRef } from "react";
import { Loader2, MessageCircle, Send, User, Bot, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function ChatBox({ API_BASE, docId }) {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  async function handleQuery(e) {
    e.preventDefault();
    if (!docId) return alert("Analyze a document first");
    if (!query.trim()) return;
    
    const userQuery = query.trim();
    setQuery("");
    setLoading(true);
    
    // Add user message immediately
    setChatHistory((prev) => [
      ...prev,
      { role: "user", text: userQuery, timestamp: new Date() }
    ]);

    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, query: userQuery, top_k: 4 }),
      });
      const data = await res.json();
      
      setChatHistory((prev) => [
        ...prev,
        { 
          role: "ai", 
          text: data.answer, 
          evidence: data.evidence, 
          timestamp: new Date() 
        }
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { 
          role: "ai", 
          text: "Sorry, I encountered an error while processing your question. Please try again.", 
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const toggleEvidence = (messageIndex) => {
    setExpandedEvidence(prev => ({
      ...prev,
      [messageIndex]: !prev[messageIndex]
    }));
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    "What are the key termination clauses?",
    "Are there any liability limitations?",
    "What indemnity obligations exist?",
    "What are the payment terms?",
    "Are there any confidentiality requirements?"
  ];

  return (
    <div className="relative overflow-hidden h-full flex flex-col" style={{
      background: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '0',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      minHeight: '600px'
    }}>
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 p-0.5">
        <div className="w-full h-full rounded-2xl" style={{ background: 'var(--bg-card)' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Contract Assistant
              </h4>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {docId ? `Ready to answer questions about ${docId}` : "Analyze a document first to start chatting"}
              </p>
            </div>
            {docId && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '400px' }}>
          {chatHistory.length === 0 && docId && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-cyan-400 opacity-50" />
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Ready to help!
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Ask me anything about your contract. Here are some suggestions:
              </p>
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                {suggestedQuestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(suggestion)}
                    className="text-left px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-200 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" 
                    : msg.isError
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-slate-700/30 border border-slate-600/50"
                } ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}>
                  <p className="whitespace-pre-wrap leading-relaxed" style={{ 
                    color: msg.role === "user" ? "white" : msg.isError ? "#ef4444" : "var(--text-primary)" 
                  }}>
                    {msg.text}
                  </p>
                  
                  {msg.role === "ai" && msg.evidence && msg.evidence.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-600/30">
                      <button
                        onClick={() => toggleEvidence(i)}
                        className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors mb-3"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Evidence ({msg.evidence.length} sources)</span>
                        {expandedEvidence[i] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {expandedEvidence[i] && (
                        <div className="space-y-2">
                          {msg.evidence.map((evidence, j) => (
                            <div key={j} className="p-3 rounded-lg bg-slate-800/50 border border-slate-600/30">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                                  {evidence.clause_id}
                                </span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  Source {j + 1}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {evidence.text?.slice(0, 200)}
                                {evidence.text?.length > 200 && "..."}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2 px-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl rounded-bl-md bg-slate-700/30 border border-slate-600/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 pt-4 border-t border-slate-700/50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleQuery(e)}
                placeholder={docId ? "Ask me anything about your contract..." : "Analyze a document first"}
                disabled={!docId}
                className="w-full px-4 py-3 rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={handleQuery}
              disabled={loading || !docId || !query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {!docId && (
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
              Upload and analyze a contract to start asking questions
            </p>
          )}
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
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
      `}</style>
    </div>
  );
}