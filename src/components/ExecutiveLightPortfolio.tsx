import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Mail, MapPin, Linkedin, Github, Download,
  ChevronRight, ChevronLeft, CheckCircle2,
  Volume2, VolumeX,
  TrendingUp, Database, Code2, Send,
  AlertCircle, Moon, FileText, Table,
  Phone, Sparkles, Layers, Play,
  BarChart3, Activity, Cpu, ExternalLink, ArrowRight,
  GraduationCap, Award, Building2, Binary, Home, FolderGit2
} from 'lucide-react';
import { Profile, Skill, Project, Education, Achievement } from '../types';
import { ProfessionalPhotoAvatar } from './ProfessionalPhotoAvatar';
import { Sagar3DModelCanvas } from './Sagar3DModelCanvas';
import { CaseStudyModal } from './CaseStudyModal';
import { StitchLightBackground } from './StitchLightBackground';
import { DemoVideoModal } from './DemoVideoModal';
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

  // Demo Video Modal State
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Selected Project for Case Study Modal
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Stack Matrix Filter Tab
  const [activeStackTab, setActiveStackTab] = useState<'ALL' | 'BI & Analytics' | 'Databases' | 'Programming'>('ALL');

  // Project Category Filter & Flow Carousel State
  const [activeProjectFilter, setActiveProjectFilter] = useState<'ALL' | 'BI Dashboards' | 'Python ETL'>('ALL');
  const [projectViewMode, setProjectViewMode] = useState<'flow' | 'grid'>('flow');
  const [isProjectsHovered, setIsProjectsHovered] = useState(false);
  const scrollProjectsRef = useRef<HTMLDivElement>(null);
  const isDraggingProjectsRef = useRef(false);
  const startXProjectsRef = useRef(0);
  const scrollLeftStartProjectsRef = useRef(0);
  const hasDraggedProjectsRef = useRef(false);

  // Stepping controls for carousel
  const stepProjects = (dir: 'left' | 'right') => {
    const el = scrollProjectsRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  // Continuous auto-flow loop: moves right-to-left, pauses completely on hover or drag
  useEffect(() => {
    if (projectViewMode !== 'flow') return;
    const el = scrollProjectsRef.current;
    if (!el) return;

    let animId: number;
    const tick = () => {
      if (el && !isProjectsHovered && !isDraggingProjectsRef.current) {
        el.scrollLeft += 0.95;
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 200) {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth;
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [projectViewMode, isProjectsHovered]);

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

  // Stack Matrix Skills Data
  const stackItems = useMemo(() => [
    {
      name: 'Power BI',
      category: 'BI & Analytics',
      desc: 'DAX, Star Schema, Power BI Service, Power Query',
      icon: BarChart3,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      name: 'Advanced Excel',
      category: 'BI & Analytics',
      desc: 'VLOOKUP, INDEX-MATCH, Financial Modeling, Charts & Pivots',
      icon: Table,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Python',
      category: 'Programming',
      desc: 'Pandas, NumPy, Matplotlib, Data Wrangling, Scikit-learn',
      icon: Code2,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      name: 'Pandas',
      category: 'Programming',
      desc: 'DataFrames, GroupBy, Clean Datasets, ETL Transform',
      icon: Layers,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      name: 'MySQL',
      category: 'Databases',
      desc: 'Complex Joins, Subqueries, Normalization, Query Optimization',
      icon: Database,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      name: 'ETL Pipelines',
      category: 'Databases',
      desc: 'Automated Data Ingestion, Cleaning Pipelines, Airflow, API Extraction',
      icon: Activity,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      name: 'FastAPI',
      category: 'Programming',
      desc: 'Backend Restful APIs, Endpoints, Async Support, Swagger Docs',
      icon: Cpu,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      name: 'Statistical Modeling',
      category: 'BI & Analytics',
      desc: 'Linear Regression, ANOVA, Hypothesis Testing, SciPy',
      icon: TrendingUp,
      color: 'text-rose-500 bg-rose-50 border-rose-200',
    },
  ], []);

  const filteredStackItems = useMemo(() => {
    if (activeStackTab === 'ALL') return stackItems;
    return stackItems.filter(item => item.category === activeStackTab);
  }, [stackItems, activeStackTab]);

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

  const carouselProjects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    return [...filteredProjects, ...filteredProjects, ...filteredProjects];
  }, [filteredProjects]);

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
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a] relative selection:bg-rose-500/20 selection:text-rose-600 font-sans-inter">
      
      {/* 3D Tech Background (Isometric DB Cylinders, Cubes, Floating Polyhedrons & Mouse Parallax) */}
      <StitchLightBackground />

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (MATCHING STITCH SCREENSHOT c46cca94)                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#faf9f6]/92 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 md:px-8 py-3.5 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Identity & Availability Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                Sagar Singh
              </span>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            </div>
            
            <span className="hidden xs:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
              Available for Opportunities
            </span>
          </div>

          {/* Action Icons on Right */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Demo Video Modal Trigger */}
            <button
              onClick={() => setIsDemoOpen(true)}
              title="Watch Live 3D Avatar & System Video Demo"
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/90 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 text-xs font-mono font-semibold"
              aria-label="Open Demo Video"
            >
              <Play className="w-3.5 h-3.5 fill-current text-rose-500 shrink-0" />
              <span>Demo</span>
            </button>

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
              title="Switch to 3D Dark Mode"
              className="p-2 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Moon className="w-4 h-4 text-stone-700 hover:text-amber-500 transition-colors" />
              <span className="text-[11px] font-mono font-semibold text-stone-700 hidden sm:inline">3D Dark</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-24 space-y-12 sm:space-y-14 relative z-10">

        {/* ========================================================================= */}
        {/* 2. HERO SECTION - SAGAR SINGH WITH 3D BLINKING PROFILE AVATAR             */}
        {/* ========================================================================= */}
        <section id="hero" className="pt-2 space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Intro, Headline, Tags & Action Buttons */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              {/* Availability Pill */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Available for Opportunities
                </span>
              </div>

              {/* Main Headline & Intro */}
              <div className="space-y-3">
                <h1 className="font-serif-luxury text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold text-stone-900 tracking-tight leading-[1.08]">
                  Sagar <span className="text-[#e11d48]">Singh</span>
                </h1>

                <p className="text-sm xs:text-base sm:text-lg text-stone-600 font-medium leading-relaxed max-w-xl">
                  BCA 2026 Graduate specializing in <strong>Data Analytics, Power BI, Advanced Excel, MySQL, and Python</strong>. 
                  Turning complex data into clear execution.
                </p>
              </div>

              {/* Location & Credentials Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium text-stone-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#e11d48]" />
                  Bengaluru, IN
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e11d48]" />
                  Presidency College (2026)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs font-mono font-bold text-stone-800">
                  <Award className="w-3.5 h-3.5 text-[#e11d48]" />
                  BCA
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>EXPLORE PROJECTS</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>GET IN TOUCH</span>
                </a>
              </div>
            </div>

            {/* Right Column: 3D Living Profile Avatar */}
            <div className="md:col-span-5 flex flex-col items-center justify-center pt-2 md:pt-0">
              <div className="relative group">
                {/* Soft executive light shadow ring backdrop */}
                <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-2xl transform group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                
                <Sagar3DModelCanvas
                  sizeClassName="w-52 h-52 xs:w-60 xs:h-60 sm:w-68 sm:h-68 md:w-72 md:h-72"
                />
              </div>

              {/* Status pill under avatar */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-600 text-[11px] font-mono shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>3D Interactive Digital Twin · Move to Tilt</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4 STAT METRIC BOXES (2X2 GRID MATCHING SCREENSHOT)                        */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
            
            {/* Box 1: Degree */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                DEGREE
              </span>
              <p className="text-2xl font-black text-[#e11d48] tracking-tight">
                BCA '26
              </p>
              <p className="text-xs text-stone-500 font-medium">
                Presidency College
              </p>
            </div>

            {/* Box 2: Evaluation */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                EVALUATION
              </span>
              <p className="text-2xl font-black text-emerald-600 tracking-tight">
                5+ Proj
              </p>
              <p className="text-xs text-stone-500 font-medium">
                Enterprise Ready Built
              </p>
            </div>

            {/* Box 3: Records Processed */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                RECORDS PROCESSED
              </span>
              <p className="text-2xl font-black text-stone-900 tracking-tight">
                150K+
              </p>
              <p className="text-xs text-stone-500 font-medium">
                Structured & Unstructured
              </p>
            </div>

            {/* Box 4: Accuracy */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                ACCURACY
              </span>
              <p className="text-2xl font-black text-emerald-600 tracking-tight">
                98.5%
              </p>
              <p className="text-xs text-stone-500 font-medium">
                ML / Model Accuracy
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. TECHNICAL STACK (STACK MATRIX)                                         */}
        {/* ========================================================================= */}
        <section id="skills" className="space-y-6 pt-4">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48]">
                STACK MATRIX
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
                Technical Stack
              </h2>
            </div>

            <a
              href="#resume"
              className="text-xs font-mono font-semibold text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View Docs & Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'BI & Analytics', 'Databases', 'Programming'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveStackTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono transition-all cursor-pointer ${
                  activeStackTab === tab
                    ? 'bg-[#e11d48] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80 shadow-2xs'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 8 Skill Matrix Cards (2 Columns on mobile, 4 Columns on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredStackItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-rose-300 hover:shadow-sm transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase pt-1 block">
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Core Specialisms Pills at Bottom of Stack */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span>
              CORE SPECIALISM: DATA STRUCT & ALGORITHMS
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              PREDICTIVE ANALYTICS
            </span>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. FEATURED ANALYTICAL PROJECTS (INTERACTIVE 3D FLOW STREAM & GRID)       */}
        {/* ========================================================================= */}
        <section id="projects" className="space-y-6 pt-4">
          
          {/* Header with Title, Controls, and Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48]">
                PORTFOLIO SHOWCASE
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
                Featured Projects
              </h2>
              <p className="text-xs font-mono text-stone-500 pt-1">
                Continuous 3D flow • Hover to freeze • Drag or swipe left & right
              </p>
            </div>

            {/* Stepping Arrows & View Mode & Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Stepping Arrow Controls for Flow View */}
              {projectViewMode === 'flow' && (
                <div className="flex items-center gap-1 bg-white border border-stone-200/90 rounded-full p-1 shadow-2xs">
                  <button
                    onClick={() => stepProjects('left')}
                    title="Scroll Left"
                    className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all cursor-pointer active:scale-90"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#e11d48]" />
                  </button>
                  <button
                    onClick={() => stepProjects('right')}
                    title="Scroll Right"
                    className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all cursor-pointer active:scale-90"
                  >
                    <ChevronRight className="w-4 h-4 text-[#e11d48]" />
                  </button>
                </div>
              )}

              {/* View Toggle: Flow Stream vs Grid */}
              <div className="flex items-center p-1 rounded-full bg-white border border-stone-200/90 shadow-2xs">
                <button
                  onClick={() => setProjectViewMode('flow')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    projectViewMode === 'flow'
                      ? 'bg-[#e11d48] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Flow</span>
                </button>
                <button
                  onClick={() => setProjectViewMode('grid')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    projectViewMode === 'grid'
                      ? 'bg-[#e11d48] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>Grid</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5">
                {(['ALL', 'BI Dashboards', 'Python ETL'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveProjectFilter(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeProjectFilter === tab
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80 shadow-2xs'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Render Flow Stream Mode (Smooth continuous auto-flow, pauses on hover, drag/swipe left-right) */}
          {projectViewMode === 'flow' ? (
            <div
              className="relative w-full overflow-hidden py-3"
              onMouseEnter={() => setIsProjectsHovered(true)}
              onMouseLeave={() => {
                setIsProjectsHovered(false);
                isDraggingProjectsRef.current = false;
              }}
              onMouseDown={(e) => {
                const el = scrollProjectsRef.current;
                if (!el) return;
                isDraggingProjectsRef.current = true;
                hasDraggedProjectsRef.current = false;
                startXProjectsRef.current = e.pageX - el.offsetLeft;
                scrollLeftStartProjectsRef.current = el.scrollLeft;
              }}
              onMouseMove={(e) => {
                if (!isDraggingProjectsRef.current) return;
                const el = scrollProjectsRef.current;
                if (!el) return;
                e.preventDefault();
                const x = e.pageX - el.offsetLeft;
                const walk = (x - startXProjectsRef.current) * 1.5;
                if (Math.abs(walk) > 5) {
                  hasDraggedProjectsRef.current = true;
                }
                el.scrollLeft = scrollLeftStartProjectsRef.current - walk;
              }}
              onMouseUp={() => {
                isDraggingProjectsRef.current = false;
              }}
              onTouchStart={(e) => {
                const el = scrollProjectsRef.current;
                if (!el || !e.touches[0]) return;
                setIsProjectsHovered(true);
                isDraggingProjectsRef.current = true;
                hasDraggedProjectsRef.current = false;
                startXProjectsRef.current = e.touches[0].pageX - el.offsetLeft;
                scrollLeftStartProjectsRef.current = el.scrollLeft;
              }}
              onTouchMove={(e) => {
                if (!isDraggingProjectsRef.current || !e.touches[0]) return;
                const el = scrollProjectsRef.current;
                if (!el) return;
                const x = e.touches[0].pageX - el.offsetLeft;
                const walk = (x - startXProjectsRef.current) * 1.5;
                if (Math.abs(walk) > 5) {
                  hasDraggedProjectsRef.current = true;
                }
                el.scrollLeft = scrollLeftStartProjectsRef.current - walk;
              }}
              onTouchEnd={() => {
                isDraggingProjectsRef.current = false;
                setIsProjectsHovered(false);
              }}
            >
              {/* Side Fade Vignettes */}
              <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#faf9f6] to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#faf9f6] to-transparent z-20 pointer-events-none" />

              {/* Horizontal Scroll Track */}
              <div
                ref={scrollProjectsRef}
                className="flex items-center gap-5 sm:gap-6 overflow-x-hidden no-scrollbar w-full select-none cursor-grab active:cursor-grabbing py-2"
                style={{ scrollBehavior: 'auto' }}
              >
                {carouselProjects.map((proj, idx) => (
                  <div
                    key={`${proj.id || proj.title}-${idx}`}
                    className="group relative w-[84vw] max-w-sm sm:w-[360px] md:w-[380px] shrink-0 rounded-3xl bg-white border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-400 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Mockup */}
                    <div className="relative h-44 sm:h-48 md:h-52 bg-stone-100 overflow-hidden border-b border-stone-100">
                      <img
                        src={proj.thumbnailUrl || '/projects/sales-dashboard.png'}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/projects/sales-dashboard.png';
                        }}
                      />
                      {proj.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#e11d48] text-white shadow-xs">
                          Featured & Tracked
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

                        <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-900 tracking-tight group-hover:text-[#e11d48] transition-colors line-clamp-1">
                          {proj.title}
                        </h3>

                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                          {proj.shortDescription || proj.caseStudy?.overview || ''}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-600 flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified Capstone
                        </span>

                        <button
                          onClick={(e) => {
                            if (hasDraggedProjectsRef.current) return;
                            e.stopPropagation();
                            setSelectedCaseStudy(proj);
                          }}
                          className="text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 font-bold cursor-pointer transition-colors"
                        >
                          <span>Explore Architecture</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Render Static Grid Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {filteredProjects.map((proj, idx) => (
                <div
                  key={`${proj.id || proj.title}-${idx}`}
                  className="rounded-3xl bg-white border border-stone-200/90 overflow-hidden shadow-xs hover:border-rose-300 transition-all flex flex-col group"
                >
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
                        Featured & Tracked
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
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

                      <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-900 tracking-tight group-hover:text-[#e11d48] transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {proj.shortDescription || proj.caseStudy?.overview || ''}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-600 flex items-center gap-1 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Capstone
                      </span>

                      <button
                        onClick={() => setSelectedCaseStudy(proj)}
                        className="text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 font-bold cursor-pointer transition-colors"
                      >
                        <span>Explore Architecture</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* 5. METHODOLOGY: BRIDGING DATA ENGINEERING & BUSINESS DECISIONS             */}
        {/* ========================================================================= */}
        <section id="methodology" className="space-y-6 pt-4">
          
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48]">
              METHODOLOGY
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Bridging Data Engineering & Business Decisions
            </h2>
          </div>

          <div className="space-y-3.5">
            
            {/* Step 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-start gap-4 hover:border-rose-300 transition-all">
              <div className="w-8 h-8 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Business Intelligence & Dashboards
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Crafting executive KPI interfaces that eliminate guesswork and reveal quantitative trends at a glance.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-start gap-4 hover:border-emerald-300 transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  SQL & Relational Databases
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Writing query plans, complex joins, subqueries, partitions, and schema normalization to ensure data streams run with zero friction.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-start gap-4 hover:border-amber-300 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Python Data Wrangling
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Automating ETL, sanitizing irregular unstructured flows, and engineering features for statistical and exploratory research.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 6. FOUNDATION: EDUCATION & MILESTONES                                      */}
        {/* ========================================================================= */}
        <section id="education" className="space-y-6 pt-4">
          
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48]">
              FOUNDATION
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Education & Milestones
            </h2>
          </div>

          {/* Timeline */}
          <div className="space-y-5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200 pl-8">
            
            {/* Timeline Item 1 */}
            <div className="relative space-y-1">
              <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-[#e11d48] border-2 border-white shadow-2xs"></div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  Bachelor of Computer Applications (BCA)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-100 text-rose-700">
                  Class of '26
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">Presidency College, Bengaluru</p>
              <p className="text-xs text-stone-500">
                Focusing on data structures, database management systems, applied statistics, and enterprise software engineering.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative space-y-1">
              <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs"></div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  Higher Secondary School (+2)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-700">
                  Science Stream
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">National Convent School</p>
              <p className="text-xs text-stone-500">
                Physics, Chemistry, Mathematics, and Computer Science foundation.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative space-y-1">
              <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs"></div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  Secondary Education (Class X)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-100 text-amber-700">
                  91% with Distinction
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">Universal Convent School</p>
              <p className="text-xs text-stone-500">
                Foundational sciences and analytical mathematics training.
              </p>
            </div>

          </div>

          {/* 4 Feature Milestone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#e11d48] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Presidency College (B-School)</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Technical foundation spanning Web, DB, and Applied Stats.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">SQL & Database Arc</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Relational schema design, normalization, ACID safety.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Power BI Visualization</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Executive suite reporting with DAX modeling.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Binary className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Statistical Modeling</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Multivariate analysis, testing hypotheses with Python.
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 7. CURRICULUM VITAE (VERIFIED DOSSIER BANNER)                              */}
        {/* ========================================================================= */}
        <section id="resume" className="pt-2">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e11d48] border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                    Curriculum Vitae
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    VERIFIED DOSSIER
                  </span>
                </div>
                <p className="text-xs text-stone-500 max-w-md">
                  Comprehensive dossier detailing professional experience, technical competencies, and project portfolio.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-center">
              <a
                href="/Sagar_Singh_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs border border-stone-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview Dossier</span>
              </a>

              <button
                onClick={onDownloadResume}
                className="px-5 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs tracking-wide shadow-sm shadow-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 8. DISCUSSION: LET'S CONNECT                                               */}
        {/* ========================================================================= */}
        <section id="contact" className="py-6 sm:py-8 space-y-6">
          
          <div className="text-center space-y-1.5 max-w-lg mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48] block">
              DISCUSSION
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Let's Connect
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Have an open position or project inquiry? I typically respond within 1-2 hours.
            </p>
          </div>

          {/* Contact Cards (Email, Phone & WhatsApp, Location) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Email */}
            <a
              href="mailto:sirroshan999@gmail.com"
              className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-rose-300 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e11d48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">Primary Email</span>
                <span className="text-xs font-bold text-stone-800 truncate block">sirroshan999@gmail.com</span>
              </div>
            </a>

            {/* Phone & WhatsApp Card with direct options to Call and WhatsApp */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between gap-3 group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">Phone & WhatsApp Line</span>
                  <span className="text-xs font-bold text-stone-800 truncate block select-all">+91 78925 70634</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                <a
                  href="tel:+917892570634"
                  title="Make Direct Phone Call"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/917892570634?text=Hi%20Sagar%2C%20I%20reviewed%20your%20Data%20Analytics%20portfolio%20and%20would%20like%20to%20connect%20regarding%20an%20opportunity!"
                  target="_blank"
                  rel="noreferrer"
                  title="Instant WhatsApp Message"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#128C7E] font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.884 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">Location</span>
                <span className="text-xs font-bold text-stone-800 truncate block">Bengaluru, Karnataka, IN</span>
              </div>
            </div>

          </div>

          {/* Inner Form Card */}
          <form
            onSubmit={handleContactSubmit}
            className="max-w-2xl mx-auto p-5 sm:p-7 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4"
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
                  placeholder="e.g. Maya Sharma"
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
                  placeholder="maya@company.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Row 2: Subject / Scope */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 font-mono">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Data Analysis Query / Freelance Project"
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
                placeholder="Tell me about your team or project requirements..."
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
              <span>{formLoading ? 'Transmitting Message...' : 'Send Message'}</span>
            </button>
          </form>

        </section>

      </main>

      {/* ========================================================================= */}
      {/* 9. FOOTER BAR                                                             */}
      {/* ========================================================================= */}
      <footer className="border-t border-stone-200/80 bg-white/92 backdrop-blur-md py-6 px-4 sm:px-6 md:px-8 text-xs font-mono text-stone-500 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div>
            © 2025 Sagar Singh · Available for immediate capture.
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
          href="#skills"
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
          href="#resume"
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

      {/* Pure Video Demo Modal (No text, pure video only) */}
      <DemoVideoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

    </div>
  );
};
