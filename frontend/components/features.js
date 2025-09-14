import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, MessageSquareText, Download, Sparkles, Zap } from 'lucide-react';

export default function Features() {
  const [visibleFeatures, setVisibleFeatures] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureIndex = parseInt(entry.target.dataset.feature);
            setVisibleFeatures(prev => [...new Set([...prev, featureIndex])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const featureElements = document.querySelectorAll('[data-feature]');
    featureElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    { 
      title: "Clause Extraction", 
      desc: "Automatically detect and extract clauses from contracts with 99.7% accuracy using advanced AI algorithms.",
      icon: Search,
      gradient: "from-cyan-400 to-cyan-600",
      bgGradient: "from-cyan-500/10 to-cyan-600/5"
    },
    { 
      title: "Risk Flags", 
      desc: "AI highlights risky clauses such as indemnities and liabilities with intelligent severity scoring.",
      icon: AlertTriangle,
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/5"
    },
    { 
      title: "Interactive Q&A", 
      desc: "Ask questions directly to your document with contextual answers powered by natural language processing.",
      icon: MessageSquareText,
      gradient: "from-blue-400 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-600/5"
    },
    { 
      title: "Export Reports", 
      desc: "Download structured reports for legal review and compliance in multiple formats including PDF and Word.",
      icon: Download,
      gradient: "from-emerald-400 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/5"
    }
  ];

  return (
    <section 
      id="features" 
      className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/6 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/3 via-blue-500/3 to-indigo-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-cyan-300 font-medium mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Key Features
            </span>
          </h3>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Advanced AI capabilities designed to revolutionize your legal document analysis workflow
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, i) => (
            <div
              key={i}
              data-feature={i}
              className={`group relative transition-all duration-700 ${
                visibleFeatures.includes(i) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Card */}
              <div className={`relative bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-500 h-full group-hover:transform group-hover:scale-[1.02] shadow-lg hover:shadow-cyan-500/10 overflow-hidden`}>
                
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 shadow-lg group-hover:shadow-cyan-400/25 transition-all duration-300`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {feature.title}
                      </h4>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
              99.7%
            </div>
            <p className="text-slate-400 text-sm">Accuracy Rate</p>
          </div>
          <div className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
              &lt;30s
            </div>
            <p className="text-slate-400 text-sm">Processing Time</p>
          </div>
          <div className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <p className="text-slate-400 text-sm">Clause Types</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 px-8 py-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl">
            <div className="flex items-center space-x-2 text-slate-300">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Ready to experience these powerful features?</span>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30 min-w-[140px]">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}