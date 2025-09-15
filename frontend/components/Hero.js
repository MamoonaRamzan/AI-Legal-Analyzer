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
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        marginTop: '-80px',
        paddingTop: '80px'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{
          background: 'rgba(37, 99, 235, 0.08)'
        }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ 
          background: 'rgba(14, 165, 233, 0.08)',
          animationDelay: '1s' 
        }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl" style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(14, 165, 233, 0.05) 50%, rgba(30, 64, 175, 0.05) 100%)'
        }}></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium mb-8 backdrop-blur-sm border" style={{
          background: 'rgba(37, 99, 235, 0.1)',
          borderColor: 'rgba(37, 99, 235, 0.3)',
          color: '#0ea5e9'
        }}>
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Legal Technology</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="text-transparent bg-clip-text" style={{
            backgroundImage: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
          }}>
            AI-Powered Legal
          </span>
          <br />
          <span className="text-transparent bg-clip-text" style={{
            backgroundImage: 'linear-gradient(135deg, #e0e0e0, #ffffff)'
          }}>
            Clause Analyzer
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed" style={{ color: '#e0e0e0' }}>
          Upload contracts, detect risky clauses, chat with your documents, and generate instant reports with cutting-edge AI technology.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 hover:border-opacity-60"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#e0e0e0',
                animationDelay: `${index * 150}ms`
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(37, 99, 235, 0.4)';
                e.target.style.color = '#0ea5e9';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = '#e0e0e0';
              }}
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
            className="group relative px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl overflow-hidden min-w-[180px]"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #1e40af, #2563eb)';
              e.target.style.boxShadow = '0 25px 50px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #2563eb, #0ea5e9)';
              e.target.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.3)';
            }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)'
            }}></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>Try Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </a>
          
          <a 
            href="#features" 
            className="group px-8 py-4 border-2 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm min-w-[180px]"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#e0e0e0',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'rgba(37, 99, 235, 0.5)';
              e.target.style.color = '#ffffff';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#e0e0e0';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Learn More</span>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </a>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-10 w-6 h-6 rounded-full animate-bounce" style={{
        background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
        opacity: '0.6',
        boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
      }}></div>
      <div className="absolute bottom-32 right-10 w-4 h-4 rounded-full animate-bounce" style={{ 
        background: 'linear-gradient(135deg, #0ea5e9, #1e40af)',
        animationDelay: '1s',
        opacity: '0.7',
        boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
      }}></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 rounded-full animate-ping" style={{
        backgroundColor: '#0ea5e9',
        opacity: '0.8',
        boxShadow: '0 0 10px rgba(14, 165, 233, 0.6)'
      }}></div>
      <div className="absolute top-2/3 left-20 w-2 h-2 rounded-full animate-pulse" style={{
        backgroundColor: '#2563eb',
        opacity: '0.6',
        boxShadow: '0 0 8px rgba(37, 99, 235, 0.5)'
      }}></div>
    </section>
  );
}