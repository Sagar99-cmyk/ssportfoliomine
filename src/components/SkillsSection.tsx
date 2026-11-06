import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Code2, Database, Wrench, BarChart3, Compass,
  MessageSquare, Zap, Shield, Lightbulb, BookOpen,
} from 'lucide-react';
import { Skill } from '../types';
import { SkillsSolarSystem3D } from './SkillsSolarSystem3D';
import { getTechLogo } from './TechLogos';

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Data Analytics': <BarChart3 className="w-3.5 h-3.5 text-rose-400" />,
  'Programming': <Code2 className="w-3.5 h-3.5 text-rose-400" />,
  'Databases': <Database className="w-3.5 h-3.5 text-rose-400" />,
  'Tools': <Wrench className="w-3.5 h-3.5 text-rose-400" />,
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'solarsystem'>('cards');
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enforce unique skills by lowercase trimmed name so duplicates NEVER appear
  const uniqueSkills = useMemo(() => {
    const seen = new Set<string>();
    return skills.filter(s => {
      const key = (s.name || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [skills]);

  // Extract unique categories dynamically from database skills
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(uniqueSkills.map(s => s.category).filter(Boolean)))];
  }, [uniqueSkills]);

  const filteredSkills = useMemo(() => {
    return selectedCategory === 'All'
      ? uniqueSkills
      : uniqueSkills.filter(s => s.category === selectedCategory);
  }, [selectedCategory, uniqueSkills]);

  // Handle skill click: reduced red color and auto-clears after 1.5 seconds
  const handleSkillClick = (skillName: string) => {
    setActiveSkill(skillName);
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
    activeTimerRef.current = setTimeout(() => {
      setActiveSkill(null);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
    };
  }, []);

  return (
    <section id="skills" className="py-20 relative overflow-hidden select-none">
      {/* Background ambient crimson/ruby red atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-rose-950/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-rose-900/15 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header - Crimson Red & Rose Glow */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent drop-shadow">
            Technical Skills
          </h2>

          <p className="text-sm sm:text-base text-stone-400 font-medium tracking-wide">
            My Tech Stack & Tools
          </p>
        </div>

        {/* Category Filter Pills & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                    : 'bg-stone-900/60 backdrop-blur-md text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700'
                }`}
              >
                {CATEGORY_ICONS[cat] || <Compass className="w-3.5 h-3.5 text-stone-400" />}
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  selectedCategory === cat ? 'bg-rose-500/30 text-rose-200' : 'bg-stone-800 text-stone-500'
                }`}>
                  {cat === 'All' ? uniqueSkills.length : uniqueSkills.filter(s => s.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* View Mode Switcher: Cards View (Default) or 3D Solar System */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900/60 backdrop-blur-md border border-stone-800 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-rose-900/40 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>☷ Grid Cards</span>
            </button>

            <button
              onClick={() => setViewMode('solarsystem')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'solarsystem'
                  ? 'bg-rose-900/40 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>☀️ 3D Solar</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: 3D SOLAR SYSTEM                                                  */}
        {/* ========================================================================= */}
        {viewMode === 'solarsystem' ? (
          <SkillsSolarSystem3D skills={uniqueSkills} />
        ) : (
          /* ========================================================================= */
          /* VIEW 2: CLEAN GRID CARDS VIEW - TRANSPARENT PREMIUM RED ACCENT           */
          /* ========================================================================= */
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredSkills.map((skill, idx) => {
                const isActive = activeSkill === skill.name;
                return (
                  <motion.div
                    key={skill.id || skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    onClick={() => handleSkillClick(skill.name)}
                    className={`group relative rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl ${
                      isActive
                        ? 'bg-rose-500/10 border border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.22)]'
                        : 'bg-[#0d101a]/50 hover:bg-white/[0.04] border border-white/[0.08] hover:border-rose-500/30'
                    }`}
                  >
                    {/* Active Click Indicator Dot */}
                    {isActive && (
                      <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500/80 shadow-[0_0_6px_#f43f5e]"></span>
                      </span>
                    )}

                    {/* Subtle top inner gradient */}
                    <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                    {/* Logo Center */}
                    <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {getTechLogo(skill.name, skill.iconUrl, 'w-14 h-14 sm:w-16 sm:h-16')}
                    </div>

                    {/* Skill Name Underneath */}
                    <h3 className={`relative z-10 mt-4 text-sm sm:text-base font-bold tracking-wide transition-colors duration-200 ${
                      isActive ? 'text-rose-100 font-extrabold' : 'text-white group-hover:text-rose-200'
                    }`}>
                      {skill.name}
                    </h3>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Soft Skills & Work Habits Banner - Transparent Glassmorphism */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900/60 via-stone-900/40 to-stone-950/60 backdrop-blur-xl border border-white/[0.08] space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Everyday Professional Habits</h4>
              <p className="text-xs text-stone-400">Practiced through academic projects, team collaborations, and NCC training</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'Clean Code & Logic', desc: 'Writing readable, structured, and modular code', icon: <Code2 className="w-3.5 h-3.5 shrink-0 text-rose-400" /> },
              { label: 'Clear Communication', desc: 'Active listening and concise updates', icon: <MessageSquare className="w-3.5 h-3.5 shrink-0 text-rose-400" /> },
              { label: 'Fast & Curious Learner', desc: 'Adapting to modern frameworks quickly', icon: <Zap className="w-3.5 h-3.5 shrink-0 text-rose-400" /> },
              { label: 'Discipline & NCC Spirit', desc: 'Ownership, punctuality, and resilience', icon: <Shield className="w-3.5 h-3.5 shrink-0 text-rose-400" /> },
              { label: 'Problem Solver', desc: 'Analytical debugging and root-cause analysis', icon: <Lightbulb className="w-3.5 h-3.5 shrink-0 text-rose-400" /> },
            ].map(item => (
              <div
                key={item.label}
                className="p-3.5 rounded-xl bg-stone-950/60 backdrop-blur-md border border-white/[0.06] space-y-1 hover:border-rose-500/30 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};