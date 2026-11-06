import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Youtube,
  Copy,
  Check,
  FileCode,
  BarChart3,
  Database,
  Lightbulb,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Compass,
  Code2,
  TrendingUp,
} from 'lucide-react';
import { Project } from '../types';
import { getTechLogo, hasTechLogo } from './TechLogos';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [project]);

  if (!project) return null;

  const { caseStudy } = project;

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-stone-950/95 border border-white/10 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto text-stone-200">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-stone-950/90 backdrop-blur-xl shrink-0">
          <div className="space-y-1 pr-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                {project.category}
              </span>
              {project.projectType && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                  {project.projectType}
                </span>
              )}
              <span className="text-stone-500">·</span>
              <span className="text-stone-400 font-semibold">{project.difficulty} Level</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-400 hover:text-white transition-all shrink-0 cursor-pointer"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 space-y-8 overflow-y-auto leading-relaxed text-sm">
          
          {/* Quick Action Banner: Tech Stack & Live Links */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                <span>Tech Stack:</span>
              </span>
              {(project.technologies || []).filter(hasTechLogo).map(tech => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-xl border border-white/[0.08] bg-stone-900/90 text-stone-200 shadow-sm transition-all hover:border-rose-500/40 hover:scale-105"
                >
                  {getTechLogo(tech, undefined, 'w-3.5 h-3.5 shrink-0')}
                  <span>{tech}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-900 to-rose-700 hover:brightness-110 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Interactive Dashboard</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-white/10 hover:border-white/20 text-stone-200 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </a>
              )}

              {project.youtubeUrl && (
                <a
                  href={project.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/30 hover:border-red-500/60 text-red-200 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span>Video Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Section 1 & 2: Overview & Core Problem (Side-by-side on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Overview */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-400" />
                <span>1. Executive Overview</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {caseStudy.overview}
              </p>
            </div>

            {/* 2. Business Problem */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-3">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>2. Core Business Problem</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {caseStudy.businessProblem}
              </p>
            </div>
          </div>

          {/* Section 3 & 4: Dataset Architecture & Data Cleaning Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Dataset Info */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>3. Dataset Architecture</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {caseStudy.datasetInfo}
              </p>
            </div>

            {/* 4. Data Cleaning & Wrangling Pipeline */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>4. Cleaning & Wrangling Pipeline</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {caseStudy.dataCleaningPrep}
              </p>
            </div>
          </div>

          {/* Section 5: Analytical Methodology */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>5. Analytical Methodology</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {caseStudy.methodology}
            </p>
          </div>

          {/* Section 6: Code & Query Implementation */}
          {caseStudy.codeSnippets && caseStudy.codeSnippets.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-rose-400" />
                <span>6. Code & Query Implementation</span>
              </h3>

              <div className="space-y-4">
                {caseStudy.codeSnippets.map((snippet, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-lg">
                    <div className="flex items-center justify-between px-4 py-3 bg-stone-900/90 border-b border-white/10 text-xs font-mono">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold uppercase text-[11px]">
                          {snippet.language}
                        </span>
                        <span className="text-stone-300 font-semibold truncate">{snippet.title}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(snippet.code, idx)}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono shrink-0 cursor-pointer"
                        title="Copy code"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 sm:p-5 text-xs font-mono overflow-x-auto text-emerald-200/90 leading-relaxed bg-[#0a0d12]">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 7: Key Analytical Findings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>7. Key Analytical Findings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caseStudy.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.025] border border-white/10 flex items-start gap-3 hover:border-emerald-500/30 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-stone-300">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Strategic Recommendations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-400" />
              <span>8. Strategic Recommendations</span>
            </h3>

            <div className="space-y-2.5">
              {caseStudy.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.025] border border-white/10 flex items-start gap-3.5 hover:border-rose-500/30 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-stone-200 pt-0.5">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: Limitations & Future Scope */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.025] border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-stone-400" />
              <span>9. Limitations & Future Scope</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {caseStudy.limitations}
            </p>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-stone-950/90 backdrop-blur-xl flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-stone-500">
            Case Study Document · Sagar Singh Portfolio
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-white text-stone-950 hover:bg-stone-200 transition-all cursor-pointer font-mono shadow-md active:scale-95"
          >
            Close Case Study
          </button>
        </div>

      </div>
    </div>
  );
};
