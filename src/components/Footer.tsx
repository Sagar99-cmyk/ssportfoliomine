import React, { useState } from 'react';
import { ArrowUp, Mail, Send, CheckCircle2, Github, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { Profile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  profile?: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

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

  return (
    <footer className={`relative py-14 overflow-hidden select-none border-t transition-colors ${
      isLight
        ? 'bg-white/95 border-stone-200 text-stone-700 backdrop-blur-xl'
        : 'bg-[#07090e]/95 border-white/[0.08] text-stone-300 backdrop-blur-xl'
    }`}>
      {/* Subtle ambient ruby glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-20 pointer-events-none opacity-20 blur-3xl bg-rose-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Top Split: Newsletter & Brand */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-8 border-b ${
          isLight ? 'border-stone-200' : 'border-white/[0.06]'
        }`}>
          
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center font-mono font-bold text-xs text-white shadow-sm">
                SS
              </div>
              <span className={`font-bold text-base tracking-tight ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}>
                Sagar Singh
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isLight
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                Portfolio & Analytics
              </span>
            </div>
            <p className={`text-xs max-w-md ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              Data Analyst & Web Developer specializing in Power BI, SQL, Python, and full-stack analytics dashboards.
            </p>
          </div>

          {/* Newsletter Subscribe Form */}
          <div className="md:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label className={`block text-xs font-mono font-semibold ${
                isLight ? 'text-stone-700' : 'text-stone-300'
              }`}>
                Stay Updated with Project Releases
              </label>
              {success ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Subscribed successfully! You will receive portfolio & project updates.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email..."
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-colors ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500'
                          : 'bg-white/[0.04] border-white/[0.1] text-white placeholder-stone-500 focus:outline-none focus:border-rose-500/50'
                      }`}
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
              {error && <p className="text-[11px] text-rose-500 font-mono">{error}</p>}
            </form>
          </div>

        </div>

        {/* Bottom Split: Links, Copyright & Back to Top */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isLight ? 'text-stone-600' : 'text-stone-400'
        }`}>
          
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Sagar Singh. All rights reserved.</span>
            <a
              href="https://github.com/Sagar99-cmyk"
              target="_blank"
              rel="noreferrer"
              className={`transition-colors ${isLight ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-white'}`}
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/sagarsingh2005"
              target="_blank"
              rel="noreferrer"
              className={`transition-colors ${isLight ? 'text-stone-600 hover:text-sky-600' : 'text-stone-400 hover:text-sky-400'}`}
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to Top"
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                isLight
                  ? 'border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800'
                  : 'border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] text-stone-300 hover:text-white'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5 text-rose-500 group-hover:-translate-y-0.5 transition-transform duration-200" />
              <span>Top</span>
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
};
