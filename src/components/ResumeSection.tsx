import React, { useState } from 'react';
import { Download, CheckCircle2, FolderGit2, GraduationCap, Award, Phone, Mail, MapPin, Github, Linkedin, Eye, EyeOff, FileText, Lock } from 'lucide-react';
import { Profile, Education, Achievement } from '../types';

interface ResumeSectionProps {
  profile: Profile;
  education: Education[];
  achievements: Achievement[];
  onDownloadResume: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  profile,
  education,
  achievements,
  onDownloadResume,
}) => {
  const [isResumeViewOpen, setIsResumeViewOpen] = useState(false);

  return (
    <section id="resume" className="py-20 border-t border-stone-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest font-mono">
              Curriculum Vitae & Verified Resume
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Official Resume Preview
            </h2>
            <p className="text-sm sm:text-base text-stone-400">
              Direct access to my structured experience, technical competencies, and academic background from my official CV.
            </p>
          </div>
        </div>

        {/* LOCKED STATE: When user has NOT clicked View Resume */}
        {!isResumeViewOpen ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-stone-900/40 border border-white/10 backdrop-blur-xl text-center space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-rose-500/10 blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-950/40">
              <FileText className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Official Resume Ready
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Resume Preview Protected
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Click <strong>"View Official Resume Now"</strong> below to unlock the full interactive document containing complete academic credentials, capstones, and contact information.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsResumeViewOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 hover:brightness-110 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Eye className="w-4 h-4 text-emerald-300" />
                <span>View Official Resume Now</span>
              </button>

              <a
                href="/api/resume/download-file"
                download="Sagar_Singh_Resume.pdf"
                onClick={() => onDownloadResume()}
                className="px-5 py-3.5 rounded-xl bg-stone-950/80 border border-white/10 hover:border-rose-500/40 text-stone-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>Download Official Resume (PDF)</span>
              </a>

              <a
                href="/api/resume/view"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3.5 rounded-xl bg-stone-900/90 border border-white/10 hover:border-emerald-500/40 text-stone-300 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>
        ) : (
          /* UNLOCKED STATE: Full Interactive Resume Document */
          <div className="p-6 sm:p-10 rounded-3xl bg-stone-900/40 border border-white/10 backdrop-blur-xl space-y-8 shadow-2xl text-stone-200 animate-in fade-in duration-300 relative">
          
          {/* Action Bar inside the div */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                Official Document Unlocked
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="/api/resume/view"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-stone-950/80 border border-white/10 hover:border-emerald-500/40 text-stone-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Full PDF</span>
              </a>

              <a
                href="/api/resume/download-file"
                download="Sagar_Singh_Resume.pdf"
                onClick={() => onDownloadResume()}
                className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={() => setIsResumeViewOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-stone-950/80 border border-white/10 hover:border-rose-500/40 text-stone-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Hide</span>
              </button>
            </div>
          </div>
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {profile.name}
              </h3>
              <p className="text-sm font-semibold text-rose-400 mt-1">
                {profile.designation}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 font-mono mt-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  {profile.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  {profile.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  {profile.location}
                </span>
              </div>
            </div>

            {/* Social Profile Links */}
            <div className="flex items-center gap-2">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-400 hover:text-white transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-400 hover:text-sky-400 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Career Objective */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider">
              Career Objective
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              Focused and dedicated BCA graduate specializing in Data Analytics, Business Intelligence (Power BI, Advanced Excel, MySQL, Python), and modern web systems. Equipped with strong analytical thinking, structured query problem-solving, and hands-on project experience across enterprise retail sales modeling and cloud databases. Committed to empowering data-driven decisions through reliable analytics and technical solutions.
            </p>
          </div>

          {/* Key Projects & Implementations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Project Experience (From Verified Resume)</span>
            </h4>

            <div className="space-y-5">
              
              {/* Flagship BI Project */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                      FLAGSHIP BI PROJECT
                    </span>
                    <span className="font-bold text-white text-sm">Sales Performance & Customer Analytics Dashboard</span>
                  </div>
                  <span className="text-stone-400 font-mono text-xs">Jan 2026 – Mar 2026</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-300 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Engineered end-to-end Power BI & Excel analytical solution evaluating $2.4M in sales revenue across 50,000+ customer transactions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Built Star Schema dimensional data models in MySQL and authored 25+ DAX measures for YoY sales growth, margin %, and cohort retention.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automated ETL data cleaning routines in Power Query and Python (Pandas), eliminating 420 duplicate records and normalizing multi-currency datasets.</span>
                  </li>
                </ul>
              </div>

              {/* Major Project */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold">
                      MAJOR PROJECT
                    </span>
                    <span className="font-bold text-white text-sm">PG Rental Management System (Final Year Project)</span>
                  </div>
                  <span className="text-stone-400 font-mono text-xs">Dec 2025 – Feb 2026</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-300 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>Developed a web-based PG Rental Management System with role-based access (Admin, Owner, Tenant).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>Implemented room availability tracking, tenant management, booking requests, and rent status monitoring.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>Focused on scalability, clean UI/UX design, and efficient database handling using Supabase cloud for real-time data storage.</span>
                  </li>
                </ul>
              </div>

              {/* Minor Project 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                      MINOR PROJECT 1
                    </span>
                    <span className="font-bold text-white text-sm">DeepSeek AI Clone (API Integration)</span>
                  </div>
                  <span className="text-stone-400 font-mono text-xs">June 2025 – Aug 2025</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-300 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Developed a DeepSeek-inspired AI with conversational, reasoning-based responses instead of raw data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Built a modular, API switching architecture using open-source and browser-native technologies for long-term, cost-free usage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Added features including message search, pinning, and export to PDF, Word file, Web, and Word with professional file previews.</span>
                  </li>
                </ul>
              </div>

              {/* Minor Project 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-[10px] font-bold">
                      MINOR PROJECT 2
                    </span>
                    <span className="font-bold text-white text-sm">Weather Forecast App (API Integration)</span>
                  </div>
                  <span className="text-stone-400 font-mono text-xs">Aug 2025 – Oct 2025</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-300 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>Developed a Weather Forecast Web Application using JavaScript with OpenWeather API integration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>Implemented real-time weather data retrieval, including temperature, humidity, and atmospheric conditions for multiple cities.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>Designed a responsive and intuitive interface to enhance user experience and accurate data visualization.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Education & Certifications Summary - Symmetrically Aligned & Balanced Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
            {/* Left: Education Hierarchy */}
            <div className="flex flex-col justify-between space-y-3">
              <h4 className="font-bold text-stone-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
                <span>Education Hierarchy</span>
              </h4>
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                {education.map(e => (
                  <div key={e.id} className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-white text-xs">{e.degree}</p>
                      {e.gradeGpa && <span className="text-rose-400 font-mono text-[10px] shrink-0 font-semibold">{e.gradeGpa}</span>}
                    </div>
                    <p className="text-stone-400 text-[11px] mt-0.5">{e.institution} ({e.period})</p>
                  </div>
                ))}

                {/* Academic Highlights to Align 5-to-5 with Honors Column */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-white text-xs">Academic Focus: Database Systems & Analytics</p>
                    <span className="text-emerald-400 font-mono text-[10px] shrink-0 font-semibold">Core Specialization</span>
                  </div>
                  <p className="text-stone-400 text-[11px] mt-0.5">Presidency College · Relational SQL, Python & Data Warehousing</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-white text-xs">Final Year Capstone Project (BCA 2026)</p>
                    <span className="text-sky-400 font-mono text-[10px] shrink-0 font-semibold">Project Lead</span>
                  </div>
                  <p className="text-stone-400 text-[11px] mt-0.5">Cloud PG Management & Real-Time Supabase Architecture</p>
                </div>
              </div>
            </div>

            {/* Right: Honors & Certifications */}
            <div className="flex flex-col justify-between space-y-3">
              <h4 className="font-bold text-stone-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Honors & Certifications</span>
              </h4>
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                {achievements.map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-white text-xs">{a.title}</p>
                      <span className="text-amber-400/80 font-mono text-[10px] shrink-0">{a.issueDate}</span>
                    </div>
                    <p className="text-stone-400 text-[11px] mt-0.5">{a.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          </div>
        )}

      </div>
    </section>
  );
};
