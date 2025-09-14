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

  const navItems = ["Home", "How It Works", "Features", "Demo", "Contact"];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl shadow-cyan-500/5' 
          : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Legal Analyzer
            </h1>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 text-slate-300">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                  className="relative group py-2 px-1 hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30">
              Try Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-6 py-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                    className="block py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg">
                  Try Free
                </button>
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