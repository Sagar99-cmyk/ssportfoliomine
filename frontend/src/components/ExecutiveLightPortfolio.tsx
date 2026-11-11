import React, { useState, useMemo, useEffect } from 'react';
import {
  Mail, MapPin, Linkedin, Github, Download,
  ChevronRight, CheckCircle2,
  Volume2, VolumeX,
  TrendingUp, Database, Code2, Send,
  AlertCircle, Moon, FileText, Table,
  User, Home, Sparkles, FolderGit2
} from 'lucide-react';
import { Profile, Skill, Project, Education, Achievement } from '../types';
import { ProfessionalPhotoAvatar } from './ProfessionalPhotoAvatar';
import { CaseStudyModal } from './CaseStudyModal';
import { StitchLightBackground } from './StitchLightBackground';
import { globalAudioEngine } from './BackgroundMusic';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

interface ExecutiveLightPortfolioProps {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  achievements: Achievement[];
  onDownloadResume: () => void;
}

export const ExecutiveLightPortfolio: React.FC<ExecutiveLightPortfolioProps> = ({
  profile,
  skills,
  projects,
  education,
  achievements,
  onDownloadResume,
}) => {
  const { toggleTheme } = useTheme();

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  // Selected Project for Case Study Modal
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Project Category Filter
  const [activeProjectFilter, setActiveProjectFilter] = useState<'ALL' | 'BI Dashboards' | 'Python ETL'>('ALL');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync Audio Engine State
  useEffect(() => {
    setIsPlayingAudio(!globalAudioEngine.getIsMuted());
  }, []);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      globalAudioEngine.setMuted(true);
      setIsPlayingAudio(false);
    } else {
      globalAudioEngine.setMuted(false);
      globalAudioEngine.start();
      setIsPlayingAudio(true);
    }
  };

  // Filter Projects based on tabs
  const filteredProjects = useMemo(() => {
    if (activeProjectFilter === 'ALL') return projects;
    if (activeProjectFilter === 'BI Dashboards') {
      return projects.filter(p =>
        (p.technologies || []).some((t: string) => /power\s*bi|tableau|excel|dashboard/i.test(t)) ||
        /dashboard|analytics|bi/i.test(p.title)
      );
    }
    return projects.filter(p =>
      (p.technologies || []).some((t: string) => /python|etl|pipeline|sql|pandas/i.test(t)) ||
      /etl|python|pipeline|data/i.test(p.title)
    );
  }, [projects, activeProjectFilter]);

  // Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(null);
    setFormError(null);

    try {
      await api.sendMessage(formData);
      setFormSuccess('Message transmitted successfully! A notification has been sent directly to Sagar.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormSuccess(null), 8000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to send message. Please reach out via WhatsApp or email directly.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a] relative selection:bg-rose-500/20 selection:text-rose-600 font-sans">
      
      {/* 3D Dispersed Floating Polyhedrons Background */}
      <StitchLightBackground />

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (MATCHING SCREENSHOT)                                       */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#faf9f6]/92 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 md:px-8 py-3.5 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Brand Name on Left */}
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              Sagar Singh
            </span>
            <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse"></span>
          </div>

          {/* Action Icons on Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              title={isPlayingAudio ? 'Mute Background Audio' : 'Play Background Audio'}
              className="p-2 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-[#e11d48]" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              title="Switch to Dark Mode"
              className="p-2 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              <Moon className="w-4 h-4 text-stone-700 hover:text-amber-500 transition-colors" />
            </button>

            {/* Profile Avatar Badge */}
            <div className="w-9 h-9 rounded-full bg-[#e11d48] border-2 border-white shadow-xs flex items-center justify-center text-white overflow-hidden">
              <img
                src="/profile-transparent-open.png"
                alt="Sagar Singh"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/profile2.png';
                }}
              />
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-10 md:pt-12 pb-24 space-y-14 sm:space-y-16 relative z-10">

        {/* ========================================================================= */}
        {/* 2. HERO SECTION - TRANSFORMING RAW DATA INTO ACTIONABLE INTELLIGENCE       */}
        {/* ========================================================================= */}
        <section id="hero" className="pt-2">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (Hero Content + CTAs + KPI Stats) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Role Pill */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-950 border border-indigo-100/90 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse"></span>
                  Data Analyst & BI Engineer
                </span>
              </div>

              {/* Main Headline & Pitch */}
              <div className="space-y-3">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.12]">
                  Transforming<br />
                  Raw Data into<br />
                  <span className="text-[#e11d48]">Actionable</span><br />
                  <span className="text-[#e11d48]">Intelligence</span>
                </h1>

                <p className="text-xs xs:text-sm sm:text-base text-stone-600 font-medium leading-relaxed max-w-xl">
                  Specializing in enterprise dashboards, predictive modeling, and scalable Python ETL pipelines. 
                  Bridging complex datasets with high-impact executive decision-making.
                </p>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-rose-500/25 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  Explore Projects
                </a>

                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full bg-[#e0e7ff] hover:bg-[#c7d2fe] text-[#3730a3] font-semibold text-xs sm:text-sm border border-indigo-200/60 shadow-2xs transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  Get in Touch
                </a>
              </div>

              {/* 3 Stat KPI Cards (Responsive Horizontal Grid) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 md:gap-4 pt-2">
                {/* Card 1 */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs text-center space-y-1">
                  <p className="text-base xs:text-xl sm:text-2xl md:text-3xl font-black text-[#e11d48] tracking-tight">150K+</p>
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">
                    RECORDS PROCESSED
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs text-center space-y-1">
                  <p className="text-base xs:text-xl sm:text-2xl md:text-3xl font-black text-emerald-600 tracking-tight">98.5%</p>
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">
                    MODEL ACCURACY
                  </p>
                </div>

                {/* Card 3 */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs text-center space-y-1">
                  <p className="text-base xs:text-xl sm:text-2xl md:text-3xl font-black text-amber-600 tracking-tight">5+</p>
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">
                    CAPSTONES BUILT
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Interactive Profile Photo Avatar (Floating, Zero Box Background) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 pt-4 lg:pt-0">
              
              {/* Profile Avatar with Glowing Crimson Border Ring */}
              <ProfessionalPhotoAvatar
                sizeClassName="w-52 h-52 xs:w-60 xs:h-60 sm:w-68 sm:h-68 md:w-76 md:h-76 lg:w-80 lg:h-80"
              />

              {/* Dynamic Interaction Pill */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-stone-200 text-stone-600 text-[11px] font-mono shadow-2xs backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>3D Tilt Parallax • Move to track, tap to greet</span>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. CORE METHODOLOGIES & TOOLS SECTION                                     */}
        {/* ========================================================================= */}
        <section id="methodologies" className="space-y-5 pt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Core Methodologies & Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
            
            {/* Card 1: Power BI & DAX */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-rose-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Power BI & DAX</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Designing dynamic enterprise dashboards, advanced data modeling, and custom DAX measures for executive reporting.
                </p>
              </div>
            </div>

            {/* Card 2: Advanced Excel */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <Table className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Advanced Excel</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Complex financial modeling, Power Query automation, VBA macros, and advanced statistical forecasting.
                </p>
              </div>
            </div>

            {/* Card 3: MySQL & Databases */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-amber-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">MySQL & Databases</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Writing optimized complex queries, indexing large-scale relational schemas, and maintaining database integrity.
                </p>
              </div>
            </div>

            {/* Card 4: Python ETL Pipelines */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-indigo-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Python ETL Pipelines</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Automating data extraction, Pandas/NumPy data wrangling, and seamless integration with cloud data warehouses.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FEATURED ANALYTICAL PROJECTS                                           */}
        {/* ========================================================================= */}
        <section id="projects" className="space-y-6 pt-4">
          
          {/* Header with Title and Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48]">
                PORTFOLIO SHOWCASE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Featured Analytical Projects
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              {(['ALL', 'BI Dashboards', 'Python ETL'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveProjectFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeProjectFilter === tab
                      ? 'bg-[#e11d48] text-white shadow-xs'
                      : 'bg-[#e0e7ff] text-[#3730a3] hover:bg-[#c7d2fe]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {filteredProjects.map(proj => (
              <div
                key={proj.id || proj.title}
                className="rounded-3xl bg-white border border-stone-200/90 overflow-hidden shadow-xs hover:border-rose-300 transition-all flex flex-col group"
              >
                {/* Image Mockup */}
                <div className="relative h-44 sm:h-48 md:h-52 bg-stone-100 overflow-hidden border-b border-stone-100">
                  <img
                    src={proj.thumbnailUrl || '/projects/sales-dashboard.png'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/projects/sales-dashboard.png';
                    }}
                  />
                  {proj.featured && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#e11d48] text-white shadow-xs">
                      Featured
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(proj.technologies || ['Power BI', 'Python']).slice(0, 3).map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight group-hover:text-[#e11d48] transition-colors">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {proj.shortDescription || proj.caseStudy?.overview || ''}
                    </p>
                  </div>

                  {/* Card Footer: Verified Capstone & View Case Study */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-600 flex items-center gap-1 font-mono text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Capstone
                    </span>

                    <button
                      onClick={() => setSelectedCaseStudy(proj)}
                      className="text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 font-bold cursor-pointer transition-colors"
                    >
                      <span>View Case Study</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 6. ACADEMIC BACKGROUND & GET THE COMPLETE DOSSIER                          */}
        {/* ========================================================================= */}
        <section id="education" className="space-y-6 pt-4">
          
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48]">
              ACADEMIC BACKGROUND
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Presidency College
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-stretch">
            
            {/* Left Card: Education */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-stone-900">
                    Bachelor of Computer Applications (BCA)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 shrink-0">
                    Class of '26
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Focusing on data structures, database management systems, applied statistics, and enterprise software engineering. 
                  Active participant in collegiate hackathons and data modeling workshops.
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-stone-500 font-mono pt-2">
                <MapPin className="w-3.5 h-3.5 text-[#e11d48]" />
                <span>Bangalore, India</span>
              </div>
            </div>

            {/* Right Card: Get the Complete Dossier */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#f8f9ff] border border-indigo-100/80 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#e11d48] text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-stone-900">
                  Get the Complete Dossier
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
                  Download my official resume detailing professional milestones, technical certifications, and comprehensive project metrics.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 w-full">
                <button
                  onClick={onDownloadResume}
                  className="px-5 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs tracking-wide shadow-sm shadow-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume (PDF)</span>
                </button>

                <a
                  href="#contact"
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs border border-stone-300 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  Quick Inquiry
                </a>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 7. CONTACT SECTION: LET'S DISCUSS DATA OPPORTUNITIES                       */}
        {/* ========================================================================= */}
        <section id="contact" className="py-6 sm:py-8">
          
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-[#f8f9ff] border border-indigo-100/70 shadow-xs space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-1.5 max-w-lg mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48] block">
                GET IN TOUCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Let's Discuss Data Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Have an analytical challenge or project proposal? Send a direct message below.
              </p>
            </div>

            {/* Inner Form Card */}
            <form
              onSubmit={handleContactSubmit}
              className="max-w-xl mx-auto p-5 sm:p-7 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4"
            >
              {formSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Subject / Scope */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 font-mono">
                  Subject / Project Scope
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Data Engineering / BI Consultation"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                />
              </div>

              {/* Row 3: Message Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 font-mono">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your data requirements or inquiry..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 rounded-2xl bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{formLoading ? 'Transmitting Message...' : 'Send Direct Message'}</span>
              </button>
            </form>

          </div>

        </section>

      </main>

      {/* ========================================================================= */}
      {/* 8. FOOTER BAR                                                             */}
      {/* ========================================================================= */}
      <footer className="border-t border-stone-200/80 bg-white/92 backdrop-blur-md py-6 px-4 sm:px-6 md:px-8 text-xs font-mono text-stone-500 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div>
            © 2025 Sagar Singh. Crafted with precision.
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/Sagar99-cmyk"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/sagarsingh2005"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-stone-600 hover:text-sky-600 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>

            <a
              href="#contact"
              className="flex items-center gap-1.5 text-stone-600 hover:text-[#e11d48] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>

        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Dock (Home, Skills, Projects, Resume, Contact) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 px-4 py-2.5 flex items-center justify-around shadow-2xl md:hidden backdrop-blur-lg border-t bg-white/95 border-stone-200 text-stone-600 transition-colors">
        <a
          href="#hero"
          className="flex flex-col items-center gap-0.5 text-xs font-semibold hover:text-[#e11d48] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </a>
        <a
          href="#methodologies"
          className="flex flex-col items-center gap-0.5 text-xs font-semibold hover:text-[#e11d48] transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">Skills</span>
        </a>
        <a
          href="#projects"
          className="flex flex-col items-center gap-0.5 text-xs font-semibold text-[#e11d48] transition-colors"
        >
          <FolderGit2 className="w-4 h-4" />
          <span className="text-[10px]">Projects</span>
        </a>
        <a
          href="#education"
          className="flex flex-col items-center gap-0.5 text-xs font-semibold hover:text-[#e11d48] transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">Resume</span>
        </a>
        <a
          href="#contact"
          className="flex flex-col items-center gap-0.5 text-xs font-semibold hover:text-[#e11d48] transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="text-[10px]">Contact</span>
        </a>
      </nav>

      {/* Deep-Dive Case Study Modal */}
      {selectedCaseStudy && (
        <CaseStudyModal
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}

    </div>
  );
};
