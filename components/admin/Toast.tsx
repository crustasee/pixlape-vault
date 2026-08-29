'use client';

import React from 'react';
import {
  CheckCircle,
  WarningCircle,
  Info,
  Warning,
  X,
} from '@phosphor-icons/react';
import type { ToastMessage } from '@/hooks/useToast';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-mono">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded-md border text-xs shadow-lg transition-all transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500'
                : isError
                ? 'bg-rose-950 text-rose-200 border-rose-500'
                : isWarning
                ? 'bg-amber-950 text-amber-200 border-amber-500'
                : 'bg-zinc-900 text-zinc-100 border-zinc-500'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-400" weight="bold" />}
              {isError && <WarningCircle className="w-4 h-4 text-rose-400" weight="bold" />}
              {isWarning && <Warning className="w-4 h-4 text-amber-400" weight="bold" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-primary" weight="bold" />}
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-bold uppercase tracking-wider block">
                {toast.title}
              </span>
              {toast.message && (
                <p className="text-[11px] opacity-90 mt-0.5 leading-tight">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-white/70 hover:text-white p-0.5 rounded cursor-pointer"
              title="Close notification"
            >
              <X className="w-3.5 h-3.5" weight="bold" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
