import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundButton } from './BackgroundMusic';

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

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          ? 'rgba(9,9,11,0.96)'
          : 'rgba(9,9,11,0.90)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">

        {/* Brand: "Portfolio" word */}
        <a
          href="#"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-white font-bold text-xs font-mono">SS</span>
          </motion.div>
          <span
            className="text-lg font-bold tracking-tight transition-colors"
            style={{ color: '#f1f5f9' }}
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
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#f1f5f9';
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Background Ambient Music (Guitar & Piano) */}
          <SoundButton />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)' }}
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
              className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-[#09090b] border-l border-white/[0.08] shadow-2xl p-6 flex flex-col justify-between md:hidden select-none overscroll-contain"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                      style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
                    >
                      <span className="text-white font-bold text-xs font-mono">SS</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">Navigation</p>
                      <p className="text-[10px] text-stone-400 font-mono">Sagar Singh Portfolio</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-stone-400 hover:text-white transition-colors cursor-pointer"
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
                      className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl text-stone-300 hover:text-white hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <span className="text-stone-600 font-mono text-xs">→</span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Drawer Bottom Status */}
              <div className="pt-4 border-t border-white/[0.08]">
                <p className="text-[11px] text-center text-stone-400 font-mono">
                  Sagar Singh · Data Analytics & BI
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
