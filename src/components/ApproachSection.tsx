import React from 'react';
import { Target, Database, Code2, Cpu, Rocket } from 'lucide-react';

export const ApproachSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Requirement Scoping & Problem Breakdown',
      description: 'Deconstruct complex application requirements into modular user stories, role permissions (Admin, Owner, Tenant), and data contracts.',
      icon: Target,
    },
    {
      number: '02',
      title: 'Database Schema & Cloud Architecture',
      description: 'Design normalized relational schemas in Supabase and PostgreSQL with row-level security (RLS) policies and real-time event listeners.',
      icon: Database,
    },
    {
      number: '03',
      title: 'Modular Full-Stack Development',
      description: 'Write clean, maintainable code adhering to OOPs principles with modern React component architecture and responsive TailwindCSS.',
      icon: Code2,
    },
    {
      number: '04',
      title: 'API Integration & AI Reasoning',
      description: 'Connect third-party REST endpoints (OpenWeather, DeepSeek, Google Gemini) with fallback switching and low-latency payload parsing.',
      icon: Cpu,
    },
    {
      number: '05',
      title: 'Testing, Deployment & Continuous Iteration',
      description: 'Validate responsive UX across devices, optimize asset delivery, and deploy to cloud platforms with continuous version control.',
      icon: Rocket,
    },
  ];

  return (
    <section id="approach" className="py-20 border-t border-stone-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="space-y-2 text-left max-w-2xl">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest font-mono">
            Engineering Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            5-Step Development Lifecycle
          </h2>
          <p className="text-sm sm:text-base text-stone-400">
            A disciplined, practical workflow applied across full-stack applications, API integrations, and database design.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-rose-500/40 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-rose-400">
                      {step.number}
                    </span>
                    <div className="p-2 rounded-lg bg-stone-950 text-stone-300 border border-stone-800">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
