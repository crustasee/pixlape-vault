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
  Key,
  WarningCircle,
  CheckCircle,
  Pulse,
} from '@phosphor-icons/react';
import { loginAction } from '@/app/actions/auth-actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('pixlape2026');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('redirect', redirectTo);

    startTransition(async () => {
      try {
        const result = await loginAction(null, formData);
        if (result && !result.success) {
          setErrorMessage(result.message || 'Authentication failed. Please check credentials.');
        } else {
          router.push(redirectTo);
        }
      } catch (err: unknown) {
        // In Next.js redirect() throws a NEXT_REDIRECT error which is expected
        if (err && typeof err === 'object' && 'digest' in err && typeof (err as { digest: string }).digest === 'string' && (err as { digest: string }).digest.includes('NEXT_REDIRECT')) {
          router.push(redirectTo);
          return;
        }
        setErrorMessage('Authentication error. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-black-secondary/70 flex flex-col justify-between font-mono text-black-primary p-4 sm:p-6 selection:bg-primary selection:text-black">
      {/* Top Navbar Brand */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto py-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-surface hover:text-primary transition-colors bg-black-primary/80 px-3 py-1.5 rounded-md border border-border/40 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" weight="bold" />
          <span>BACK TO PUBLIC VAULT</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-primary font-bold">
          <Pulse className="w-4 h-4 animate-pulse" weight="bold" />
          <span>SECURITY GATEWAY V.2.6</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-xl w-full mx-auto my-auto py-6">
        <div className="bg-surface border border-black-primary rounded-lg overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="bg-border text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse border border-black" />
              <div className="flex flex-col">
                <span className="text-xs font-pixel tracking-wider text-black-secondary uppercase">
                  ++ PIXLAPE VAULT // AUTH ++
                </span>
                <span className="text-[10px] text-black-secondary">
                  SYSTEM OPERATOR ACCESS CONSOLE
                </span>
              </div>
            </div>
            <ShieldCheck className="w-6 h-6 text-black-secondary" weight="duotone" />
          </div>

          {/* Form Content */}
          <div className="p-6 flex flex-col gap-5">
            {/* Context Notice */}
            <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs text-emerald-950 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" weight="bold" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">AUTHENTICATION REQUIRED</span>
                <span className="text-[11px] text-emerald-900 leading-relaxed">
                  Enter authorized credentials to access vault digital catalog and article editor.
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-400 rounded p-3 text-xs text-rose-900 flex items-center gap-2 animate-shake">
                <WarningCircle className="w-4 h-4 text-rose-600 shrink-0" weight="bold" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="redirect" value={redirectTo} />

              {/* Username Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-xs font-bold text-black-primary uppercase flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                    OPERATOR ID / USERNAME
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">*REQUIRED</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    disabled={isPending}
                    className="w-full px-3 py-2.5 bg-white border border-black-primary rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-black-primary uppercase flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <LockKey className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                    ACCESS PASSCODE
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">*REQUIRED</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isPending}
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-black-primary rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black-secondary hover:text-black-primary p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeSlash className="w-4 h-4" weight="bold" />
                    ) : (
                      <Eye className="w-4 h-4" weight="bold" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Demo Fill Helper */}
              <div className="flex items-center justify-between bg-white border border-border rounded p-2.5 text-[11px]">
                <span className="text-black-secondary flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-emerald-700" weight="bold" />
                  Default: <code className="font-bold text-black-primary">admin</code> /{' '}
                  <code className="font-bold text-black-primary">pixlape2026</code>
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="px-2 py-0.5 bg-surface hover:bg-primary text-black-primary font-bold rounded border border-black-primary text-[10px] cursor-pointer transition-all shadow-xs"
                >
                  AUTO-FILL
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-primary hover:bg-emerald-400 text-black-primary border border-black-primary rounded font-mono font-black text-xs uppercase tracking-wider shadow-pixel hover:scale-98 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>AUTHENTICATING OPERATOR...</span>
                  </>
                ) : (
                  <>
                    <span>GRANT ACCESS & PROCEED</span>
                    <ArrowRight className="w-4 h-4" weight="bold" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Terminal Specs */}
          <div className="bg-black-primary/95 text-zinc-400 p-3 px-5 border-t border-black text-[10px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-primary" weight="bold" />
              AES-256 SECURED SESSION
            </span>
            <span className="text-zinc-500">HOST: PIXLAPE VAULT</span>
          </div>
        </div>
      </main>

      {/* Bottom Footer Credits */}
      <footer className="text-center text-[11px] text-black-secondary max-w-5xl w-full mx-auto py-2">
        <span>© {new Date().getFullYear()} PIXLape Vault Lab. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black-secondary/70 flex items-center justify-center font-mono text-primary text-xs">
          <span>LOADING SECURITY GATEWAY...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
