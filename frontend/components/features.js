import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, MessageSquareText, Download, Zap } from 'lucide-react';

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
      icon: Search
    },
    { 
      title: "Risk Detection", 
      desc: "AI highlights risky clauses such as indemnities and liabilities with intelligent severity scoring.",
      icon: AlertTriangle
    },
    { 
      title: "Interactive Q&A", 
      desc: "Ask questions directly to your document with contextual answers powered by natural language processing.",
      icon: MessageSquareText
    },
    { 
      title: "Export Reports", 
      desc: "Download structured reports for legal review and compliance in multiple formats including PDF and Word.",
      icon: Download
    }
  ];

  return (
    <section 
      id="features" 
      className="py-20 px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/6 w-96 h-96 rounded-full blur-3xl" style={{
          background: 'rgba(37, 99, 235, 0.06)'
        }}></div>
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 rounded-full blur-3xl" style={{
          background: 'rgba(14, 165, 233, 0.06)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, rgba(14, 165, 233, 0.04) 50%, rgba(30, 64, 175, 0.04) 100%)'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium mb-4 backdrop-blur-sm border" style={{
            background: 'rgba(37, 99, 235, 0.1)',
            borderColor: 'rgba(37, 99, 235, 0.3)',
            color: '#0ea5e9'
          }}>
            <Zap className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            }}>
              Key Features
            </span>
          </h3>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#e0e0e0' }}>
            Advanced AI capabilities designed to revolutionize your legal document analysis workflow
          </p>
        </div>

        {/* Features Grid - New Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              data-feature={i}
              className={`group relative transition-all duration-700 ${
                visibleFeatures.includes(i) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {/* Card */}
              <div className="relative backdrop-blur-sm p-6 rounded-2xl border transition-all duration-500 group-hover:transform group-hover:scale-[1.02] shadow-lg overflow-hidden h-full" style={{
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
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl p-2.5 shadow-lg transition-all duration-300" style={{
                      background: 'linear-gradient(135deg, #2563eb, #0ea5e9)'
                    }}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-xl font-bold mb-3 text-white group-hover:transition-colors duration-300"
                    onMouseEnter={(e) => e.target.style.color = '#0ea5e9'}
                    onMouseLeave={(e) => e.target.style.color = '#ffffff'}>
                    {feature.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed" style={{ color: '#e0e0e0' }}>
                    {feature.desc}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08))'
                }}></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)'
                }}></div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), transparent)'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}