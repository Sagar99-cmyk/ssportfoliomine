import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Linkedin, Github } from 'lucide-react';
import { Profile } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await api.sendMessage(formData);
      setSuccessMsg('Thank you! Your message has been transmitted successfully. Sagar will review and respond shortly.');
      setFormData({ name: '', email: '', subject: '', company: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to transmit message. Please check network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-stone-200/80 dark:border-stone-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-2 text-left max-w-2xl">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest font-mono">
            Direct Line & Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Let's Connect & Collaborate
          </h2>
          <p className="text-sm sm:text-base text-stone-400">
            Interested in discussing an entry-level role in IT Support, Prompt Engineering, Web Development, or Data Management? Feel free to reach out directly below.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl glass-card border border-stone-200/80 dark:border-stone-800/80 space-y-6">
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Email (Clickable to Mailto & Direct Gmail Web) */}
                <div className="space-y-1.5">
                  <a
                    href={`mailto:${profile.email}`}
                    title="Send Email (Opens Mail app on Phone/Laptop)"
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 hover:bg-rose-500/10 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all text-stone-800 dark:text-stone-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs truncate">{profile.email}</span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-500/10 shrink-0">
                      Email
                    </span>
                  </a>

                  {/* Quick Direct Web Gmail Redirect Link */}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent('Inquiry - Sagar Singh Data Analytics Portfolio')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-right pr-2 text-[10px] font-mono text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    ↗ Open in Web Gmail
                  </a>
                </div>

                {/* Phone Contact (Clickable to Dial on Phone/App) */}
                <a
                  href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                  title="Click to Call Sagar Singh directly"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30 border border-transparent hover:border-emerald-500/30 transition-all text-stone-800 dark:text-stone-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs truncate">{profile.phone}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 shrink-0">
                    Call / WhatsApp
                  </span>
                </a>

                {/* Location (Clickable to Google Maps) */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Google Maps"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors text-stone-800 dark:text-stone-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs truncate">{profile.location}</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 font-semibold px-2 py-0.5 rounded bg-stone-800 shrink-0">
                    Maps
                  </span>
                </a>
              </div>

              <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/60 space-y-3">
                <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider block">
                  Professional Networks
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-rose-900 dark:text-rose-400" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Github className="w-4 h-4 text-rose-900 dark:text-rose-400" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl glass-card border border-stone-200/80 dark:border-stone-800/80 space-y-6"
            >
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Send a Direct Message
              </h3>

              {/* Status Banners */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@company.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Senior Data Analyst Role Inquiry"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. TechGrowth Systems"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project, role, or inquiry..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white dark:bg-rose-600 dark:hover:bg-rose-700 font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitting Message...' : 'Transmit Message'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
