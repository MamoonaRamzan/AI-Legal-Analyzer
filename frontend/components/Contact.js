import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';

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
      // Reset after 3 seconds for demo
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@legalanalyzer.ai",
      description: "Get in touch for product demos"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Monday - Friday, 9AM - 6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "San Francisco, CA",
      description: "Schedule an in-person meeting"
    }
  ];

  return (
    <section 
      id="contact" 
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
            <MessageSquare className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h3>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Ready to transform your legal workflow? Let's discuss how our AI can help your organization.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="relative">
            <div className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-xl">
              {!isSubmitted ? (
                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
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
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border transition-all duration-300 text-white placeholder-slate-400 ${
                        focusedField === 'name'
                          ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                          : 'border-slate-600/50 hover:border-slate-500/50'
                      }`}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
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
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border transition-all duration-300 text-white placeholder-slate-400 ${
                        focusedField === 'email'
                          ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                          : 'border-slate-600/50 hover:border-slate-500/50'
                      }`}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Tell us about your legal analysis needs..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border transition-all duration-300 text-white placeholder-slate-400 resize-none ${
                        focusedField === 'message'
                          ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                          : 'border-slate-600/50 hover:border-slate-500/50'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="group relative w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </span>
                  </button>
                </div>
              ) : (
                /* Success State */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-slate-300">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
              <h4 className="text-2xl font-bold text-white mb-6">Let's Connect</h4>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Whether you're looking for a demo, have questions about our AI capabilities, or want to discuss enterprise solutions, we're here to help.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index}
                    className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-700/30 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:shadow-cyan-400/25 transition-all duration-300">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {info.title}
                      </h5>
                      <p className="text-cyan-300 font-medium">{info.content}</p>
                      <p className="text-sm text-slate-400">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional CTA */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/20">
              <h5 className="text-lg font-semibold text-white mb-2">Need Immediate Assistance?</h5>
              <p className="text-slate-300 mb-4">
                Book a 15-minute demo call to see our AI in action.
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}