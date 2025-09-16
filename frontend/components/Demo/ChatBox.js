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
    <>
      <style jsx>{`
        :root {
          /* Primary Colors */
          --electric-blue: #4a9eff;
          --cyan-glow: #00d4ff;
          --deep-ocean: #2d7dd2;
          
          /* Background Colors - matching your image */
          --main-bg: #3c4043;
          --card-bg: #3c4043;
          
          /* Text Colors */
          --pure-white: #ffffff;
          --light-gray: #e0e0e0;
          --medium-gray: #a0a0a0;
        }
        
        .chat-container {
          background: var(--main-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .glass-card {
          background: rgba(74, 158, 255, 0.15);
          border: 1px solid var(--electric-blue);
        }
        
        .gradient-primary {
          background: linear-gradient(135deg, var(--electric-blue) 0%, var(--cyan-glow) 100%);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--electric-blue) 0%, var(--cyan-glow) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .message-user {
          background: linear-gradient(135deg, var(--electric-blue) 0%, var(--cyan-glow) 100%);
          box-shadow: 0 8px 32px rgba(74, 158, 255, 0.3);
        }
        
        .message-ai {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .suggestion-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(74, 158, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .suggestion-button:hover {
          background: rgba(74, 158, 255, 0.15);
          border-color: var(--electric-blue);
          transform: translateY(-2px);
        }
        
        .input-field {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--electric-blue);
          box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.2);
        }
        
        .evidence-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glow-effect {
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
        }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--glass-subtle);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--electric-blue) 0%, var(--cyan-glow) 100%);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--electric-blue);
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse-glow {
          from { box-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
          to { box-shadow: 0 0 20px rgba(0, 212, 255, 0.8); }
        }
      `}</style>
      
      <div className="chat-container relative overflow-hidden h-full flex flex-col rounded-2xl" style={{
        padding: '0',
        minHeight: '600px'
      }}>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-4" style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="flex items-center gap-3">
              <div className="gradient-primary p-3 rounded-xl glow-effect">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-3xl font-bold gradient-text mb-1">
                  Contract Assistant
                </h4>
                <p className="text-sm" style={{ color: 'var(--medium-gray)' }}>
                  {docId ? `Ready to answer questions about ${docId}` : "Analyze a document first to start chatting"}
                </p>
              </div>
              {docId && (
                <div className="glass-card flex items-center gap-2 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-cyan-glow rounded-full pulse-glow"></div>
                  <span className="text-xs font-medium" style={{ color: 'var(--cyan-glow)' }}>Connected</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6" style={{ maxHeight: '400px' }}>
            {chatHistory.length === 0 && docId && (
              <div className="text-center py-12">
                <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-effect">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 gradient-text">
                  Ready to help!
                </h3>
                <p className="text-base mb-8" style={{ color: 'var(--medium-gray)' }}>
                  Ask me anything about your contract. Here are some suggestions:
                </p>
                <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
                  {suggestedQuestions.slice(0, 3).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(suggestion)}
                      className="suggestion-button text-left px-6 py-4 rounded-xl"
                    >
                      <span className="text-sm font-medium" style={{ color: 'var(--light-gray)' }}>
                        "{suggestion}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-effect">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
                  <div className={`p-5 rounded-2xl ${
                    msg.role === "user" 
                      ? "message-user text-white rounded-br-lg" 
                      : msg.isError
                      ? "message-error"
                      : "message-ai rounded-bl-lg"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-base" style={{ 
                      color: msg.role === "user" ? "white" : msg.isError ? "#ef4444" : "var(--light-gray)" 
                    }}>
                      {msg.text}
                    </p>
                    
                    {msg.role === "ai" && msg.evidence && msg.evidence.length > 0 && (
                      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <button
                          onClick={() => toggleEvidence(i)}
                          className="flex items-center gap-2 text-sm font-semibold hover:text-cyan-glow transition-colors mb-4"
                          style={{ color: 'var(--electric-blue)' }}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Evidence ({msg.evidence.length} sources)</span>
                          {expandedEvidence[i] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {expandedEvidence[i] && (
                          <div className="space-y-3">
                            {msg.evidence.map((evidence, j) => (
                              <div key={j} className="evidence-card p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="px-3 py-1 text-xs rounded-lg font-mono gradient-primary text-white">
                                    {evidence.clause_id}
                                  </span>
                                  <span className="text-xs font-medium" style={{ color: 'var(--medium-gray)' }}>
                                    Source {j + 1}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--light-gray)' }}>
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
                  
                  <div className="flex items-center gap-2 mt-2 px-3">
                    <span className="text-xs font-medium" style={{ color: 'var(--medium-gray)' }}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-effect">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-effect">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="message-ai p-5 rounded-2xl rounded-bl-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--electric-blue)' }} />
                    <span className="text-base font-medium" style={{ color: 'var(--light-gray)' }}>
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 pt-4" style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleQuery(e)}
                  placeholder={docId ? "Ask me anything about your contract..." : "Analyze a document first"}
                  disabled={!docId}
                  className="input-field w-full px-5 py-4 rounded-xl outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  style={{
                    color: 'var(--light-gray)'
                  }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-16 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      color: 'var(--medium-gray)',
                      background: 'var(--glass-subtle)'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={handleQuery}
                disabled={loading || !docId || !query.trim()}
                className="gradient-primary px-6 py-4 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 glow-effect text-white"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </div>
            
            {!docId && (
              <p className="text-sm mt-3 text-center font-medium" style={{ color: 'var(--medium-gray)' }}>
                Upload and analyze a contract to start asking questions
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}