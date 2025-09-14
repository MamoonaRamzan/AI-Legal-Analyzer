import React, { useState, useEffect } from 'react';
import { Upload, Brain, MessageCircle, FileOutput, ArrowRight, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.dataset.step);
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    { 
      title: "Upload Document", 
      desc: "Drag & drop or upload your contract in seconds.",
      icon: Upload,
      color: "from-cyan-400 to-cyan-600"
    },
    { 
      title: "AI Analysis", 
      desc: "Our model extracts and evaluates clauses for risks.",
      icon: Brain,
      color: "from-blue-400 to-blue-600"
    },
    { 
      title: "Ask Questions", 
      desc: "Chat directly with your contract and get answers.",
      icon: MessageCircle,
      color: "from-indigo-400 to-indigo-600"
    },
    { 
      title: "Generate Reports", 
      desc: "Download detailed, structured risk reports instantly.",
      icon: FileOutput,
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <section 
      id="howitworks" 
      className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-cyan-300 font-medium mb-6 backdrop-blur-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Simple Process</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              How It Works
            </span>
          </h3>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Transform your legal workflow in four simple steps with our AI-powered analysis
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, i) => (
            <div
              key={i}
              data-step={i}
              className={`relative group transition-all duration-700 ${
                visibleSteps.includes(i) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {/* Card */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-500 text-center h-full group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-cyan-500/10">
                
                {/* Step Number & Icon */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${step.color} p-4 shadow-lg group-hover:shadow-cyan-400/25 transition-all duration-300`}>
                    <step.icon className="w-full h-full text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {i + 1}
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-xl font-semibold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {step.desc}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>

              {/* Arrow Connector (except for last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-cyan-400/60" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Process Flow Line (Mobile) */}
        <div className="lg:hidden flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((_, i) => (
              <React.Fragment key={i}>
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  visibleSteps.includes(i) 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500' 
                    : 'bg-slate-600'
                }`}></div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-slate-600"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
            <span className="text-slate-300">Ready to get started?</span>
            <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30">
              Try Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}