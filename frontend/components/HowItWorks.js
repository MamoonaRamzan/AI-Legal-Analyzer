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
      icon: Upload
    },
    { 
      title: "AI Analysis", 
      desc: "Our model extracts and evaluates clauses for risks.",
      icon: Brain
    },
    { 
      title: "Ask Questions", 
      desc: "Chat directly with your contract and get answers.",
      icon: MessageCircle
    },
    { 
      title: "Generate Reports", 
      desc: "Download detailed, structured risk reports instantly.",
      icon: FileOutput
    }
  ];

  return (
    <section 
      id="howitworks" 
      className="py-20 px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{
          background: 'rgba(37, 99, 235, 0.06)'
        }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{
          background: 'rgba(14, 165, 233, 0.06)'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium mb-6 backdrop-blur-sm border" style={{
            background: 'rgba(37, 99, 235, 0.1)',
            borderColor: 'rgba(37, 99, 235, 0.3)',
            color: '#0ea5e9'
          }}>
            <CheckCircle className="w-4 h-4" />
            <span>Simple Process</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            }}>
              How It Works
            </span>
          </h3>
          
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#e0e0e0' }}>
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
              <div className="relative backdrop-blur-sm p-8 rounded-2xl border transition-all duration-500 text-center h-full group-hover:transform group-hover:scale-105 shadow-lg" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(37, 99, 235, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}>
                
                {/* Step Number & Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl p-4 shadow-lg transition-all duration-300" style={{
                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)'
                  }}>
                    <step.icon className="w-full h-full text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg" style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                  }}>
                    {i + 1}
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-xl font-semibold mb-4 text-white group-hover:transition-colors duration-300"
                  onMouseEnter={(e) => e.target.style.color = '#0ea5e9'}
                  onMouseLeave={(e) => e.target.style.color = '#ffffff'}>
                  {step.title}
                </h4>
                <p className="leading-relaxed" style={{ color: '#e0e0e0' }}>
                  {step.desc}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(14, 165, 233, 0.05))'
                }}></div>
              </div>

              {/* Arrow Connector (except for last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6" style={{ color: 'rgba(14, 165, 233, 0.6)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Process Flow Line (Mobile) */}
        <div className="lg:hidden flex justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((_, i) => (
              <React.Fragment key={i}>
                <div className={`w-3 h-3 rounded-full transition-all duration-500`} style={{
                  background: visibleSteps.includes(i) 
                    ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' 
                    : '#a0a0a0'
                }}></div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-0.5" style={{ backgroundColor: '#a0a0a0' }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}