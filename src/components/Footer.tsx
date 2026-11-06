import React from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-8 overflow-hidden select-none border-t border-white/[0.06] bg-[#07090e]/95 backdrop-blur-xl">
      {/* Subtle ambient ruby glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-16 pointer-events-none opacity-20 blur-2xl bg-rose-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center">
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to Top"
          className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-mono font-medium border border-white/[0.12] bg-white/[0.03] hover:bg-rose-500/15 hover:border-rose-500/50 text-stone-300 hover:text-white transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4)] active:scale-95"
        >
          <ArrowUp className="w-3.5 h-3.5 text-rose-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
          <span>Back to Top</span>
        </motion.button>
      </div>
    </footer>
  );
};
