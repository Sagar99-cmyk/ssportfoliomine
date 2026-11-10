import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, MapPin, Linkedin, Github, Download, Eye, EyeOff,
  ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, Play, Pause,
  Volume2, VolumeX, ShieldCheck, Award, GraduationCap, FolderGit2,
  TrendingUp, BarChart3, Database, Code2, Wrench, Sparkles, Send,
  AlertCircle, Moon, Sun, ArrowRight, FileText, Check
} from 'lucide-react';
import { Profile, Skill, Project, Education, Achievement } from '../types';
import { ProfessionalPhotoAvatar } from './ProfessionalPhotoAvatar';
import { CaseStudyModal } from './CaseStudyModal';
import { getTechLogo } from './TechLogos';
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

  // Selected Project for Deep-Dive Case Study Modal
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Resume Inline View Toggle
  const [isResumeUnlocked, setIsResumeUnlocked] = useState(false);

  // Skill Filtering
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('All');

  // Project Filtering & Carousel Slider
  const [activeProjectFilter, setActiveProjectFilter] = useState<'All' | 'Major' | 'Minor'>('All');
  const projectTrackRef = useRef<HTMLDivElement>(null);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync Audio Playback State
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

  // Horizontal Project Carousel Navigation
  const scrollProjects = (direction: 'left' | 'right') => {
    if (!projectTrackRef.current) return;
    const scrollAmount = projectTrackRef.current.clientWidth * 0.85;
    projectTrackRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  // Filtered Skills
  const filteredSkills = useMemo(() => {
    if (activeSkillCategory === 'All') return skills;
    return skills.filter(s => s.category?.toLowerCase().includes(activeSkillCategory.toLowerCase()));
  }, [skills, activeSkillCategory]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    if (activeProjectFilter === 'All') return projects;
    if (activeProjectFilter === 'Major') {
      return projects.filter(p => (p.projectType || '').toLowerCase().includes('major'));
    }
    return projects.filter(p => (p.projectType || '').toLowerCase().includes('minor') || (p.projectType || '').toLowerCase().includes('micro'));
  }, [projects, activeProjectFilter]);

  // Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(null);
    setFormError(null);

    try {
      await api.sendMessage(formData);
      setFormSuccess('Message sent successfully! A confirmation alert has been forwarded to Sagar’s personal Gmail.');
      setFormData({ name: '', email: '', subject: '', company: '', message: '' });
      setTimeout(() => setFormSuccess(null), 8000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to send message. Please try WhatsApp or email directly.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a] font-sans antialiased selection:bg-rose-500 selection:text-white pb-24 md:pb-12">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & STATUS BAR                                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3 transition-all shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Identity & Availability Status */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-2 border-[#e11d48] overflow-hidden shadow-sm">
                <img src="/profile2.png" alt="Sagar Singh" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-stone-900 tracking-tight">Sagar Singh</h1>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-700 block">
                Available for Immediate Roles
              </span>
            </div>
          </div>

          {/* Action Icons: Theme Switcher & Audio Engine */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button: Switch back to 3D Dark Mode */}
            <button
              onClick={toggleTheme}
              title="Switch to 3D Dark Space Theme"
              className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Moon className="w-3.5 h-3.5 text-[#e11d48]" />
              <span className="hidden sm:inline">3D Dark Mode</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              title={isPlayingAudio ? 'Mute Background Audio' : 'Play Background Audio'}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-all cursor-pointer"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-[#e11d48]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-12">

        {/* ========================================================================= */}
        {/* 2. HERO SECTION - SAGAR SINGH                                             */}
        {/* ========================================================================= */}
        <section id="hero" className="space-y-6">
          
          {/* Availability Pill */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for Immediate Roles
            </span>
          </div>

          {/* Headline Name */}
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-tight">
              Sagar <span className="text-[#e11d48]">Singh</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed max-w-2xl">
              BCA 2026 Graduate specializing in <strong>Data Analytics, Power BI, Advanced Excel, MySQL, and Python</strong>. 
              Turning complex data into clear execution.
            </p>
          </div>

          {/* Location & Institution Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium text-stone-600">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
              <MapPin className="w-3.5 h-3.5 text-[#e11d48]" />
              Bengaluru, IN
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
              <GraduationCap className="w-3.5 h-3.5 text-[#e11d48]" />
              Presidency College (BCA)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
              <Award className="w-3.5 h-3.5 text-[#e11d48]" />
              BCA
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="#contact"
              className="px-6 py-3 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#resume"
              className="px-5 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              <span>CV / Resume</span>
            </a>
          </div>

          {/* Interactive 3D Natural Avatar */}
          <div className="py-2 flex justify-center">
            <ProfessionalPhotoAvatar />
          </div>

          {/* ===================================================================== */}
          {/* 3. INTERACTIVE AUDIO & PERFORMANCE SPARKLINE CARD                     */}
          {/* ===================================================================== */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-md space-y-5">
            
            {/* Audio Mini Player */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#e11d48] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-stone-800">Acoustic Melody (Guitar & Piano)</p>
                  <p className="text-[11px] text-stone-500 font-mono">Calming Ambient · Background On</p>
                </div>
              </div>

              <a
                href="tel:+917892570634"
                title="Direct Phone Call"
                className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* 4 Quick Stat Benchmarks */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-base sm:text-lg font-black text-[#e11d48]">15+</p>
                <p className="text-[10px] sm:text-xs font-medium text-stone-500">Projects & BI</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-stone-900">50K+</p>
                <p className="text-[10px] sm:text-xs font-medium text-stone-500">Rows Cleaned</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-[#e11d48]">10+</p>
                <p className="text-[10px] sm:text-xs font-medium text-stone-500">Applied Tech</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-stone-900">96.4%</p>
                <p className="text-[10px] sm:text-xs font-medium text-stone-500">Precision</p>
              </div>
            </div>

            {/* Growth Sparkline Indicator */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="font-semibold text-stone-700">Records Processed (72.6% monthly growth)</span>
                <span className="text-emerald-600 font-bold font-mono text-[11px] flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +72.6%
                </span>
              </div>
              
              {/* SVG Trend Sparkline */}
              <div className="h-10 w-full pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,35 Q40,32 75,28 T150,20 T225,12 T300,5 L300,40 L0,40 Z"
                    fill="url(#growthGrad)"
                  />
                  <path
                    d="M0,35 Q40,32 75,28 T150,20 T225,12 T300,5"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="300" cy="5" r="3.5" fill="#16a34a" />
                </svg>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. FOUR WHITE STAT CARDS (2x2 GRID)                                   */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* Card 1: Degree */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                DEGREE
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#e11d48]">BCA '26</p>
              <p className="text-xs text-stone-500">Presidency College</p>
            </div>

            {/* Card 2: Evaluation */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                EVALUATION
              </span>
              <p className="text-xl sm:text-2xl font-black text-stone-900">5★ Proj</p>
              <p className="text-xs text-stone-500">End-to-End Build</p>
            </div>

            {/* Card 3: Records */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                RECORDS ANALYZED
              </span>
              <p className="text-xl sm:text-2xl font-black text-stone-900">150K+</p>
              <p className="text-xs text-stone-500">Structured & Cleaned</p>
            </div>

            {/* Card 4: Precision */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                PRECISION
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-600">96.5%</p>
              <p className="text-xs text-stone-500">KPI Forecasting</p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 5. TECHNICAL STACK SECTION                                                */}
        {/* ========================================================================= */}
        <section id="skills" className="space-y-5 pt-4">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider font-mono">
                TECH STACK
              </span>
              <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Technical Stack</h3>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
              {filteredSkills.length} Skills Listed
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Data Analytics', 'Databases', 'Programming'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveSkillCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeSkillCategory === cat
                    ? 'bg-[#e11d48] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat === 'All' ? 'All Skills' : cat}
              </button>
            ))}
          </div>

          {/* Skill Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredSkills.map(skill => (
              <div
                key={skill.id || skill.name}
                className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-rose-400/60 transition-all space-y-2.5 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                    {getTechLogo(skill.name, skill.iconUrl, 'w-6 h-6')}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">{skill.name}</h4>
                </div>

                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {skill.description || 'Enterprise implementation, modeling, and automated data workflows.'}
                </p>

                {skill.toolsUsed && skill.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skill.toolsUsed.slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Discipline & Mindset Banner */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-stone-700">
            <span className="font-mono text-[10px] uppercase text-stone-500">SHOWCASE DISCIPLINE & MINDSET</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                100% Raw Data Cleaned
              </span>
              <span className="flex items-center gap-1 text-[#e11d48]">
                <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
                Direct Actionable Insights
              </span>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 6. FEATURED PROJECTS SECTION (INTERACTIVE LEFT-TO-RIGHT SLIDER)           */}
        {/* ========================================================================= */}
        <section id="projects" className="space-y-5 pt-4">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider font-mono">
                PROJECT SHOWCASE
              </span>
              <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Featured Projects</h3>
            </div>

            {/* Left & Right Interactive Navigation Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollProjects('left')}
                title="Scroll Left"
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollProjects('right')}
                title="Scroll Right"
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveProjectFilter('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                activeProjectFilter === 'All' ? 'bg-[#e11d48] text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveProjectFilter('Major')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                activeProjectFilter === 'Major' ? 'bg-[#e11d48] text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              Major Projects (4)
            </button>
            <button
              onClick={() => setActiveProjectFilter('Minor')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                activeProjectFilter === 'Minor' ? 'bg-[#e11d48] text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              Minor & Micro
            </button>
          </div>

          {/* Horizontal Interactive Carousel (Smooth Left-to-Right swipe / slider animation) */}
          <div
            ref={projectTrackRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id || project.title}
                className="w-[85vw] max-w-sm sm:max-w-md shrink-0 snap-center rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden border-b border-stone-100">
                  <img
                    src={project.thumbnailUrl || '/projects/sales-dashboard.png'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/95 text-[#e11d48] shadow-xs">
                    {project.projectType || 'Flagship Project'}
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-stone-900 tracking-tight group-hover:text-[#e11d48] transition-colors">
                      {project.title}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Technology Pills */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-100">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Link -> Opens Case Study Modal */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        onClick={() => setSelectedCaseStudy(project)}
                        className="text-xs font-bold text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Explore Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="View Repository on GitHub"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 7. METHODOLOGY SECTION                                                    */}
        {/* ========================================================================= */}
        <section className="space-y-4 pt-4">
          <div>
            <span className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider font-mono">
              METHODOLOGY
            </span>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
              Bridging Data Engineering & Business Decisions
            </h3>
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-[#e11d48] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900">Business Intelligence & Dashboards</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Crafting structured KPI visualization stores that calculate parameters and reveal quantitative metrics at a glance.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900">SQL & Relational Databases</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Writing performant queries, window functions, and schema normalization to ensure data integrity and real-time retrieval.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900">Python Data Wrangling</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Automating ETL, sanitizing irregular records in Pandas, and engineering features for statistical and exploratory research.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. EDUCATION & MILESTONES SECTION                                         */}
        {/* ========================================================================= */}
        <section id="education" className="space-y-5 pt-4">
          
          <div>
            <span className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider font-mono">
              FOUNDATION
            </span>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Education & Milestones</h3>
          </div>

          {/* Education Timeline */}
          <div className="space-y-4 pl-3 border-l-2 border-stone-200 ml-2">
            
            {/* Timeline Item 1 */}
            <div className="relative pl-6 space-y-1">
              <span className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#e11d48] ring-4 ring-rose-100"></span>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-stone-900">
                  Bachelor of Computer Applications (BCA)
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-[#e11d48] font-bold">
                  2023 - 2026
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">Presidency College, Bengaluru</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                Coursework: Database Management Systems, Data Structures, Applied Statistics, Business Analytics.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-6 space-y-1">
              <span className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-stone-900">
                  12th / PUC High School (Science)
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                  86% Distinction
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">Physics, Mathematics & Computer Science</p>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-6 space-y-1">
              <span className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100"></span>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-stone-900">
                  Secondary School Education (Class 10)
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                  91% First Class
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">ICSE Board Curriculum</p>
            </div>

          </div>

          {/* 4 Credential Milestone Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <GraduationCap className="w-4 h-4 text-[#e11d48]" />
              <p className="text-xs font-bold text-stone-900">Presidency College</p>
              <p className="text-[11px] text-stone-500">Technical Foundation: SQL, Python, Excel & BI</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <Award className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-bold text-stone-900">NCC Sergeant Rank</p>
              <p className="text-[11px] text-stone-500">National Cadet Corps "B" Cert: Leadership & drill</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-bold text-stone-900">Academic Honors</p>
              <p className="text-[11px] text-stone-500">Top percentile in analytical design & schemas</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-1">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <p className="text-xs font-bold text-stone-900">Problem Solving</p>
              <p className="text-[11px] text-stone-500">2nd place Inter-College IT Quiz & Capstone</p>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 9. CURRICULUM VITAE & RESUME CARD                                         */}
        {/* ========================================================================= */}
        <section id="resume" className="space-y-4 pt-4">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e11d48] border border-rose-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-stone-900">Curriculum Vitae</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700">
                    VERIFIED 2026
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Specialized in data analytics, database engineering, and business intelligence.
                </p>
              </div>
            </div>

            {/* Dual Actions: Quick View and Download PDF */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => setIsResumeUnlocked(!isResumeUnlocked)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isResumeUnlocked ? <EyeOff className="w-3.5 h-3.5 text-stone-600" /> : <Eye className="w-3.5 h-3.5 text-stone-600" />}
                <span>{isResumeUnlocked ? 'Hide Resume' : 'Quick View'}</span>
              </button>

              <a
                href="/api/resume/download-file"
                download="Sagar_Singh_Resume.pdf"
                onClick={onDownloadResume}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>

            {/* Unlocked Resume Document Inline Preview */}
            {isResumeUnlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-3 pt-3"
              >
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="font-bold text-stone-900 text-sm">{profile.name} · Official CV</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">Document Verified</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>Career Profile:</strong> Data Analyst with strong technical background in Power BI, Advanced Excel, MySQL, and Python. 
                  Demonstrated ability in constructing KPI dashboards, analyzing 50,000+ data rows ($2.4M volume), and building automated ETL pipelines.
                </p>
                <p className="text-[11px]">
                  <strong>Key Credentials:</strong> BCA 2026 (Presidency College, Bengaluru), NCC Sergeant 'B' Certificate, 2nd Place Inter-College IT Quiz.
                </p>
              </motion.div>
            )}

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 10. LET'S CONNECT (CONTACT SECTION)                                       */}
        {/* ========================================================================= */}
        <section id="contact" className="space-y-5 pt-4">
          
          <div>
            <span className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider font-mono">
              REACH OUT DIRECTLY
            </span>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Let's Connect</h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Have an open position or project inquiry? I generally respond within 1-2 hours.
            </p>
          </div>

          {/* Direct Communication Channels */}
          <div className="space-y-2.5">
            {/* Email */}
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-rose-400/60 transition-all text-xs text-stone-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#e11d48] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-stone-400 font-bold uppercase">PRIMARY EMAIL</p>
                  <p className="font-bold text-stone-900">{profile.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#e11d48] font-bold">Mailto ↗</span>
            </a>

            {/* Phone & WhatsApp */}
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-stone-400 font-bold uppercase">PHONE & WHATSAPP</p>
                    <p className="font-bold text-stone-900">{profile.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  Direct Line
                </span>
              </div>

              {/* Dual Action Buttons: Phone Call & Instant WhatsApp Chat */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                  className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call Phone</span>
                </a>

                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Sagar, I reviewed your Data Analytics portfolio and would like to connect regarding an opportunity!')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.884 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs text-xs text-stone-800">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-stone-400 font-bold uppercase">LOCATION</p>
                <p className="font-bold text-stone-900">{profile.location || 'Bengaluru, Karnataka, India'}</p>
              </div>
            </div>
          </div>

          {/* Live Contact Form */}
          <form
            onSubmit={handleContactSubmit}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-md space-y-4"
          >
            <h4 className="text-sm font-bold text-stone-900">Direct Message</h4>

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

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 font-mono">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Sharma"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-[#e11d48]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 font-mono">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="maya@company.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-[#e11d48]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 font-mono">Subject *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Data Analytics Opportunity / Technical Inquiry"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-[#e11d48]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 font-mono">Message Details *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your team or project requirements..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-[#e11d48]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{formLoading ? 'Transmitting In Realtime...' : 'Send Direct Message'}</span>
            </button>
          </form>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold shadow-xs hover:border-[#e11d48] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>LinkedIn</span>
            </a>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold shadow-xs hover:border-[#e11d48] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-stone-800" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="text-center pt-3 pb-6 text-[11px] text-stone-400 font-mono">
            © 2026 Sagar Singh · Built for Smooth Execution
          </div>

        </section>

      </main>

      {/* ========================================================================= */}
      {/* 11. MOBILE STICKY BOTTOM DOCK (EXACT MATCH TO STITCH TEMPLATE)            */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 px-6 py-2.5 flex items-center justify-around shadow-lg md:hidden">
        <a href="#hero" className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#e11d48] transition-colors">
          <span className="text-xs">🏠</span>
          <span className="text-[10px] font-bold">Home</span>
        </a>
        <a href="#skills" className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#e11d48] transition-colors">
          <span className="text-xs">⚡</span>
          <span className="text-[10px] font-bold">Skills</span>
        </a>
        <a href="#projects" className="flex flex-col items-center gap-0.5 text-[#e11d48] font-bold">
          <span className="text-xs">📁</span>
          <span className="text-[10px] font-bold">Projects</span>
        </a>
        <a href="#resume" className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#e11d48] transition-colors">
          <span className="text-xs">📄</span>
          <span className="text-[10px] font-bold">Resume</span>
        </a>
        <a href="#contact" className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#e11d48] transition-colors">
          <span className="text-xs">✉️</span>
          <span className="text-[10px] font-bold">Contact</span>
        </a>
      </nav>

      {/* Case Study Full Modal */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

    </div>
  );
};
