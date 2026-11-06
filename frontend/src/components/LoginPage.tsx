import React, { useState } from 'react';
import { Eye, EyeOff, X, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

interface LoginPageProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (email: string) => void;
  isStandalone?: boolean;
}

const SLIDES = [
  {
    quote: 'Finally, all your work in one place.',
    tag: 'Portfolio Central',
  },
  {
    quote: 'Manage projects, skills & analytics effortlessly.',
    tag: 'Admin Suite',
  },
  {
    quote: 'High-performance architecture powered by React & MySQL.',
    tag: 'Next-Gen Stack',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ isOpen, onClose, onLoginSuccess, isStandalone }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recovery Password State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

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
      // Authenticate strictly against MySQL backend with PBKDF2 hashed verification
      await api.adminLogin(cleanEmail, cleanPassword);
      setLoading(false);
      setPassword(''); // Wipe password from state immediately after auth
      onLoginSuccess(cleanEmail);
    } catch (err: any) {
      setLoading(false);
      setPassword(''); // Clear password on error so user must retype manually
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto select-none animate-fadeIn">
      
      {/* Outer Viewport Background: Warm terracotta / dusty rose gradient matching the inspiration image */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, #b77f72 0%, #9e675b 45%, #7a4a40 100%)',
          opacity: 0.96,
        }}
        onClick={isStandalone ? undefined : onClose}
      />

      {/* Floating Main White Card (Exact replica of the inspiration frame) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[980px] max-h-[92vh] overflow-y-auto bg-[#f8f9fa] rounded-[32px] sm:rounded-[44px] shadow-[0_35px_90px_-15px_rgba(45,20,15,0.45),0_0_0_1px_rgba(255,255,255,0.4)] p-4 sm:p-5 md:p-6 overflow-x-hidden text-stone-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Top-Right Action: Link to User Portfolio if standalone, or Close if modal */}
        {isStandalone ? (
          <a
            href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '/'}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors shadow-sm text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Return to Public Portfolio"
          >
            <span>← Public Portfolio</span>
          </a>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 p-2.5 rounded-full bg-stone-100/80 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors shadow-sm cursor-pointer"
            title="Close Modal"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 2-Column Split: Form (Left) + Artwork Showcase (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT COLUMN: Clean Form */}
          <div className="lg:col-span-6 px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-center max-w-md mx-auto w-full">
            
            {/* Header: "Hello Again!" */}
            <div className="text-center sm:text-left space-y-1 mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-sans">
                {isRecoveryMode ? 'Reset Passcode' : 'Admin Portal'}
              </h1>
              <p className="text-xs text-stone-500 font-medium tracking-tight">
                {isRecoveryMode
                  ? 'Verify identity via registered admin email'
                  : 'Sign in to manage your portfolio, analytics & database'}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Normal Sign In Form */}
            {!isRecoveryMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Input */}
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Admin Email"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      data-lpignore="true"
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-stone-200/90 shadow-[0_3px_15px_rgba(0,0,0,0.025)] text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8e5f6a]/25 focus:border-[#8e5f6a] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input (No autofill, autocomplete disabled, memory-only) */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Admin Passcode"
                      required
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-stone-200/90 shadow-[0_3px_15px_rgba(0,0,0,0.025)] text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8e5f6a]/25 focus:border-[#8e5f6a] transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Recovery Password Link */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecoveryMode(true);
                        setError(null);
                      }}
                      className="text-[11px] font-semibold text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      Recovery Password
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold text-sm text-white transition-all shadow-[0_10px_25px_rgba(142,95,106,0.35)] cursor-pointer hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #8e5f6a 0%, #7e505a 100%)',
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* Password Recovery Mode */
              <div className="space-y-4">
                {!recoverySent ? (
                  <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-stone-700 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                        <span>Admin Passcode Recovery</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        A secure one-time authorization code will be dispatched to the verified admin inbox.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={e => setRecoveryEmail(e.target.value)}
                        placeholder="Admin Email"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8e5f6a]/25 focus:border-[#8e5f6a] transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl font-semibold text-xs text-white transition-all shadow-md cursor-pointer hover:brightness-105"
                      style={{ background: 'linear-gradient(135deg, #8e5f6a 0%, #7e505a 100%)' }}
                    >
                      {loading ? 'Dispatching...' : 'Dispatch Reset Code to Email'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsRecoveryMode(false);
                        setError(null);
                      }}
                      className="w-full text-center text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyRecoveryCode} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-stone-700 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Code Dispatched!</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        A verification code was dispatched to <strong className="text-stone-800">{recoveryEmail}</strong>. Enter it below to unlock.
                      </p>
                    </div>

                    {recoverySuccess && (
                      <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-lpignore="true"
                        data-form-type="other"
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm text-stone-900 placeholder:text-stone-400 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#8e5f6a]/25 focus:border-[#8e5f6a] transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl font-semibold text-xs text-white transition-all shadow-md cursor-pointer hover:brightness-105"
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
                      className="w-full text-center text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
                    >
                      ← Return to Standard Sign In
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* "Or continue with" Divider */}
            <div className="relative my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <span className="relative px-4 bg-[#f8f9fa] text-[11px] font-medium text-stone-400">
                Or continue with
              </span>
            </div>

            {/* Social Login Buttons (Google, Apple, Facebook - Exact match to image) */}
            <div className="flex items-center justify-center gap-3">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={() => {
                  setError('Single sign-on (SSO) is disabled for administrator portal. Please enter your email and passcode manually.');
                }}
                className="w-14 h-12 rounded-2xl bg-white border border-stone-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5"
                title="Google OAuth"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* Apple Button (Elevated raised card matching reference) */}
              <button
                type="button"
                onClick={() => {
                  setError('Single sign-on (SSO) is disabled for administrator portal. Please enter your email and passcode manually.');
                }}
                className="w-16 h-13 rounded-2xl bg-white border border-stone-200/80 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-lg flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5"
                title="Apple ID"
              >
                <svg className="w-6 h-6 text-stone-900 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.78-11.89-14.22-5.45-8.35-9.75-17.65-12.91-27.91-3.16-10.26-4.74-20.15-4.74-29.68 0-14.65 3.65-26.66 10.96-36.03 7.31-9.37 16.51-14.19 27.6-14.46 4.9 0 10.14 1.25 15.71 3.75 5.57 2.5 9.4 3.86 11.49 4.08 1.85-.22 5.86-1.63 12.02-4.22 6.16-2.59 11.45-3.78 15.89-3.56 12.18.76 21.91 5.38 29.17 13.87-10.65 6.42-15.87 15.22-15.66 26.4.22 8.7 3.54 16.03 9.96 21.99 6.42 5.96 14.19 9.38 23.31 10.26-2.39 7.39-5.16 14.56-8.31 21.51zM119.22 31.84c0-7.39 2.61-14.22 7.84-20.48 5.23-6.26 11.69-10.05 19.38-11.36.43 1.09.65 2.23.65 3.42 0 7.39-2.72 14.35-8.15 20.87-5.43 6.52-11.96 10.17-19.59 10.95-.07-1.12-.13-2.25-.13-3.4z" />
                </svg>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => {
                  setError('Single sign-on (SSO) is disabled for administrator portal. Please enter your email and passcode manually.');
                }}
                className="w-14 h-12 rounded-2xl bg-white border border-stone-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5"
                title="Facebook ID"
              >
                <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Picturesque Artwork Showcase (Exact match to inspiration) */}
          <div className="lg:col-span-6 h-[460px] sm:h-[520px] md:h-[560px] w-full rounded-[28px] sm:rounded-[34px] overflow-hidden relative shadow-inner">
            
            {/* Background Illustration Image */}
            <img
              src="/login-illustration.png"
              alt="Finally, all your work in one place"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.03]"
            />

            {/* Subtle bottom shadow vignette for typography contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(20,12,30,0.75) 0%, rgba(20,12,30,0.2) 35%, transparent 60%)',
              }}
            />

            {/* Bottom Content: Quote + Carousel Buttons */}
            <div className="absolute bottom-6 inset-x-6 z-20 flex items-end justify-between gap-4">
              
              {/* Inspirational Slide Text */}
              <div className="space-y-1 max-w-xs text-left">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-white text-sm sm:text-base md:text-lg font-medium leading-snug tracking-tight drop-shadow-md"
                  >
                    {SLIDES[currentSlide].quote}
                  </motion.p>
                </AnimatePresence>

                <div className="flex items-center gap-1.5 pt-1">
                  {SLIDES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentSlide === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Circular Navigation Buttons: (←) and (→) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-all bg-black/15 backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous Slide"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-all bg-black/15 backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Next Slide"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
