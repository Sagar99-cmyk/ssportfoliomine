import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Linkedin, Github } from 'lucide-react';
import { Profile } from '../types';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
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
      await api.sendMessage(formData);
      setSuccessMsg('Thank you! Your message has been transmitted successfully. Sagar will review and respond shortly.');
      setFormData({ name: '', email: '', subject: '', company: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to transmit message. Please check network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`py-20 border-t relative ${
      isLight ? 'border-stone-200' : 'border-white/[0.08]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-2 text-left max-w-2xl">
          <span className={`text-xs font-semibold uppercase tracking-widest font-mono ${
            isLight ? 'text-rose-600' : 'text-rose-400'
          }`}>
            Direct Line & Inquiries
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-stone-900' : 'text-white'
          }`}>
            Let's Connect & Collaborate
          </h2>
          <p className={`text-sm sm:text-base ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            Interested in discussing an entry-level role in IT Support, Prompt Engineering, Web Development, or Data Management? Feel free to reach out directly below.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className={`p-8 rounded-2xl backdrop-blur-xl border space-y-6 ${
              isLight
                ? 'bg-white/95 border-stone-200 text-stone-900 shadow-md'
                : 'bg-stone-900/35 border-white/[0.08] shadow-2xl'
            }`}>
              <h3 className={`text-xl font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Email (Clickable to Mailto & Direct Gmail Web) */}
                <div className="space-y-1.5">
                  <a
                    href={`mailto:${profile.email}`}
                    title="Send Email (Opens Mail app on Phone/Laptop)"
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all group ${
                      isLight
                        ? 'bg-stone-50 hover:bg-rose-50/60 border-stone-200 hover:border-rose-300 text-stone-800'
                        : 'bg-stone-900/40 hover:bg-rose-500/10 border-white/[0.06] hover:border-rose-500/30 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs truncate">{profile.email}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded shrink-0 ${
                      isLight ? 'bg-rose-100 text-rose-700' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      Email
                    </span>
                  </a>

                  {/* Quick Direct Web Gmail Redirect Link */}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent('Inquiry - Sagar Singh Data Analytics Portfolio')}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`block text-right pr-2 text-[10px] font-mono transition-colors ${
                      isLight ? 'text-stone-600 hover:text-rose-600' : 'text-stone-400 hover:text-amber-400'
                    }`}
                  >
                    ↗ Open in Web Gmail
                  </a>
                </div>

                {/* Phone & WhatsApp Interactive Dual Card */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-transparent border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                      isLight ? 'text-stone-600' : 'text-stone-400'
                    }`}>
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Phone & WhatsApp Line</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isLight
                        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                        : 'bg-transparent text-emerald-400 border-emerald-500/30'
                    }`}>
                      Direct Contact
                    </span>
                  </div>

                  <div className={`text-sm font-mono font-bold tracking-wide ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}>
                    {profile.phone}
                  </div>

                  {/* Dual Action Buttons: Direct Phone Call & Instant WhatsApp Chat (Transparent in Dark Mode) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* 1. Phone Call Action */}
                    <a
                      href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                      title="Direct Phone Call"
                      className={`px-3 py-2 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                        isLight
                          ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                          : 'bg-transparent hover:bg-white/[0.08] border-white/20 hover:border-emerald-400/50 text-stone-200 hover:text-white backdrop-blur-xs'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Phone Call</span>
                    </a>

                    {/* 2. WhatsApp Direct Chat Action */}
                    <a
                      href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Sagar, I reviewed your Data Analytics portfolio and would like to connect regarding an opportunity!')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instant WhatsApp Message"
                      className={`px-3 py-2 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                        isLight
                          ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-transparent hover:bg-white/[0.08] border-white/20 hover:border-[#25D366]/50 text-stone-200 hover:text-[#25D366] backdrop-blur-xs'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.884 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Location (Clickable to Google Maps) */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Google Maps"
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors group ${
                    isLight
                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                      : 'bg-stone-900/40 hover:bg-stone-800/60 border-white/[0.06] text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs truncate">{profile.location}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded shrink-0 ${
                    isLight ? 'bg-stone-200 text-stone-700' : 'bg-stone-800 text-stone-400'
                  }`}>
                    Maps
                  </span>
                </a>
              </div>

              <div className={`pt-4 border-t space-y-3 ${
                isLight ? 'border-stone-200' : 'border-white/[0.06]'
              }`}>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
                  isLight ? 'text-stone-600' : 'text-stone-400'
                }`}>
                  Professional Networks
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isLight
                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                        : 'bg-stone-900/40 hover:bg-stone-800/60 border-white/[0.06] text-stone-200'
                    }`}
                  >
                    <Linkedin className="w-4 h-4 text-rose-500" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isLight
                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                        : 'bg-stone-900/40 hover:bg-stone-800/60 border-white/[0.06] text-stone-200'
                    }`}
                  >
                    <Github className={`w-4 h-4 ${isLight ? 'text-stone-800' : 'text-rose-400'}`} />
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
              className={`p-8 rounded-2xl backdrop-blur-xl border space-y-6 ${
                isLight
                  ? 'bg-white/95 border-stone-200 text-stone-900 shadow-md'
                  : 'bg-stone-900/35 border-white/[0.08] shadow-2xl'
              }`}
            >
              <h3 className={`text-xl font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Send a Direct Message
              </h3>

              {/* Status Banners */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold font-mono ${
                    isLight ? 'text-stone-700' : 'text-stone-300'
                  }`}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'bg-stone-900/40 border-white/[0.08] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold font-mono ${
                    isLight ? 'text-stone-700' : 'text-stone-300'
                  }`}>
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@company.com"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'bg-stone-900/40 border-white/[0.08] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold font-mono ${
                    isLight ? 'text-stone-700' : 'text-stone-300'
                  }`}>
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Senior Data Analyst Role Inquiry"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'bg-stone-900/40 border-white/[0.08] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold font-mono ${
                    isLight ? 'text-stone-700' : 'text-stone-300'
                  }`}>
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. TechGrowth Systems"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'bg-stone-900/40 border-white/[0.08] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-semibold font-mono ${
                  isLight ? 'text-stone-700' : 'text-stone-300'
                }`}>
                  Message Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project, role, or inquiry..."
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                      : 'bg-stone-900/40 border-white/[0.08] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30'
                  }`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
