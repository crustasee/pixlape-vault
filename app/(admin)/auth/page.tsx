'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LockKey,
  User,
  Eye,
  EyeSlash,
  ShieldCheck,
  Terminal,
  ArrowRight,
  ArrowLeft,
  WarningCircle,
  CheckCircle,
  Pulse,
  Fingerprint,
  Check,
  X,
  Key,
} from '@phosphor-icons/react';
import { loginAction } from '@/app/actions/auth-actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [justAutoFilled, setJustAutoFilled] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reset error when user types
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  // Detect Caps Lock state
  const handleKeyActivity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleFillDemo = (type: 'admin' | 'pixladmin' = 'admin') => {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('pixlape2026');
    } else {
      setUsername('pixladmin');
      setPassword('pixlape11223344');
    }
    setErrorMessage(null);
    setJustAutoFilled(true);
    setTimeout(() => setJustAutoFilled(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both Operator ID and Passcode.');
      return;
    }

    setErrorMessage(null);
    const formData = new FormData();
    formData.set('username', username.trim());
    formData.set('password', password);
    formData.set('redirect', redirectTo);

    startTransition(async () => {
      try {
        const result = await loginAction(null, formData);
        if (result && !result.success) {
          setErrorMessage(result.message || 'Authentication failed. Please verify credentials.');
        } else {
          setIsSuccess(true);
          router.push(redirectTo);
        }
      } catch (err: unknown) {
        // Next.js redirect() throws a NEXT_REDIRECT error which is expected
        if (
          err &&
          typeof err === 'object' &&
          'digest' in err &&
          typeof (err as { digest: string }).digest === 'string' &&
          (err as { digest: string }).digest.includes('NEXT_REDIRECT')
        ) {
          setIsSuccess(true);
          router.push(redirectTo);
          return;
        }
        setErrorMessage('Authentication error encountered. Please try again.');
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-[#07090c] flex flex-col justify-between font-mono text-zinc-100 p-4 sm:p-6 overflow-x-hidden selection:bg-primary selection:text-black">
      {/* ── Background Grid & Ambient Glow Aesthetics ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* Ambient Top Glow Orbs */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-138 h-88 bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Top Navbar / Gateway Telemetry Header ── */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl w-full mx-auto py-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-all duration-200 bg-zinc-900/80 hover:bg-zinc-800/90 px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:-translate-x-0.5 group-hover:text-primary transition-all duration-200" weight="bold" />
          <span className="font-semibold tracking-wide text-[11px]">EXIT TO PUBLIC VAULT</span>
        </Link>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-zinc-500">GATEWAY:</span>
            <span className="text-zinc-300 font-bold">AP-SOUTHEAST-1</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-[11px] text-primary font-bold shadow-[0_0_15px_rgba(0,255,0,0.15)] backdrop-blur-md">
            <Pulse className="w-3.5 h-3.5 animate-pulse text-primary" weight="bold" />
            <span>SECURE GATEWAY v2.6</span>
          </div>
        </div>
      </header>

      {/* ── Main Authentication Console ── */}
      <main className="relative z-10 max-w-lg w-full mx-auto my-auto py-6 sm:py-8">
        <div className="relative bg-zinc-900/95 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/80 hover:shadow-[0_0_50px_-15px_rgba(0,255,0,0.18)]">
          {/* Top Neon Accent Line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

          {/* Console Header Bar */}
          <div className="bg-zinc-950/90 border-b border-zinc-800/80 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Traffic dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-400/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-400/50" />
              </div>

              {/* Title & Brand */}
              <div className="h-4 w-px bg-zinc-800 mx-0.5" />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-zinc-900 border border-zinc-800">
                  <Image src="/logop2.svg" alt="Logo" width={16} height={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-pixel tracking-wider text-zinc-100 uppercase">
                    PIXLAPE VAULT // AUTH
                  </span>
                  <span className="text-[10px] text-zinc-500 tracking-tight">
                    OPERATOR ACCESS CONSOLE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" weight="duotone" />
              <span className="font-bold tracking-wider">AES-256</span>
            </div>
          </div>

          {/* Console Body */}
          <div className="p-6 sm:p-7 flex flex-col gap-5">
            {/* Terminal Prompt Alert */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-lg p-3.5 text-xs text-zinc-300 flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                <Terminal className="w-4 h-4 text-primary" weight="bold" />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100 text-[11px] tracking-wide">
                    AUTHENTICATION PROTOCOL
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Provide authorized credentials to access asset management, article editor, and integrations.
                </p>
              </div>
            </div>

            {/* Error Banner with shake animation */}
            {errorMessage && (
              <div className="bg-rose-950/70 border border-rose-800/80 rounded-lg p-3 text-xs text-rose-200 flex items-center justify-between gap-2.5 animate-shake shadow-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <WarningCircle className="w-4 h-4 text-rose-400 shrink-0" weight="bold" />
                  <span className="font-semibold text-[11px] truncate">{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-200 p-1 rounded hover:bg-rose-900/50 transition-colors"
                  title="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" weight="bold" />
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              {/* Operator ID Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" weight="bold" />
                    OPERATOR ID
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">IDENTIFIER</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    autoFocus
                    autoComplete="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="e.g. admin or pixladmin"
                    disabled={isPending || isSuccess}
                    className="w-full pl-3.5 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 group-hover:border-zinc-700 rounded-lg text-xs font-mono font-medium text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner transition-all duration-200 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <LockKey className="w-3.5 h-3.5 text-zinc-400" weight="bold" />
                    ACCESS PASSCODE
                  </span>
                  {capsLockActive && (
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.2 rounded animate-pulse">
                      [CAPS LOCK ON]
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyActivity}
                    onKeyUp={handleKeyActivity}
                    placeholder="••••••••••••"
                    disabled={isPending || isSuccess}
                    className="w-full pl-3.5 pr-11 py-2.5 bg-zinc-950/80 border border-zinc-800 group-hover:border-zinc-700 rounded-lg text-xs font-mono font-medium text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner transition-all duration-200 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                    title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? (
                      <EyeSlash className="w-4 h-4" weight="bold" />
                    ) : (
                      <Eye className="w-4 h-4" weight="bold" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Fill / Dev Helper */}
              <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-800/90 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                  <span className="text-[10px] text-zinc-400 font-mono">
                    DEFAULT: <span className="text-zinc-300 font-semibold">admin</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin')}
                    disabled={isPending || isSuccess}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      justAutoFilled
                        ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,255,0,0.3)]'
                        : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-750 hover:border-zinc-700'
                    }`}
                  >
                    {justAutoFilled ? (
                      <>
                        <Check className="w-3 h-3" weight="bold" />
                        <span>LOADED</span>
                      </>
                    ) : (
                      <span>QUICK FILL</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || isSuccess}
                className={`relative w-full py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 mt-1 cursor-pointer overflow-hidden ${
                  isSuccess
                    ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-primary hover:bg-[#00e600] active:scale-[0.99] text-black border border-primary shadow-[0_0_20px_rgba(0,255,0,0.25)] hover:shadow-[0_0_25px_rgba(0,255,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" weight="bold" />
                    <span>ACCESS GRANTED // REDIRECTING...</span>
                  </>
                ) : isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING CIPHER KEYS...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" weight="bold" />
                    <span>AUTHENTICATE & ENTER VAULT</span>
                    <ArrowRight className="w-4 h-4 ml-1" weight="bold" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Console Status Footer */}
          <div className="bg-zinc-950 border-t border-zinc-800/80 px-5 py-3 text-[10px] text-zinc-500 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>SECURE SESSION: 7 DAYS</span>
            </span>
            <span className="font-mono text-zinc-400">
              PRESS <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold">↵ ENTER</kbd> TO SUBMIT
            </span>
          </div>
        </div>
      </main>

      {/* ── Bottom Footer Credits ── */}
      <footer className="relative z-10 text-center text-[11px] text-zinc-500 max-w-4xl w-full mx-auto py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-zinc-900 pt-3">
          <span>© {new Date().getFullYear()} PIXLape Vault Lab. All operations logged.</span>
          <div className="flex items-center gap-3 text-zinc-600">
            <span>TERMINAL v2.6.4</span>
            <span>•</span>
            <span>SHA-256 ENCRYPTED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090c] flex flex-col items-center justify-center font-mono text-primary gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs tracking-wider">INITIALIZING GATEWAY TELEMETRY...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
