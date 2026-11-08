import React from 'react';
import {
  GraduationCap,
  Award,
  ExternalLink,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  School,
  Trophy,
  ShieldCheck,
  Medal,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Education, Achievement } from '../types';
import { DEFAULT_EDUCATION, DEFAULT_ACHIEVEMENTS } from '../data/defaultData';

interface EducationAchievementsProps {
  education: Education[];
  achievements: Achievement[];
}

export const EducationAchievements: React.FC<EducationAchievementsProps> = ({
  education,
  achievements,
}) => {
  // Use provided items or robust defaults
  const activeEducation = education && education.length > 0 ? education : DEFAULT_EDUCATION;
  const activeAchievements = achievements && achievements.length > 0 ? achievements : DEFAULT_ACHIEVEMENTS;

  // Sort in hierarchical order: Degree (Level 1) -> Higher Secondary (Level 2) -> Secondary (Level 3)
  const hierarchicalEducation = [...activeEducation].sort((a, b) => {
    const orderA = a.order ?? (a as any).hierarchy_level ?? (a.degree.includes('Bachelor') ? 1 : a.degree.includes('Higher') ? 2 : 3);
    const orderB = b.order ?? (b as any).hierarchy_level ?? (b.degree.includes('Bachelor') ? 1 : b.degree.includes('Higher') ? 2 : 3);
    return orderA - orderB;
  });

  return (
    <section id="education" className="py-20 border-t border-stone-800/80 relative overflow-hidden">
      
      {/* Subtle background ambient lights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 rounded-full bg-rose-950/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-950/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-3 text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Hierarchy & Proven Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Academic Hierarchy & Verified Honors
          </h2>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            Detailed, chronological academic journey and verified professional credentials from my official curriculum vitae, displaying degrees, accredited boards, division percentages, and competitive accolades.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Hierarchical Education Flow (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Education Hierarchy
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">Undergraduate Degree → Higher Secondary (+2) → Secondary (10th)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-900 text-stone-300 border border-stone-800">
                {hierarchicalEducation.length} Levels
              </span>
            </div>

            {/* Vertical Hierarchy Tree */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-rose-500 via-amber-500 before:to-stone-700">
              {hierarchicalEducation.map((edu, idx) => {
                const degreeStr = edu.degree || '';
                const isUndergrad = degreeStr.includes('Bachelor') || idx === 0;
                const isHigherSec = degreeStr.includes('Higher') || idx === 1;
                const gradeStr = edu.gradeGpa || (edu as any).grade_gpa || '';
                const levelStr = edu.level || (edu as any).hierarchy_level
                  ? `Level ${edu.level || (edu as any).hierarchy_level} · ${isUndergrad ? 'Undergraduate Degree' : isHigherSec ? 'Higher Secondary (+2)' : 'Secondary School (10th)'}`
                  : (isUndergrad ? 'Level 1 · Highest / Undergraduate Degree' : isHigherSec ? 'Level 2 · Higher Secondary Education (+2)' : 'Level 3 · Secondary School Education (10th)');

                return (
                  <div key={edu.id || idx} className="relative group">
                    {/* Stepped Node on Timeline */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all shadow-md z-10 ${
                        isUndergrad
                          ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-rose-900/50'
                          : isHigherSec
                          ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-amber-900/40'
                          : 'bg-stone-900 border-stone-600 text-stone-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Hierarchy Card */}
                    <div
                      className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                        isUndergrad
                          ? 'bg-stone-900/40 border-rose-500/40 hover:border-rose-500/70 shadow-xl shadow-rose-950/20'
                          : 'bg-stone-900/30 border-white/[0.08] hover:border-white/[0.18]'
                      }`}
                    >
                      {/* Top Row: Hierarchy Level Pill & Period */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            isUndergrad
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : isHigherSec
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-stone-800 text-stone-400 border-stone-700'
                          }`}
                        >
                          {levelStr}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          <span>{edu.period}</span>
                        </div>
                      </div>

                      {/* Degree Title & Institution */}
                      <div className="space-y-1.5">
                        <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                          <span>{edu.degree}</span>
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-300">
                          <School className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="font-semibold text-rose-200">{edu.institution}</span>
                          <span className="text-stone-600">·</span>
                          <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span className="text-stone-400">{edu.location}</span>
                          
                          {gradeStr && (
                            <>
                              <span className="text-stone-600">·</span>
                              <span className="px-2.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 font-mono text-[11px] font-bold">
                                {gradeStr}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Description Narrative */}
                      <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
                        {edu.description}
                      </p>

                      {/* Bullet Highlights & Academic Capstones */}
                      {edu.highlights && edu.highlights.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-stone-800/80 space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-semibold flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-rose-400" />
                            <span>Curriculum Focus, Capstones & Highlights:</span>
                          </span>
                          <ul className="space-y-2">
                            {edu.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-stone-300 leading-normal">
                                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Achievements & Certifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Achievements & Honors
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">Competitions, NCC Rank & Certifications</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-900 text-stone-300 border border-stone-800">
                {activeAchievements.length} Badges
              </span>
            </div>

            <div className="space-y-4">
              {activeAchievements.map((ach, aIdx) => {
                const year = ach.issueDate || (ach as any).issue_date || '2025';
                const credId = ach.credentialId || (ach as any).credential_id;
                const credUrl = ach.credentialUrl || (ach as any).credential_url;
                const skillsList = ach.skills || (ach as any).skills_tags || [];
                const achDesc = ach.description || (ach as any).desc || '';

                const isQuiz = ach.title.toLowerCase().includes('quiz') || ach.title.toLowerCase().includes('place');
                const isNCC = ach.title.toLowerCase().includes('ncc') || ach.title.toLowerCase().includes('sergeant');
                const isPBI = ach.title.toLowerCase().includes('power bi') || ach.title.toLowerCase().includes('bi');

                return (
                  <div
                    key={ach.id || aIdx}
                    className="p-5 rounded-2xl bg-stone-900/35 backdrop-blur-md border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 space-y-3 group shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5">
                          {isQuiz ? (
                            <span className="text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5" />
                              <span>Competition Finalist</span>
                            </span>
                          ) : isNCC ? (
                            <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Defense Cadets · NCC</span>
                            </span>
                          ) : isPBI ? (
                            <span className="text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Analytics Specialization</span>
                            </span>
                          ) : (
                            <span className="text-sky-400 text-xs font-mono font-bold flex items-center gap-1">
                              <Medal className="w-3.5 h-3.5" />
                              <span>Industry Credential</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {ach.title}
                        </h4>

                        <p className="text-xs text-stone-400 font-medium">
                          {ach.issuer}
                        </p>
                      </div>

                      {credUrl && (
                        <a
                          href={credUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800 border border-transparent hover:border-stone-700 transition shrink-0"
                          title="View Verified Certificate"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Honor Description */}
                    {achDesc && (
                      <p className="text-xs text-stone-300 leading-relaxed pt-1">
                        {achDesc}
                      </p>
                    )}

                    {/* Metadata: Year & Credential ID */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-1">
                      <span>Year: {year}</span>
                      {credId && (
                        <span className="text-stone-300 bg-stone-950 px-2 py-0.5 rounded border border-stone-800/80">
                          {credId}
                        </span>
                      )}
                    </div>

                    {/* Verified Skill Tags */}
                    {skillsList && skillsList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {skillsList.map((s: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 text-[10px] font-mono rounded bg-stone-950 text-stone-300 border border-stone-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Extracurricular Leadership & Discipline Track Record Banner */}
        <div className="w-full max-w-4xl mx-auto pt-4">
          <div
            className="p-6 sm:p-8 rounded-3xl border text-left space-y-4 transition-all duration-300 relative overflow-hidden group shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(24,24,32,0.92) 0%, rgba(14,14,20,0.97) 100%)',
              borderColor: 'rgba(225,29,72,0.3)',
              boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8), 0 0 25px rgba(225,29,72,0.1)',
            }}
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 right-1/4 w-72 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-950 to-amber-950 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shrink-0">
                  <ShieldCheck className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                      National Cadets & College Leadership
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Extracurricular Leadership & Discipline Track Record
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-stone-400 shrink-0">
                <span className="px-3 py-1 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-300">
                  Presidency College & NCC
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
              Volunteered in organizing multiple college and inter-college technical events at Presidency College. Completed rigorous National Cadet Corps (NCC) training camps (CATC1 & CATC2), earning the distinguished <strong>Sergeant Rank</strong> and <strong>NCC "B" Certificate</strong> with exceptional leadership, teamwork, and tactical discipline ratings.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/80">
              {[
                'NCC Sergeant Rank',
                'NCC "B" Certificate Recipient',
                'CATC1 & CATC2 Camps',
                'Presidency Tech Events Organizer',
                'Team Coordination & Discipline',
              ].map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-xl bg-stone-900 text-stone-300 border border-stone-800 hover:border-rose-500/40 transition-colors"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
