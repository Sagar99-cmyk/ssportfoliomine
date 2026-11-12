import React, { useState, useMemo } from 'react';
import { ExternalLink, Github, Linkedin, Youtube, FileText, Globe, Search, Layers, Pause, Play, Code2, Sparkles, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { CaseStudyModal } from './CaseStudyModal';
import { getTechLogo } from './TechLogos';
import { useTheme } from '../context/ThemeContext';
import { FeaturedVideoDemo } from './FeaturedVideoDemo';

interface ProjectsGalleryProps {
  projects: Project[];
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Major Project': { bg: 'rgba(225,29,72,0.15)', text: '#f43f5e', border: 'rgba(225,29,72,0.3)' },
  'Minor Project': { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  'Micro/Mini Project': { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
};

// Extract or generate verified domain skills applied for each project
const getProjectSkills = (project: Project): string[] => {
  const pTitle = project.title || '';
  const pDesc = project.shortDescription || (project as any).short_description || '';
  const pTechs = Array.isArray(project.technologies) ? project.technologies.join(' ') : '';
  const t = (pTitle + ' ' + pDesc + ' ' + pTechs).toLowerCase();
  const skills: string[] = [];

  if (t.includes('power bi') || t.includes('sales') || t.includes('dashboard')) {
    skills.push('DAX Measures', 'Data Modeling', 'Interactive KPI Cards', 'ETL Pipeline', 'Business Intelligence');
  } else if (t.includes('pg rental') || t.includes('rental') || t.includes('supabase') || t.includes('react')) {
    skills.push('Full-Stack Web Dev', 'Relational Schemas', 'Role-Based Auth', 'CRUD Operations', 'Cloud Database');
  } else if (t.includes('excel')) {
    skills.push('Pivot Tables & Charts', 'VLOOKUP / XLOOKUP', 'INDEX & MATCH', 'Data Cleansing', 'Automated Workflows');
  } else if (t.includes('python') || t.includes('pandas')) {
    skills.push('Data Wrangling', 'Pandas & NumPy', 'Statistical Aggregation', 'Data Cleansing');
  } else if (t.includes('mysql') || t.includes('sql')) {
    skills.push('Complex Joins', 'Window Functions', 'Group By & Aggregations', 'Schema Optimization');
  } else {
    skills.push('Data Analytics', 'Business Intelligence', 'Problem Solving');
  }

  return skills;
};

// Determine if a technology has a valid recognized logo from skills
const hasTechLogo = (tech: string): boolean => {
  const t = (tech || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!t) return false;
  return Boolean(
    t.includes('html') || t.includes('css') || t.includes('javascript') || t === 'js' ||
    t === 'c' || t.startsWith('cprog') || (t.includes('java') && !t.includes('script')) ||
    t.includes('python') || t.includes('bootstrap') || t.includes('office') || t.includes('excel') ||
    t.includes('react') || t.includes('express') || t.includes('powerbi') || t.includes('bi') ||
    t.includes('mysql') || t.includes('sql') || t.includes('postgres') || t.includes('tableau') ||
    t.includes('panda') || t.includes('git') || t.includes('supabase') || t.includes('node') ||
    t.includes('typescript') || t === 'ts' || t.includes('dax') || t.includes('tailwind')
  );
};

// Render crisp, authentic technology vector logos and styled pills
const renderTechBadge = (tech: string, isLight?: boolean) => {
  return (
    <span
      key={tech}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg border shadow-xs transition-all hover:scale-105 ${
        isLight
          ? 'border-stone-200 bg-stone-100 text-stone-800 hover:border-rose-400'
          : 'border-white/[0.08] bg-white/[0.04] text-stone-200 hover:border-rose-500/40'
      }`}
    >
      {getTechLogo(tech, undefined, 'w-3.5 h-3.5 shrink-0')}
      <span>{tech}</span>
    </span>
  );
};

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ projects }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeTab, setSelectedTypeTab] = useState<'All' | 'Major' | 'Minor' | 'Micro/Mini'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'flow' | 'grid'>('flow');
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const mouseRatioRef = React.useRef<number | null>(null); // -1 (far left) to +1 (far right)
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftStartRef = React.useRef(0);

  const scrollProjects = (dir: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(p => p.category)))],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = (searchQuery || '').trim().toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      const pDesc = (p.shortDescription || (p as any).short_description || '').toLowerCase();
      const pTechs = Array.isArray(p.technologies) ? p.technologies : [];
      const matchesSearch =
        !q ||
        pTitle.includes(q) ||
        pDesc.includes(q) ||
        pTechs.some(t => (t || '').toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      const pType = p.projectType || (p as any).project_type || '';
      let matchesType = true;
      if (selectedTypeTab === 'Major') {
        matchesType = pType.includes('Major') || pTitle.includes('major');
      } else if (selectedTypeTab === 'Minor') {
        matchesType = pType.includes('Minor') || pTitle.includes('minor');
      } else if (selectedTypeTab === 'Micro/Mini') {
        matchesType = pType.includes('Micro') || pType.includes('Mini') || (!pType.includes('Major') && !pType.includes('Minor'));
      }

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [projects, searchQuery, selectedCategory, selectedTypeTab]);

  // Duplicate for seamless infinite right-to-left loop
  const flowProjects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    return [...filteredProjects, ...filteredProjects, ...filteredProjects];
  }, [filteredProjects]);

  // Animation Loop: Auto right-to-left flow when not hovered, completely pauses on hover, and dragging moves smoothly
  React.useEffect(() => {
    if (viewMode !== 'flow') return;
    const el = scrollContainerRef.current;
    if (!el) return;

    let animId: number;

    const tick = () => {
      if (el && !isDraggingRef.current && !isPausedByUser && !isHovered) {
        // Continuous, smooth slow flow only when NOT hovering
        el.scrollLeft += 1.0;

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
  }, [viewMode, isHovered, isPausedByUser, filteredProjects.length]);

  return (
    <section id="projects" className="py-20 relative overflow-hidden select-none">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose-950/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-3 max-w-2xl text-left"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase border ${
              isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <Layers className="w-3.5 h-3.5" />
              <span>Engineered Solutions & Capstones</span>
            </div>

            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}>
              Major, Minor & Micro Projects
            </h2>

            <p className={`text-sm sm:text-base ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              Interactive continuous showcase. Move your mouse left or right over the cards to navigate the stream, or hover over any project to inspect.
            </p>
          </motion.div>

          {/* View Mode Toggle + Left/Right Navigation + Pause Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Left / Right Interactive Slider Buttons */}
            {viewMode === 'flow' && (
              <div className={`flex items-center gap-1 p-1 rounded-xl border backdrop-blur-md ${
                isLight ? 'bg-stone-100 border-stone-200' : 'bg-stone-900/60 border-white/[0.08]'
              }`}>
                <button
                  onClick={() => scrollProjects('left')}
                  title="Slide Left"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer active:scale-95 ${
                    isLight ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-200' : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 text-rose-500" />
                </button>
                <button
                  onClick={() => scrollProjects('right')}
                  title="Slide Right"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer active:scale-95 ${
                    isLight ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-200' : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            )}

            {/* View Mode: Flow vs Grid */}
            <div className={`flex items-center p-1 rounded-xl border backdrop-blur-md ${
              isLight ? 'bg-stone-100 border-stone-200' : 'bg-stone-900/60 border-white/[0.08]'
            }`}>
              <button
                onClick={() => setViewMode('flow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'flow'
                    ? (isLight ? 'bg-white text-stone-900 shadow-xs' : 'bg-rose-900/50 text-rose-300 border border-rose-500/40 shadow-sm')
                    : (isLight ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
                }`}
              >
                <Layers className="w-3 h-3 text-rose-500" />
                <span>Flow Stream</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? (isLight ? 'bg-white text-stone-900 shadow-xs' : 'bg-rose-900/50 text-rose-300 border border-rose-500/40 shadow-sm')
                    : (isLight ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
                }`}
              >
                <span>Grid View</span>
              </button>
            </div>

            {/* Pause/Resume Auto-Flow */}
            {viewMode === 'flow' && (
              <button
                onClick={() => setIsPausedByUser(!isPausedByUser)}
                className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                  isLight ? 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200' : 'bg-stone-900/60 border-white/[0.08] text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
                title={isPausedByUser ? 'Resume Auto-Flow' : 'Pause Auto-Flow'}
              >
                {isPausedByUser ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* TYPE TABS: Major / Minor / Micro */}
        <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border w-fit ${
          isLight ? 'bg-white/95 border-stone-200 shadow-2xs' : 'bg-stone-900/90 border-stone-800'
        }`}>
          {[
            { id: 'All', label: 'All Projects', count: projects.length },
            { id: 'Major', label: 'Major Projects', count: projects.filter(p => (p.projectType || (p as any).project_type || '').includes('Major') || (p.title || '').toLowerCase().includes('major')).length },
            { id: 'Minor', label: 'Minor Projects', count: projects.filter(p => (p.projectType || (p as any).project_type || '').includes('Minor') || (p.title || '').toLowerCase().includes('minor')).length },
            { id: 'Micro/Mini', label: 'Micro / Mini', count: projects.filter(p => (p.projectType || (p as any).project_type || '').includes('Micro') || (p.projectType || (p as any).project_type || '').includes('Mini')).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                selectedTypeTab === tab.id
                  ? (isLight ? 'bg-[#e11d48] text-white shadow-xs' : 'bg-rose-900/40 text-rose-300 border border-rose-500/40 shadow-sm')
                  : (isLight ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-100' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60')
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedTypeTab === tab.id
                  ? (isLight ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300')
                  : (isLight ? 'bg-stone-100 text-stone-600' : 'bg-stone-800 text-stone-500')
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects, skills, tools..."
              className={`pl-10 pr-4 py-2 text-xs rounded-xl outline-none border transition-colors w-64 ${
                isLight
                  ? 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 shadow-2xs focus:border-rose-400'
                  : 'bg-stone-900 border-stone-800 text-stone-200 placeholder:text-stone-500 focus:border-rose-500/50'
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? (isLight ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-2xs' : 'border-rose-500/50 bg-rose-500/10 text-rose-300')
                    : (isLight ? 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50 shadow-2xs' : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-300')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: INTERACTIVE MOUSE-CONTROLLED FLOW + CONTINUOUS SLOW STREAM        */}
        {/* ========================================================================= */}
        {viewMode === 'flow' ? (
          <div
            className="relative w-full overflow-hidden py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              isDraggingRef.current = false;
            }}
            onMouseDown={(e) => {
              const el = scrollContainerRef.current;
              if (!el) return;
              isDraggingRef.current = true;
              startXRef.current = e.pageX - el.offsetLeft;
              scrollLeftStartRef.current = el.scrollLeft;
            }}
            onMouseMove={(e) => {
              if (!isDraggingRef.current) return;
              const el = scrollContainerRef.current;
              if (!el) return;
              e.preventDefault();
              const x = e.pageX - el.offsetLeft;
              const walk = (x - startXRef.current) * 1.5;
              el.scrollLeft = scrollLeftStartRef.current - walk;
            }}
            onMouseUp={() => {
              isDraggingRef.current = false;
            }}
            onTouchStart={(e) => {
              const el = scrollContainerRef.current;
              if (!el || !e.touches[0]) return;
              setIsHovered(true);
              isDraggingRef.current = true;
              startXRef.current = e.touches[0].pageX - el.offsetLeft;
              scrollLeftStartRef.current = el.scrollLeft;
            }}
            onTouchMove={(e) => {
              if (!isDraggingRef.current || !e.touches[0]) return;
              const el = scrollContainerRef.current;
              if (!el) return;
              const x = e.touches[0].pageX - el.offsetLeft;
              const walk = (x - startXRef.current) * 1.5;
              el.scrollLeft = scrollLeftStartRef.current - walk;
            }}
            onTouchEnd={() => {
              isDraggingRef.current = false;
              setIsHovered(false);
            }}
          >
            {/* Side Fade Vignettes */}
            <div className={`absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r to-transparent z-20 pointer-events-none ${
              isLight ? 'from-[#faf9f6]' : 'from-[#09090b]'
            }`} />
            <div className={`absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l to-transparent z-20 pointer-events-none ${
              isLight ? 'from-[#faf9f6]' : 'from-[#09090b]'
            }`} />

            {/* Continuous Drifting Track (Cursor Controlled Left/Right & Infinite Auto-Flow) */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-6 overflow-x-hidden no-scrollbar w-full select-none cursor-grab active:cursor-grabbing"
              style={{
                scrollBehavior: 'auto',
              }}
            >
              {flowProjects.map((project, idx) => {
                const typeStyle = TYPE_COLORS[project.projectType || 'Major Project'] || TYPE_COLORS['Major Project'];

                return (
                  <div
                    key={`${project.id}-${idx}`}
                    className="group relative w-[85vw] max-w-sm sm:w-96 shrink-0 rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 cursor-pointer current-flow-card shadow-2xl"
                    style={{
                      background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 18, 28, 0.45)',
                      backdropFilter: 'blur(20px)',
                      borderColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = isLight ? 'rgba(225,29,72,0.45)' : 'rgba(225,29,72,0.6)';
                      (e.currentTarget as HTMLDivElement).style.background = isLight ? '#ffffff' : 'rgba(24, 20, 36, 0.58)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLDivElement).style.background = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 18, 28, 0.45)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Project Photo / Screenshot Banner with Hover Zoom */}
                    <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-stone-950 border-b border-white/5">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-900 to-stone-950 flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <Layers className="w-8 h-8 text-rose-500/60 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-mono text-stone-400 font-semibold">{project.title}</span>
                        </div>
                      )}

                      {/* Badges on Top of Photo */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span
                          className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md shadow-md"
                          style={{
                            background: typeStyle.bg,
                            color: typeStyle.text,
                            borderColor: typeStyle.border,
                          }}
                        >
                          {project.projectType || 'Project'}
                        </span>

                        <span className="text-[10px] font-mono font-semibold text-stone-200 bg-stone-950/85 px-2.5 py-0.5 rounded-md border border-stone-800 backdrop-blur-md">
                          {project.category}
                        </span>
                      </div>

                      {/* Bottom Gradient Fade */}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[rgba(15,15,20,0.98)] to-transparent pointer-events-none" />
                    </div>

                    {/* Project Title & Short Description */}
                    <div className={`p-5 space-y-2 border-b ${isLight ? 'border-stone-200' : 'border-white/5'}`}>
                      <h3 className={`text-base font-bold transition-colors line-clamp-2 ${
                        isLight ? 'text-stone-900 group-hover:text-rose-600' : 'text-white group-hover:text-rose-400'
                      }`}>
                        {project.title}
                      </h3>

                      <p className={`text-xs leading-relaxed line-clamp-3 ${
                        isLight ? 'text-stone-600' : 'text-stone-400'
                      }`}>
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Middle: Technologies (With Logos & Names) + Skills Used */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-end">
                      {/* Tech Badges with Authentic Vector Logos */}
                      <div className="space-y-1.5">
                        <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider ${
                          isLight ? 'text-stone-600' : 'text-stone-400'
                        }`}>
                          <Code2 className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>Technologies & Stack:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(project.technologies || []).filter(hasTechLogo).map(tech => renderTechBadge(tech, isLight))}
                        </div>
                      </div>

                      {/* Action Links Row (GitHub, Live Hosting, LinkedIn, Case Study) */}
                      <div className={`pt-3 flex items-center justify-between gap-2 border-t ${
                        isLight ? 'border-stone-200' : 'border-stone-800/80'
                      }`}>
                        
                        {/* Case Study Button */}
                        <button
                          onClick={() => setSelectedProject(project)}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer group-hover:translate-x-0.5 ${
                            isLight ? 'text-rose-600 hover:text-rose-700' : 'text-rose-400 hover:text-rose-300'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Case Study</span>
                          <span>→</span>
                        </button>

                        {/* Distinct External Options: GitHub, Hosting, LinkedIn */}
                        <div className="flex items-center gap-1.5">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-lg border transition-colors ${
                                isLight
                                  ? 'bg-stone-100 border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900'
                                  : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white'
                              }`}
                              title="GitHub Repository"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.liveDemoUrl && (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-lg border transition-colors ${
                                isLight
                                  ? 'bg-stone-100 border-stone-200 hover:border-rose-400 text-stone-700 hover:text-rose-600'
                                  : 'bg-stone-900 border-stone-800 hover:border-rose-500/40 text-stone-400 hover:text-rose-400'
                              }`}
                              title="Live Hosting Website"
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.linkedinUrl && (
                            <a
                              href={project.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-lg border transition-colors ${
                                isLight
                                  ? 'bg-stone-100 border-stone-200 hover:border-sky-400 text-stone-700 hover:text-sky-600'
                                  : 'bg-stone-900 border-stone-800 hover:border-sky-500/40 text-stone-400 hover:text-sky-400'
                              }`}
                              title="LinkedIn Project Post"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.youtubeUrl && (
                            <a
                              href={project.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-red-500/50 text-stone-400 hover:text-red-400 transition-colors"
                              title="YouTube Video Demo"
                            >
                              <Youtube className="w-3.5 h-3.5 text-red-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Navigation Helper Pill */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-stone-400">
              <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-rose-500 animate-ping'}`} />
              <span>
                {isHovered
                  ? '↔ Move cursor Left or Right to steer stream · Drag to scroll'
                  : '◀ Auto-flowing Right-to-Left · Hover mouse to control speed & direction'}
              </span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: FILTERABLE MATRIX GRID VIEW                                      */
          /* ========================================================================= */
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project, idx) => {
                const typeStyle = TYPE_COLORS[project.projectType || 'Major Project'] || TYPE_COLORS['Major Project'];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 current-flow-card"
                    style={{
                      background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 18, 28, 0.45)',
                      backdropFilter: 'blur(20px)',
                      borderColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255,255,255,0.08)',
                      boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 10px 30px -10px rgba(0,0,0,0.5)',
                    }}
                    whileHover={{
                      borderColor: isLight ? 'rgba(225,29,72,0.45)' : 'rgba(225,29,72,0.5)',
                      background: isLight ? '#ffffff' : 'rgba(24, 20, 36, 0.58)',
                    }}
                  >
                    {/* Project Photo / Screenshot Banner with Hover Zoom */}
                    <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-stone-950 border-b border-white/5">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-900 to-stone-950 flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <Layers className="w-8 h-8 text-rose-500/60 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-mono text-stone-400 font-semibold">{project.title}</span>
                        </div>
                      )}

                      {/* Badges on Top of Photo */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span
                          className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md shadow-md"
                          style={{
                            background: typeStyle.bg,
                            color: typeStyle.text,
                            borderColor: typeStyle.border,
                          }}
                        >
                          {project.projectType || 'Project'}
                        </span>

                        <span className="text-[10px] font-mono font-semibold text-stone-200 bg-stone-950/85 px-2.5 py-0.5 rounded-md border border-stone-800 backdrop-blur-md">
                          {project.category}
                        </span>
                      </div>

                      {/* Bottom Gradient Fade */}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[rgba(15,15,20,0.98)] to-transparent pointer-events-none" />
                    </div>

                    <div className={`p-5 space-y-2 border-b ${isLight ? 'border-stone-200' : 'border-white/5'}`}>
                      <h3 className={`text-base font-bold transition-colors line-clamp-2 ${
                        isLight ? 'text-stone-900 group-hover:text-rose-600' : 'text-white group-hover:text-rose-400'
                      }`}>
                        {project.title}
                      </h3>

                      <p className={`text-xs leading-relaxed line-clamp-3 ${
                        isLight ? 'text-stone-600' : 'text-stone-400'
                      }`}>
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Middle: Technologies (With Logos & Names) + Skills Used */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-end">
                      {/* Tech Badges with Authentic Vector Logos */}
                      <div className="space-y-1.5">
                        <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider ${
                          isLight ? 'text-stone-600' : 'text-stone-400'
                        }`}>
                          <Code2 className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>Technologies & Stack:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(project.technologies || []).filter(hasTechLogo).map(tech => renderTechBadge(tech, isLight))}
                        </div>
                      </div>

                      <div className={`pt-3 flex items-center justify-between gap-2 border-t ${
                        isLight ? 'border-stone-200' : 'border-stone-800/80'
                      }`}>
                        <button
                          onClick={() => setSelectedProject(project)}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer group-hover:translate-x-0.5 ${
                            isLight ? 'text-rose-600 hover:text-rose-700' : 'text-rose-400 hover:text-rose-300'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Case Study</span>
                          <span>→</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-lg border transition-colors ${
                                isLight
                                  ? 'bg-stone-100 border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900'
                                  : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white'
                              }`}
                              title="GitHub Repository"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.liveDemoUrl && (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-lg border transition-colors ${
                                isLight
                                  ? 'bg-stone-100 border-stone-200 hover:border-rose-400 text-stone-700 hover:text-rose-600'
                                  : 'bg-stone-900 border-stone-800 hover:border-rose-500/40 text-stone-400 hover:text-rose-400'
                              }`}
                              title="Live Hosting Website"
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.linkedinUrl && (
                            <a
                              href={project.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-lg border transition-colors ${
                                isLight
                                  ? 'bg-stone-100 border-stone-200 hover:border-sky-400 text-stone-700 hover:text-sky-600'
                                  : 'bg-stone-900 border-stone-800 hover:border-sky-500/40 text-stone-400 hover:text-sky-400'
                              }`}
                              title="LinkedIn Project Post"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.youtubeUrl && (
                            <a
                              href={project.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-red-500/50 text-stone-400 hover:text-red-400 transition-colors"
                              title="YouTube Video Demo"
                            >
                              <Youtube className="w-3.5 h-3.5 text-red-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style>{`
        @keyframes electricCurrentFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes projectsRightToLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes projectsLeftToRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .current-flow-card {
          position: relative;
        }
        .current-flow-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 1rem;
          padding: 1.5px;
          background: linear-gradient(90deg, #ef4444 0%, #facc15 25%, #10b981 50%, #38bdf8 75%, #ef4444 100%);
          background-size: 250% 250%;
          animation: electricCurrentFlow 8s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.28;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .current-flow-card:hover::before {
          opacity: 0.95;
          filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.5));
        }
      `}</style>
    </section>
  );
};
