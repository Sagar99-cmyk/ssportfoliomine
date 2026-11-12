import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundButton } from './BackgroundMusic';
import { DemoVideoModal } from './DemoVideoModal';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAdmin?: () => void;
  isAdminOpen?: boolean;
}

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background body scroll when mobile menu / sidebar drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? (theme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(9,9,11,0.96)')
          : (theme === 'light' ? 'rgba(255,255,255,0.80)' : 'rgba(9,9,11,0.90)'),
        backdropFilter: 'blur(24px)',
        borderBottom: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? (theme === 'light' ? '0 4px 20px rgba(0,0,0,0.06)' : '0 4px 30px rgba(0,0,0,0.5)') : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Brand: "Portfolio" */}
        <a
          href="#"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-white font-bold text-xs font-mono">SS</span>
          </motion.div>
          <span
            className="text-lg font-bold tracking-tight transition-colors"
            style={{ color: theme === 'light' ? '#0f172a' : '#f1f5f9' }}
          >
            Portfolio
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: theme === 'light' ? '#475569' : '#94a3b8' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = theme === 'light' ? '#0f172a' : '#f1f5f9';
                (e.currentTarget as HTMLAnchorElement).style.background = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = theme === 'light' ? '#475569' : '#94a3b8';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Demo Video Modal Trigger Button */}
          <button
            onClick={() => setIsDemoOpen(true)}
            title="Watch 3D Avatar & System Video Demo"
            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 border ${
              theme === 'light'
                ? 'border-rose-300/80 bg-rose-50/90 hover:bg-rose-100 text-rose-700 shadow-rose-200/40'
                : 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 shadow-rose-950/40'
            }`}
            aria-label="Open Demo Video"
          >
            <Play className="w-3.5 h-3.5 fill-current text-rose-500 shrink-0" />
            <span className="font-semibold text-[11px] tracking-wide">Demo</span>
          </button>

          {/* Clean Executive Light / 3D Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Executive Light Theme' : 'Switch to 3D Dark Space Theme'}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95 border ${
              theme === 'light'
                ? 'border-stone-300/80 bg-white hover:bg-stone-100 text-stone-800 shadow-stone-200/50'
                : 'border-white/15 bg-white/5 hover:bg-white/10 text-stone-200 shadow-black/40'
            }`}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="hidden sm:inline font-semibold text-[11px] tracking-wide text-amber-300">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="hidden sm:inline font-semibold text-[11px] tracking-wide text-stone-700">Dark Mode</span>
              </>
            )}
          </button>

          {/* Background Ambient Music (Guitar & Piano) */}
          <SoundButton />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
            style={{
              color: theme === 'light' ? '#334155' : '#94a3b8',
              background: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Sidebar Drawer (Zero layout shift on page content) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden"
            />

            {/* Slide-in Right Sidebar Drawer */}
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] shadow-2xl p-6 flex flex-col justify-between md:hidden select-none overscroll-contain border-l ${
                theme === 'light'
                  ? 'bg-white border-stone-200 text-stone-900'
                  : 'bg-[#09090b] border-white/[0.08] text-stone-200'
              }`}
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div
                  className={`flex items-center justify-between pb-4 border-b ${
                    theme === 'light' ? 'border-stone-200' : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                      style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
                    >
                      <span className="text-white font-bold text-xs font-mono">SS</span>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold tracking-tight ${
                          theme === 'light' ? 'text-stone-900' : 'text-white'
                        }`}
                      >
                        Navigation
                      </p>
                      <p
                        className={`text-[10px] font-mono ${
                          theme === 'light' ? 'text-stone-500' : 'text-stone-400'
                        }`}
                      >
                        Sagar Singh Portfolio
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-stone-400 hover:text-white'
                    }`}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl border border-transparent transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'text-stone-700 hover:text-[#e11d48] hover:bg-rose-50 hover:border-rose-200'
                          : 'text-stone-300 hover:text-white hover:bg-rose-500/10 hover:border-rose-500/20'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span
                        className={`font-mono text-xs ${
                          theme === 'light' ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        →
                      </span>
                    </motion.a>
                  ))}
                </nav>

                {/* Mobile Demo Video Trigger */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsDemoOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-4 h-4 fill-current text-rose-500" />
                      <span>Watch Live 3D & System Demo</span>
                    </span>
                    <span className="font-mono text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                      Demo
                    </span>
                  </button>
                </div>

                {/* Mobile Theme Toggle Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-stone-200 border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-rose-500" />
                      )}
                      <span>
                        {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to 3D Dark Theme'}
                      </span>
                    </span>
                    <span
                      className={`font-mono text-[10px] ${
                        theme === 'light' ? 'text-stone-500' : 'text-stone-400'
                      }`}
                    >
                      Switch
                    </span>
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Status */}
              <div
                className={`pt-4 border-t ${
                  theme === 'light' ? 'border-stone-200' : 'border-white/[0.08]'
                }`}
              >
                <p
                  className={`text-[11px] text-center font-mono ${
                    theme === 'light' ? 'text-stone-500' : 'text-stone-400'
                  }`}
                >
                  Sagar Singh · Data Analytics & BI
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Pure Video Demo Modal (No text, no clutter) */}
      <DemoVideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </motion.header>
  );
};
