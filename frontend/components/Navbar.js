import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "How It Works", href: "#howitworks" },
    { name: "Features", href: "#features" },
    { name: "Contract Analysis", href: "#demo" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'backdrop-blur-xl border-b shadow-xl shadow-blue-600/10' 
          : 'backdrop-blur-md border-b border-white/10'
      }`} style={{
        backgroundColor: isScrolled ? 'rgba(26, 26, 46, 0.95)' : 'rgba(10, 10, 15, 0.8)',
        borderBottomColor: isScrolled ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)'
      }}>
        <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg blur-sm" style={{
                background: 'linear-gradient(45deg, rgba(37, 99, 235, 0.4), rgba(14, 165, 233, 0.4))'
              }}></div>
              <div className="relative p-2 rounded-lg shadow-lg" style={{
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)'
              }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            }}>
              Legal Analyzer
            </h1>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8" style={{ color: '#e0e0e0' }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="relative group py-2 px-1 hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full" style={{
                    background: 'linear-gradient(90deg, #2563eb, #0ea5e9)'
                  }}></div>
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="#demo"
              className="inline-block px-6 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1e40af, #2563eb)';
                e.target.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2563eb, #0ea5e9)';
                e.target.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
              }}
            >
              <span className="relative z-10">Try Free</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)'
              }}></div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-all duration-200"
            style={{ 
              color: '#e0e0e0',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ffffff';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#e0e0e0';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="backdrop-blur-xl border-t px-6 py-4" style={{
            backgroundColor: 'rgba(42, 42, 64, 0.95)',
            borderTopColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="block py-3 px-4 rounded-lg transition-all duration-200"
                    style={{ color: '#e0e0e0' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ffffff';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#e0e0e0';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a 
                  href="#demo"
                  className="block w-full py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #1e40af, #2563eb)';
                    e.target.style.boxShadow = '0 12px 25px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #2563eb, #0ea5e9)';
                    e.target.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  Try Free
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
}