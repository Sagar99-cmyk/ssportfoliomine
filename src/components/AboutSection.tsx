import React from 'react';
import { Database, LineChart, Code2, Server, CheckCircle2 } from 'lucide-react';
import { Profile } from '../types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const philosophy = profile.aboutDetails?.philosophy || (
    'My professional approach bridges analytical business intelligence with robust technical implementations. I have built end-to-end solutions including an interactive Sales Performance & Customer Analytics Dashboard ($2.4M analyzed across 50,000+ records in Power BI, Advanced Excel, and MySQL) and a collegiate PG Rental Management System using Supabase cloud database. Equipped with strong analytical acumen, Python data manipulation, and disciplined leadership from NCC Sergeant training, I am eager to contribute to forward-thinking analytics and tech teams.'
  );

  const defaultHighlights = [
    'Data Analytics & BI (Power BI, DAX & Excel)',
    'SQL & Relational Databases (MySQL, PostgreSQL)',
    'Python Data Cleaning & EDA (Pandas, NumPy)',
    'Disciplined Team Leadership (NCC Sergeant)',
  ];

  const highlights = (profile.aboutDetails?.highlights && profile.aboutDetails.highlights.length > 0)
    ? profile.aboutDetails.highlights
    : defaultHighlights;

  const defaultPillars = [
    {
      title: '1. Business Intelligence & Dashboards',
      desc: 'Transforming complex datasets into actionable executive visual reports. Designing star schemas, DAX measures, KPI cards, and dynamic slicers in Power BI and Excel.',
      icon: 'chart'
    },
    {
      title: '2. SQL & Relational Databases',
      desc: 'Writing optimized SQL queries in MySQL and PostgreSQL. Proficient in multi-table joins, aggregations, window functions, and maintaining relational integrity.',
      icon: 'db'
    },
    {
      title: '3. Python Data Wrangling & Web Systems',
      desc: 'Conducting exploratory data analysis (EDA) with Pandas and NumPy. Developing modern responsive web interfaces and connecting REST APIs with client-side caching.',
      icon: 'code'
    }
  ];

  const pillars = (profile.aboutDetails?.pillars && profile.aboutDetails.pillars.length > 0)
    ? profile.aboutDetails.pillars
    : defaultPillars;

  const renderPillarIcon = (iconName?: string) => {
    if (iconName === 'db' || iconName?.includes('data')) return <Database className="w-5 h-5" />;
    if (iconName === 'code' || iconName?.includes('web')) return <Code2 className="w-5 h-5" />;
    return <LineChart className="w-5 h-5" />;
  };

  return (
    <section id="about" className="py-20 border-t border-stone-200/80 dark:border-stone-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="space-y-2 max-w-2xl text-left">
          <span className="text-xs font-semibold text-rose-900 dark:text-rose-400 uppercase tracking-widest font-mono">
            Professional Narrative & Discipline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
            About Sagar Singh
          </h2>
        </div>

        {/* 2-Column Split: Bio vs Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Bio Prose */}
          <div className="lg:col-span-7 space-y-6 text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            <p className="font-medium text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-snug">
              {profile.aboutBio}
            </p>

            <p>
              {philosophy}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-stone-200">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-900/35 backdrop-blur-md border border-white/[0.08] hover:border-rose-500/30 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Core Pillars */}
          <div className="lg:col-span-5 space-y-4">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-stone-900/35 backdrop-blur-md border border-white/[0.08] hover:border-rose-500/30 transition-all space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                    {renderPillarIcon(pillar.icon)}
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
