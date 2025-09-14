import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, FileText, MessageSquare, BarChart3 } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: FileText, text: "Upload Contracts" },
    { icon: Shield, text: "Detect Risk" },
    { icon: MessageSquare, text: "Chat with Docs" },
    { icon: BarChart3, text: "Generate Reports" }
  ];

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-cyan-300 font-medium mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Legal Technology</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            AI-Powered Legal
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-slate-200 bg-clip-text text-transparent">
            Clause Analyzer
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Upload contracts, detect risky clauses, chat with your documents, and generate instant reports with cutting-edge AI technology.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300 backdrop-blur-sm hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <feature.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#demo" 
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 overflow-hidden min-w-[180px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>Try Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </a>
          
          <a 
            href="#features" 
            className="group px-8 py-4 border-2 border-slate-600 hover:border-cyan-500/50 text-slate-300 hover:text-white font-semibold rounded-2xl hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm min-w-[180px]"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Learn More</span>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </a>
        </div>

        {/* Stats or Social Proof */}
        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Trusted by 10,000+ legal professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-sm">99.7% accuracy in clause detection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-cyan-300 rounded-full opacity-40 animate-ping"></div>
    </section>
  );
}