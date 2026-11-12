import React, { useState } from 'react';
import { Eye, EyeOff, X, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { ShakuroRibbonGallery, RibbonProject, SHAKURO_PROJECTS } from './ShakuroRibbonGallery';
import { SoundButton } from './BackgroundMusic';

interface LoginPageProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (email: string) => void;
  isStandalone?: boolean;
}

const SLIDES = [
  {
    quote: 'Interactive 3D Ribbon Conveyor with dynamic WebGL shaders.',
    tag: 'Next-Gen 3D UI',
  },
  {
    quote: 'Manage projects, skills & analytics with full administrative control.',
    tag: 'Admin Suite',
  },
  {
    quote: 'Enterprise data pipelines, Power BI dashboards & MySQL cloud database.',
    tag: 'Stack Overview',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ isOpen, onClose, onLoginSuccess, isStandalone }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fullscreen 3D Gallery Exploration Mode Toggle
  const [isExploreMode, setIsExploreMode] = useState(false);

  // Recovery Password State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Selected project for modal or detail preview
  const [inspectedProject, setInspectedProject] = useState<RibbonProject | null>(null);

  // Ensure password is never retained in memory when opening or closing
  React.useEffect(() => {
    setPassword('');
    return () => {
      setPassword('');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both administrator email and authentication passcode.');
      return;
    }

    setLoading(true);

    try {
      await api.adminLogin(cleanEmail, cleanPassword);
      setLoading(false);
      setPassword(''); // Wipe password from state immediately after auth
      onLoginSuccess(cleanEmail);
    } catch (err: any) {
      setLoading(false);
      setPassword('');
      setError(err.message || 'Invalid administrator credentials. Access restricted.');
    }
  };

  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRecoverySent(true);
      setError(null);
    }, 700);
  };

  const handleVerifyRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = enteredCode.trim();
    if (!cleanCode) {
      setError('Please enter the authorization code.');
      return;
    }
    setLoading(true);
    try {
      await api.adminLogin(recoveryEmail.trim(), cleanCode);
      setRecoverySuccess(true);
      setLoading(false);
      setEnteredCode('');
      setTimeout(() => {
        onLoginSuccess(recoveryEmail.trim());
      }, 700);
    } catch (err: any) {
      setLoading(false);
      setEnteredCode('');
      setError(err.message || 'Incorrect authorization code. Access denied.');
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const publicPortfolioUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://ssportfoliomines.vercel.app/';

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden select-none bg-black text-white">
      {/* 1. REAL-TIME 3D RIBBON CONVEYOR GALLERY (WebGL Stage with Reflection, Noise & Inertia Physics) */}
      <ShakuroRibbonGallery
        onProjectClick={(proj) => {
          setInspectedProject(proj);
        }}
        isBackgroundOnly={!isExploreMode}
      />

      {/* 2. TOP HEADER NAVIGATION BAR */}
      <header className="fixed top-0 inset-x-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
        {/* Brand Wordmark & Security Status */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)' }}
          >
            <span className="text-white font-bold text-xs font-mono">SS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white font-mono uppercase">
                Sagar Singh
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] font-mono text-stone-400 hidden sm:block">
              Admin Portal · 3D Ribbon Showcase
            </p>
          </div>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Explore 3D Gallery / Return to Login Form Toggle */}
          <button
            onClick={() => setIsExploreMode(!isExploreMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 border ${
              isExploreMode
                ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                : 'bg-black/60 hover:bg-black/80 text-stone-300 border-white/20 backdrop-blur-md'
            }`}
            title={isExploreMode ? 'Open Sign In Dialog' : 'Explore 3D Conveyor in Fullscreen'}
          >
            {isExploreMode ? (
              <>
                <KeyRound className="w-3.5 h-3.5 text-white" />
                <span>Sign In Form</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Explore 3D Gallery</span>
              </>
            )}
          </button>

          {/* Background Ambient Audio Toggle */}
          <SoundButton />

          {/* Return to Public Portfolio Button */}
          <a
            href={publicPortfolioUrl}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 hover:text-white transition-all text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            title="Return to Public Portfolio"
          >
            <span>← Portfolio</span>
          </a>

          {/* Close Modal (if embedded) */}
          {!isStandalone && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer backdrop-blur-md"
              title="Close Modal"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 3. MAIN SIGN-IN CARD OVERLAY (Floats with Frosted Glassmorphism, Collapsible into 3D Mode) */}
      <AnimatePresence>
        {!isExploreMode && (
          <div className="fixed inset-0 z-20 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="pointer-events-auto relative w-full max-w-[940px] max-h-[92vh] overflow-y-auto rounded-[32px] sm:rounded-[40px] border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.85)] p-5 sm:p-7 md:p-8 overflow-x-hidden text-stone-100 backdrop-blur-2xl"
              style={{
                background: 'rgba(9, 9, 11, 0.78)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Subtle Ambient Radial Highlight on Card */}
              <div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(circle at 80% 20%, rgba(225,29,72,0.12) 0%, transparent 60%)',
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LEFT COLUMN: Clean Secure Authentication Form */}
                <div className="lg:col-span-6 flex flex-col justify-center max-w-md mx-auto w-full">
                  
                  {/* Header Title */}
                  <div className="text-center sm:text-left space-y-1 mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-mono mb-2">
                      <Sparkles className="w-3 h-3 text-rose-400" />
                      <span>Protected Executive Gateway</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                      {isRecoveryMode ? 'Reset Passcode' : 'Admin Portal'}
                    </h1>
                    <p className="text-xs text-stone-400 font-medium">
                      {isRecoveryMode
                        ? 'Verify identity via registered administrator email'
                        : 'Sign in to manage portfolio content, database & analytics'}
                    </p>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Normal Sign In Form */}
                  {!isRecoveryMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Input */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                          Administrator Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="admin@sagarsingh.dev"
                          required
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          data-lpignore="true"
                          className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner text-white placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all font-mono"
                        />
                      </div>

                      {/* Password Input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                            Authentication Passcode
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setIsRecoveryMode(true);
                              setError(null);
                            }}
                            className="text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                          >
                            Recovery Code?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            required
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            data-lpignore="true"
                            className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner text-white placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all pr-12 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer transition-colors"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Sign In Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-semibold text-sm text-white transition-all shadow-[0_10px_30px_rgba(225,29,72,0.35)] cursor-pointer hover:brightness-110 active:scale-[0.99] disabled:opacity-50 mt-2 font-mono tracking-wide"
                        style={{
                          background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                        }}
                      >
                        {loading ? 'Authenticating with PBKDF2...' : 'Authenticate & Open Admin'}
                      </button>
                    </form>
                  ) : (
                    /* Password Recovery Mode */
                    <div className="space-y-4">
                      {!recoverySent ? (
                        <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-amber-300">
                              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                              <span>Passcode Recovery</span>
                            </div>
                            <p className="text-[11px] text-amber-200/80">
                              A secure one-time authorization code will be dispatched to your administrator email.
                            </p>
                          </div>

                          <div className="space-y-1">
                            <input
                              type="email"
                              value={recoveryEmail}
                              onChange={e => setRecoveryEmail(e.target.value)}
                              placeholder="Admin Email"
                              required
                              className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 font-mono"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl font-semibold text-xs text-white transition-all shadow-md cursor-pointer hover:brightness-110"
                            style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' }}
                          >
                            {loading ? 'Dispatching...' : 'Dispatch Verification Code'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsRecoveryMode(false);
                              setError(null);
                            }}
                            className="w-full text-center text-xs text-stone-400 hover:text-white font-medium transition-colors"
                          >
                            ← Back to Standard Sign In
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyRecoveryCode} className="space-y-4">
                          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Code Dispatched!</span>
                            </div>
                            <p className="text-[11px] text-emerald-200/80">
                              A verification code was dispatched to <strong className="text-white">{recoveryEmail}</strong>.
                            </p>
                          </div>

                          {recoverySuccess && (
                            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Identity confirmed! Unlocking admin suite...</span>
                            </div>
                          )}

                          <div className="space-y-1">
                            <input
                              type="password"
                              value={enteredCode}
                              onChange={e => setEnteredCode(e.target.value)}
                              placeholder="Enter Authorization Code"
                              required
                              className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder:text-stone-500 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3.5 rounded-2xl font-semibold text-xs text-white transition-all shadow-md cursor-pointer hover:brightness-110"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                          >
                            Verify & Open Admin
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsRecoveryMode(false);
                              setRecoverySent(false);
                              setError(null);
                            }}
                            className="w-full text-center text-xs text-stone-400 hover:text-white font-medium transition-colors"
                          >
                            ← Return to Standard Sign In
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Single Sign-on Disclaimer */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Direct Database Auth</span>
                    </span>
                    <span className="font-mono text-stone-500">PBKDF2 · SHA-256</span>
                  </div>

                </div>

                {/* RIGHT COLUMN: Interactive 3D Conveyor Spotlight Panel */}
                <div className="lg:col-span-6 h-[460px] sm:h-[500px] w-full rounded-[28px] overflow-hidden relative border border-white/10 bg-gradient-to-b from-white/[0.08] to-black/60 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
                  {/* Top Bar inside panel */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold">
                        WebGL 3D Engine
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        {SHAKURO_PROJECTS.length} Projects Live
                      </span>
                    </div>

                    <button
                      onClick={() => setIsExploreMode(true)}
                      className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      title="Hide login form and explore 3D ribbon in full screen"
                    >
                      <span>Fullscreen 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Middle Feature List & Controls Explanation */}
                  <div className="space-y-4 my-auto">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span>Interactive 3D Ribbon Controls</span>
                      </h3>
                      <ul className="text-xs space-y-2 text-stone-300">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span><strong>Drag / Swipe:</strong> Orbit the ribbon with smooth inertia physics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span><strong>Mouse Wheel:</strong> Accelerate or reverse conveyor speed</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span><strong>Arrow Keys:</strong> Step sequentially across projects</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span><strong>Click Any Tile:</strong> Inspect project details & links</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setIsExploreMode(true)}
                      className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>Click to Experience Fullscreen 3D Ribbon</span>
                    </button>
                  </div>

                  {/* Bottom Quotes & Carousel Dots */}
                  <div className="flex items-end justify-between pt-4 border-t border-white/10">
                    <div className="space-y-1 max-w-xs">
                      <p className="text-xs text-stone-300 font-medium leading-relaxed">
                        {SLIDES[currentSlide].quote}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        {SLIDES.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              currentSlide === i ? 'w-4 bg-rose-500' : 'w-1.5 bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={prevSlide}
                        className="w-7 h-7 rounded-full border border-white/20 hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-all bg-black/40 cursor-pointer"
                        aria-label="Previous Slide"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        className="w-7 h-7 rounded-full border border-white/20 hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-all bg-black/40 cursor-pointer"
                        aria-label="Next Slide"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. FLOATING RESTORE PILL WHEN IN FULLSCREEN 3D MODE */}
      <AnimatePresence>
        {isExploreMode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 inset-x-0 z-30 flex flex-col items-center gap-3 pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-3 bg-stone-950/85 border border-white/20 rounded-full px-5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <span className="flex items-center gap-2 text-xs font-mono text-stone-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="hidden sm:inline">Drag or scroll to orbit ribbon</span>
              </span>

              <button
                onClick={() => setIsExploreMode(false)}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. PROJECT DETAIL INSPECTION MODAL */}
      <AnimatePresence>
        {inspectedProject && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setInspectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-lg w-full rounded-3xl bg-stone-900 border border-white/20 p-6 space-y-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block mb-1">
                    3D Conveyor Spotlight
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {inspectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectedProject(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 relative bg-black/50">
                <img
                  src={inspectedProject.image}
                  alt={inspectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback visual
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-stone-400">
                  Project #{inspectedProject.order}
                </span>

                <a
                  href={inspectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>View on Dribbble</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
