import React from 'react';
import { Database, LineChart, Code2, Server, CheckCircle2 } from 'lucide-react';
import { Profile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
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
    <section id="about" className={`py-20 border-t relative ${
      isLight ? 'border-stone-200' : 'border-white/[0.08]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="space-y-2 max-w-2xl text-left">
          <span className={`text-xs font-semibold uppercase tracking-widest font-mono ${
            isLight ? 'text-rose-600' : 'text-rose-400'
          }`}>
            Professional Narrative & Discipline
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-stone-900' : 'text-stone-100'
          }`}>
            About Sagar Singh
          </h2>
        </div>

        {/* 2-Column Split: Bio vs Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Bio Prose */}
          <div className={`lg:col-span-7 space-y-6 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-stone-700' : 'text-stone-300'
          }`}>
            <p className={`font-semibold text-base sm:text-lg leading-snug ${
              isLight ? 'text-stone-900' : 'text-stone-100'
            }`}>
              {profile.aboutBio}
            </p>

            <p className={isLight ? 'text-stone-700 font-medium' : 'text-stone-300'}>
              {philosophy}
            </p>

            <div className={`pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium ${
              isLight ? 'text-stone-800' : 'text-stone-200'
            }`}>
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border backdrop-blur-md transition-all ${
                    isLight
                      ? 'bg-white/90 border-stone-200 text-stone-800 shadow-2xs hover:border-rose-400'
                      : 'bg-stone-900/35 border-white/[0.08] hover:border-rose-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Core Pillars */}
          <div className="lg:col-span-5 space-y-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border backdrop-blur-md transition-all space-y-3 ${
                  isLight
                    ? 'bg-white/90 border-stone-200 shadow-sm hover:border-rose-300 hover:shadow-md'
                    : 'bg-stone-900/35 border-white/[0.08] hover:border-rose-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                    {renderPillarIcon(pillar.icon)}
                  </div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-stone-900' : 'text-white'}`}>
                    {pillar.title}
                  </h3>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
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
