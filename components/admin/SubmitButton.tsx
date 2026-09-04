'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { SpinnerGap, FloppyDisk, PlusCircle } from '@phosphor-icons/react';

interface SubmitButtonProps {
  label?: string;
  loadingLabel?: string;
  iconType?: 'save' | 'create';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function SubmitButton({
  label = 'SAVE CHANGES',
  loadingLabel = 'SAVING TO VAULT...',
  iconType = 'create',
  disabled = false,
  loading = false,
  className = '',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = loading || pending;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black-primary border border-black-primary font-mono font-black text-xs tracking-wider uppercase shadow-pixel hover:bg-emerald-400 hover:scale-98 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all cursor-pointer rounded ${className}`}
    >
      {isLoading ? (
        <>
          <SpinnerGap className="w-4 h-4 animate-spin text-black-primary" weight="bold" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {iconType === 'save' ? (
            <FloppyDisk className="w-4 h-4 text-black-primary" weight="bold" />
          ) : (
            <PlusCircle className="w-4 h-4 text-black-primary" weight="bold" />
          )}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export default SubmitButton;