import React, { useState } from 'react';
import { ArrowUp, Mail, Send, CheckCircle2, Shield, Github, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { Profile } from '../types';

interface FooterProps {
  profile?: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.subscribe(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err?.message || 'Could not subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const adminUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://chimerical-entremet-dc12c3.netlify.app/';

  return (
    <footer className="relative py-14 overflow-hidden select-none border-t border-white/[0.08] bg-[#07090e]/95 backdrop-blur-xl text-stone-300">
      {/* Subtle ambient ruby glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-20 pointer-events-none opacity-20 blur-3xl bg-rose-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Top Split: Newsletter & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-8 border-b border-white/[0.06]">
          
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center font-mono font-bold text-xs text-white shadow-sm">
                SS
              </div>
              <span className="font-bold text-white text-base tracking-tight">Sagar Singh</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Portfolio & Analytics
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md">
              Data Analyst & Web Developer specializing in Power BI, SQL, Python, and full-stack analytics dashboards.
            </p>
          </div>

          {/* Newsletter Subscribe Form */}
          <div className="md:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-stone-300">
                Stay Updated with Project Releases
              </label>
              {success ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed successfully! You will receive portfolio & project updates.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email..."
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-xs font-mono font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Subscribing...' : 'Subscribe'}</span>
                  </button>
                </div>
              )}
              {error && <p className="text-[11px] text-rose-400 font-mono">{error}</p>}
            </form>
          </div>

        </div>

        {/* Bottom Split: Links, Copyright, Admin & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-400">
          
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Sagar Singh. All rights reserved.</span>
            <a
              href="https://github.com/Sagar99-cmyk"
              target="_blank"
              rel="noreferrer"
              className="text-stone-400 hover:text-white transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/sagarsingh2005"
              target="_blank"
              rel="noreferrer"
              className="text-stone-400 hover:text-sky-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/30 text-stone-300 hover:text-white transition-all cursor-pointer text-[11px]"
              title="Open Admin Command Center"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Portal</span>
            </a>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to Top"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-rose-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
              <span>Top</span>
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
};
