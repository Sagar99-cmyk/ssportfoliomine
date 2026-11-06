import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ThreeDataBackground } from './components/ThreeDataBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsGallery } from './components/ProjectsGallery';
import { AboutSection } from './components/AboutSection';
import { EducationAchievements } from './components/EducationAchievements';
import { ResumeSection } from './components/ResumeSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { api } from './services/api';
import { Profile, Skill, Project, Education, Achievement } from './types';
import {
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_EDUCATION,
  DEFAULT_ACHIEVEMENTS,
} from './data/defaultData';

// Global Error Boundary to prevent any unhandled component crash from blanking the screen
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Unhandled UI exception in component tree:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#f5f0eb] p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-stone-900 border border-rose-500/30 space-y-4">
            <h2 className="text-xl font-bold text-rose-400">Display Refresh Needed</h2>
            <p className="text-xs text-stone-300">
              {this.state.error?.message || 'A visual component encountered an initialization glitch.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs cursor-pointer font-bold"
            >
              Reload Portfolio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const isAdminPortalEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  const hash = window.location.hash;
  const host = window.location.hostname;
  const port = window.location.port;

  // 1. Port 3001 (local dedicated admin dev) or URL query parameter (?admin=true)
  if (port === '3001' || window.location.search.includes('admin=true')) return true;

  // 2. Explicit paths or hashes
  if (path === '/admin' || path === '/login' || hash === '#admin') return true;

  // 3. Hosted on Netlify (e.g. *.netlify.app or admin subdomain)
  if (host.includes('netlify.app') || host.includes('admin.')) return true;

  // 4. Vite environment flag
  if (typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.VITE_IS_ADMIN)) return true;

  return false;
};

// ==============================================================================
// Dedicated Admin Portal (Runs on http://localhost:3001)
// Landing Page: Directly the Login Form -> Admin Dashboard upon authentication
// ==============================================================================
const AdminPortalApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = api.getAuthToken();
    if (token) {
      api.verifyAdminAuth()
        .then(res => {
          if (res.valid) {
            setIsAuthenticated(true);
          } else {
            api.adminLogout();
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          api.adminLogout();
          setIsAuthenticated(false);
        })
        .finally(() => {
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center text-white font-mono text-xs">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/80 border border-white/[0.08] shadow-2xl">
          <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: Landing page is directly the Login Form!
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative bg-[#060810] flex items-center justify-center select-none overflow-hidden p-4">
        {/* Ambient background matching admin styling */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-20"
          style={{ backgroundImage: "url('/red-welcome-bg.jpg')" }}
        />
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 40%, rgba(225,29,72,0.18) 0%, rgba(6,8,16,0.95) 85%)' }}
        />
        <LoginPage
          isOpen={true}
          isStandalone={true}
          onClose={() => {}}
          onLoginSuccess={() => {
            setIsAuthenticated(true);
          }}
        />
      </div>
    );
  }

  // Authenticated: Show the full AdminDashboard!
  return (
    <AdminDashboard
      onClose={() => {
        api.adminLogout();
        setIsAuthenticated(false);
      }}
      onDataChanged={() => {}}
    />
  );
};

const PortfolioContent: React.FC = () => {
  // State
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [education, setEducation] = useState<Education[]>(DEFAULT_EDUCATION);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioData();

    // Global shortcut Ctrl+Shift+A or Cmd+Shift+A to open dedicated admin panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const isAdminLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const adminUrl = isAdminLocal ? 'http://localhost:3001' : 'https://chimerical-entremet-dc12c3.netlify.app/';
        window.open(adminUrl, '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchPortfolioData = async (silent = false) => {
    if (!silent && !profile) {
      setLoading(true);
    }
    setError(null);
    try {
      const results = await Promise.allSettled([
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
        api.getEducation(),
        api.getAchievements(),
      ]);

      if (results[0].status === 'fulfilled' && results[0].value) {
        setProfile(results[0].value);
      }
      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
        const seen = new Set<string>();
        const unique = results[1].value.filter(s => {
          const key = (s.name || '').trim().toLowerCase();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setSkills(unique);
      }
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) {
        setProjects(results[2].value);
      }
      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) {
        setEducation(results[3].value);
      }
      if (results[4].status === 'fulfilled' && Array.isArray(results[4].value)) {
        setAchievements(results[4].value);
      }
    } catch (err: any) {
      console.warn('Portfolio sync note:', err?.message || err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleDownloadResume = async () => {
    try {
      api.trackResumeDownload().catch(() => {});
      const link = document.createElement('a');
      link.href = '/api/resume/download-file';
      link.download = 'Sagar_Singh_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open('/api/resume/download-file', '_blank');
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#09090b', color: '#94a3b8' }}
      >
        <div className="space-y-4 text-center">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin mx-auto"
            style={{ borderColor: '#e11d48', borderTopColor: 'transparent' }}
          />
          <p className="font-mono text-xs">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  // If user hasn't clicked "Enter Portfolio" yet, show the Welcome Screen
  if (!hasEntered) {
    return (
      <div className="min-h-screen relative bg-[#09090b] text-[#f5f0eb]">
        <WelcomeScreen onEnter={() => setHasEntered(true)} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#09090b', color: '#e2e8f0' }}
    >
      {/* 3D Animated Background */}
      <ThreeDataBackground isDark={true} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Page Sections */}
        <main className="flex-1 space-y-2">
          {profile && (
            <Hero
              profile={profile}
              skills={skills}
              projects={projects}
              education={education}
              onDownloadResume={handleDownloadResume}
            />
          )}
          {skills.length > 0 && <SkillsSection skills={skills} />}
          {projects.length > 0 && <ProjectsGallery projects={projects} />}
          {profile && <AboutSection profile={profile} />}
          <EducationAchievements education={education} achievements={achievements} />
          {profile && (
            <ResumeSection
              profile={profile}
              education={education}
              achievements={achievements}
              onDownloadResume={handleDownloadResume}
            />
          )}
          {profile && <ContactSection profile={profile} />}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  const isAdmin = isAdminPortalEnvironment();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {isAdmin ? <AdminPortalApp /> : <PortfolioContent />}
      </ThemeProvider>
    </ErrorBoundary>
  );
}
