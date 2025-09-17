import React, { useState } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-16 px-6 pb-0 relative overflow-hidden"
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium mb-4 backdrop-blur-sm border" style={{
            background: 'rgba(37, 99, 235, 0.1)',
            borderColor: 'rgba(37, 99, 235, 0.3)',
            color: '#0ea5e9'
          }}>
            <MessageSquare className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            }}>
              Contact Us
            </span>
          </h3>
          
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#e0e0e0' }}>
            Ready to transform your legal workflow? Let's discuss how our AI can help your organization.
          </p>
        </div>

        {/* Contact Form - Centered */}
        <div className="max-w-md mx-auto">
          <div className="backdrop-blur-sm p-6 rounded-2xl border shadow-lg" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            {!isSubmitted ? (
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-300 text-white"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: focusedField === 'name' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'name' ? '0 0 20px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-300 text-white"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: focusedField === 'email' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'email' ? '0 0 20px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Tell us about your legal analysis needs..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-300 text-white resize-none"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: focusedField === 'message' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: focusedField === 'message' ? '0 0 20px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="group relative w-full px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg overflow-hidden"
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
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)'
                  }}></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </span>
                </button>
              </div>
            ) : (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)'
                }}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                <p style={{ color: '#e0e0e0' }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}