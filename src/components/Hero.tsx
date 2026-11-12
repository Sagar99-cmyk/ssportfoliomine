import React, { useEffect, useState, useMemo } from 'react';
import { Download, ArrowRight, Linkedin, Github, Mail, Database, Award, Code2, CheckCircle2, GraduationCap, FolderGit2, Trophy, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Profile, Skill, Project, Education } from '../types';
import { ProfessionalPhotoAvatar } from './ProfessionalPhotoAvatar';
import { getTechLogo } from './TechLogos';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  profile: Profile;
  skills?: Skill[];
  projects?: Project[];
  education?: Education[];
  onDownloadResume: () => void;
}

const TYPING_ROLES = [
  'Data Analyst · Sales Dashboard & BI',
  'Power BI & Advanced Excel Specialist',
  'MySQL Database & Relational Analytics',
  'Python Data Analyst (Pandas & NumPy)',
  'BCA Graduate · Presidency College 2026',
];

const TypewriterText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [displayed, setDisplayed] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[lineIdx];
    const speed = deleting ? 35 : 70;
    const pause = !deleting && charIdx === current.length ? 1600 : 0;

    const t = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setLineIdx(i => (i + 1) % texts.length);
      }
    }, pause || speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, lineIdx, texts]);

  return (
    <span>
      {displayed}
      <span
        className="inline-block w-0.5 h-5 sm:h-6 ml-1 align-middle"
        style={{ background: '#f43f5e', animation: 'blink 1s step-end infinite' }}
      />
      <style>{`@keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }`}</style>
    </span>
  );
};

const StylishNameTitle: React.FC<{ name: string; isLight?: boolean }> = ({ name, isLight }) => {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] || 'Sagar';
  const lastName = parts.slice(1).join(' ') || 'Singh';

  return (
    <div className="relative inline-block select-none group">
      
      {/* Liquid Gold & Radiant Red Shining Shimmer Animations */}
      <style>{`
        @keyframes goldShineSweep {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes redShineSweep {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .golden-shining-name {
          background-image: linear-gradient(115deg, #f59e0b 0%, #fbbf24 22%, #ffffff 45%, #fef08a 65%, #d97706 85%, #b45309 100%);
          background-size: 260% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShineSweep 5s linear infinite;
        }
        .golden-shining-name-light {
          background-image: linear-gradient(115deg, #92400e 0%, #b45309 25%, #d97706 50%, #b45309 75%, #78350f 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .red-shining-singh {
          background-image: linear-gradient(115deg, #e11d48 0%, #f43f5e 20%, #ffffff 42%, #fda4af 60%, #e11d48 80%, #9f1239 100%);
          background-size: 260% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: redShineSweep 5s linear infinite 0.5s;
        }
        .red-shining-singh-light {
          background-image: linear-gradient(115deg, #be123c 0%, #e11d48 30%, #9f1239 70%, #881337 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* 2-Word Distinct Luxury Styling: SAGAR in Gold, SINGH in Radiant Red */}
      <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-x-4 sm:gap-x-5 gap-y-1">
        {/* WORD 1: SAGAR */}
        <div className="inline-flex whitespace-nowrap relative">
          {firstName.split('').map((char, cIdx) => (
            <span
              key={`first-${cIdx}`}
              className={`inline-block font-black tracking-tight cursor-default ${
                isLight ? 'golden-shining-name-light' : 'golden-shining-name'
              }`}
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
                filter: isLight
                  ? 'drop-shadow(0 2px 8px rgba(180,83,9,0.25))'
                  : 'drop-shadow(0 4px 16px rgba(245,158,11,0.3))',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* WORD 2: SINGH */}
        <div className="inline-flex whitespace-nowrap relative">
          {lastName.split('').map((char, cIdx) => (
            <span
              key={`last-${cIdx}`}
              className={`inline-block font-black tracking-tight cursor-default ${
                isLight ? 'red-shining-singh-light' : 'red-shining-singh'
              }`}
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
                filter: isLight
                  ? 'drop-shadow(0 2px 8px rgba(225,29,72,0.28))'
                  : 'drop-shadow(0 4px 16px rgba(225,29,72,0.35))',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ profile, skills = [], projects = [], education = [], onDownloadResume }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const typingRoles = useMemo(() => {
    return [
      'Data Analyst · Sales Dashboard & BI',
      'Power BI & Advanced Excel Specialist',
      'MySQL Database & Relational Analytics',
      'Python Data Analyst (Pandas & NumPy)',
      'BCA Graduate · Presidency College 2026',
    ];
  }, []);

  const heroTags = useMemo(() => {
    // The top 4 skills as ordered dynamically from Admin panel
    if (skills && skills.length >= 4) {
      return skills.slice(0, 4).map((s) => ({
        label: s.name,
        icon: getTechLogo(s.name, s.iconUrl, 'w-4 h-4 shrink-0'),
      }));
    }
    return [
      { icon: getTechLogo('Power BI', undefined, 'w-4 h-4 shrink-0'), label: 'Power BI' },
      { icon: getTechLogo('MySQL', undefined, 'w-4 h-4 shrink-0'), label: 'MySQL' },
      { icon: getTechLogo('Python', undefined, 'w-4 h-4 shrink-0'), label: 'Python' },
      { icon: getTechLogo('Advanced Excel', undefined, 'w-4 h-4 shrink-0'), label: 'Excel' },
    ];
  }, [skills]);

  const statsList = useMemo(() => {
    const highestDegree = education?.[0]?.degree ? (education[0].degree.includes('BCA') ? 'BCA 2026' : education[0].degree) : 'BCA 2026';
    const institutionText = education?.[0]?.institution || 'Presidency College Degree';
    const projectCountText = projects.length > 0 ? `${projects.length}+ Projects` : '3+ Projects';
    const rowsText = profile.stats?.rowsProcessed || '150K+';
    const accuracyText = profile.stats?.forecastAccuracy || '98.5%';

    return [
      { value: highestDegree, label: institutionText, color: '#e11d48', icon: <GraduationCap className="w-5 h-5 mb-2 mx-auto text-rose-500" /> },
      { value: projectCountText, label: 'Major & Minor Capstones', color: '#38bdf8', icon: <FolderGit2 className="w-5 h-5 mb-2 mx-auto text-sky-400" /> },
      { value: rowsText, label: 'Data Records Modeled & Analyzed', color: '#22c55e', icon: <Trophy className="w-5 h-5 mb-2 mx-auto text-emerald-400" /> },
      { value: accuracyText, label: 'Forecast & KPI Dashboard Precision', color: '#f59e0b', icon: <ShieldCheck className="w-5 h-5 mb-2 mx-auto text-amber-400" /> },
    ];
  }, [education, projects, profile.stats]);
  return (
    <section className="relative pt-6 pb-20 md:pt-10 md:pb-28 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        {/* ===================================================================== */}
        {/* MOBILE & TABLET HEADER: Available Badge -> Name -> Dynamic Role Statement */}
        {/* ===================================================================== */}
        <div className="lg:hidden flex flex-col items-center text-center space-y-4">
          {/* Availability Badge */}
          {profile.isAvailable && (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
                isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e] animate-pulse"
              />
              <span>{profile.availabilityStatus || 'Available for Data Analyst & Entry-Level Tech Roles'}</span>
            </div>
          )}

          {/* Stylish Name */}
          <div className="space-y-2 w-full">
            <StylishNameTitle name={profile.name} isLight={isLight} />

            {/* Stable Single Container with Fixed Height & Constant Crisp Rose Color - Never Shifts Layout */}
            <div className="h-9 sm:h-11 flex items-center justify-center w-full overflow-hidden">
              <span className={`text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap ${
                isLight ? 'text-rose-600' : 'text-rose-400'
              }`}>
                <TypewriterText texts={typingRoles} />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Photo Avatar + Quick Skills Card */}
          <div className="lg:col-span-5 flex flex-col items-center gap-5 lg:order-2">
            {/* Professional Portrait with Natural Eye Blink Animation & 3D Tilt */}
            <ProfessionalPhotoAvatar />

            {/* Quick Skills Summary Pill Card below photo */}
            <div
              className={`w-full max-w-sm p-4 rounded-2xl border space-y-3.5 transition-all ${
                isLight
                  ? 'bg-white/90 border-stone-300/80 shadow-md backdrop-blur-md'
                  : 'bg-transparent border-rose-500/30 backdrop-blur-[12px]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white font-mono shrink-0 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
                  >
                    SS
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={`font-bold text-sm truncate ${isLight ? 'text-stone-900' : 'text-white'}`}>
                      {profile.name}
                    </p>
                    <p className={`text-[11px] truncate ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                      BCA Graduate · Presidency College
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {heroTags.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl flex items-center gap-2 font-medium border text-[11px] min-w-0 transition-all ${
                      isLight
                        ? 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-400'
                        : 'bg-white/[0.035] border-white/[0.08] text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Content (Desktop: Full Left Column | Mobile: Intro, Buttons, Connect) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left lg:order-1 flex flex-col items-center lg:items-start">
            
            {/* Desktop Only: Badge, Name & Typewriter */}
            <div className="hidden lg:flex flex-col items-start space-y-6 w-full">
              {profile.isAvailable && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                    isLight
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                      : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e] animate-pulse"
                  />
                  <span>{profile.availabilityStatus || 'Available for Data Analyst & Entry-Level Tech Roles'}</span>
                </div>
              )}

              <div className="space-y-3 w-full">
                <StylishNameTitle name={profile.name} isLight={isLight} />

                {/* Stable Single Container with Fixed Height & Constant Crisp Rose Color - Never Shifts Layout */}
                <div className="h-10 md:h-12 flex items-center justify-start w-full overflow-hidden">
                  <span className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap ${
                    isLight ? 'text-rose-600' : 'text-rose-400'
                  }`}>
                    <TypewriterText texts={typingRoles} />
                  </span>
                </div>
              </div>
            </div>

            {/* Intro text */}
            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-xl ${
              isLight ? 'text-stone-700 font-medium' : 'text-stone-300'
            }`}>
              {profile.intro}
            </p>

            {/* Meta line */}
            <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-medium ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              <span>{profile.location}</span>
              <span className={isLight ? 'text-stone-300' : 'text-stone-600'}>·</span>
              <span>Presidency College (BCA 2026)</span>
              <span className={isLight ? 'text-stone-300' : 'text-stone-600'}>·</span>
              <span>Data Analytics · Power BI · MySQL · Python</span>
            </div>

            {/* Action Buttons - Fully Responsive Mobile, Tablet & Desktop */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('projects');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.hash = '#projects';
                  }
                }}
                className="px-5 sm:px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 group w-full sm:w-auto text-center shrink-0 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #e11d48, #be123c)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(225,29,72,0.3)',
                }}
              >
                <span>See My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onDownloadResume}
                className={`px-5 sm:px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border w-full sm:w-auto text-center shrink-0 cursor-pointer active:scale-95 transition-all ${
                  isLight
                    ? 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50 shadow-xs'
                    : 'bg-white/[0.05] border-white/15 text-slate-200 hover:bg-white/10'
                }`}
              >
                <Download className="w-4 h-4 text-rose-500" />
                <span>Get Resume</span>
              </button>

              <a
                href="#contact"
                className={`px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all w-full sm:w-auto text-center shrink-0 cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-white text-stone-700 border-stone-300 hover:text-stone-900 hover:border-rose-400'
                    : 'border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                Let's Connect
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <span className={`text-xs uppercase tracking-widest font-mono ${
                isLight ? 'text-stone-500' : 'text-slate-500'
              }`}>
                Connect:
              </span>
              {[
                { href: profile.linkedinUrl, icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                { href: profile.githubUrl, icon: <Github className="w-4 h-4" />, label: 'GitHub' },
                { href: `mailto:${profile.email}`, icon: <Mail className="w-4 h-4" />, label: 'Email' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2.5 rounded-lg border transition-all hover:scale-110 hover:text-rose-500 ${
                    isLight
                      ? 'bg-white text-stone-600 border-stone-200 shadow-2xs hover:border-rose-300'
                      : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                  }`}
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Highlight Stats Strip (With Icons & Clean Grid Alignment) */}
        <div
          className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{
            borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {statsList.map((stat, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border text-center transition-all hover:scale-105 ${
                isLight
                  ? 'bg-white/85 border-stone-200/90 shadow-sm'
                  : 'bg-white/[0.03] border-white/[0.08]'
              }`}
            >
              {stat.icon}
              <div
                className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className={`text-xs mt-1.5 font-medium ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
