'use client';

import React, { useState } from 'react';
import { Key, ArrowsClockwise, Check, Copy } from '@phosphor-icons/react';

export interface ProductIdInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: string;
  showGenerate?: boolean;
  showCopy?: boolean;
  className?: string;
  inputClassName?: string;
  helperText?: string;
}

export function generateRandomProductId(prefix: string = 'card-'): string {
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}${rand}`;
}

export function ProductIdInput({
  value,
  onChange,
  id = 'product-id',
  name = 'productId',
  label = 'CARD / ASSET ID',
  placeholder = 'e.g. card-9x2a1',
  required = false,
  disabled = false,
  readOnly = false,
  prefix = 'card-',
  showGenerate = true,
  showCopy = true,
  className = '',
  inputClassName = '',
  helperText,
}: ProductIdInputProps) {
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const newId = generateRandomProductId(prefix);
    onChange(newId);
  };

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 font-mono ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs font-bold text-black-primary flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
            <span>{label}</span>
            {required && <span className="text-rose-600">*</span>}
          </label>
          {value && (
            <span className="text-[10px] text-black-secondary bg-white px-1.5 py-0.5 border border-border rounded font-bold">
              {value.length} CHARS
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full border border-black-primary px-3 py-2 rounded text-xs font-mono font-bold focus:outline-none transition-colors ${
              disabled ? 'bg-surface text-black-secondary cursor-not-allowed' : 'bg-white text-black-primary'
            } ${inputClassName}`}
          />
        </div>

        {showGenerate && !readOnly && !disabled && (
          <button
            type="button"
            onClick={handleGenerate}
            title="Auto-generate Random ID"
            className="flex items-center gap-1 px-2.5 py-2 bg-surface hover:bg-border text-black-primary border border-black-primary rounded text-xs font-bold font-mono transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowsClockwise className="w-3.5 h-3.5" weight="bold" />
            <span className="hidden sm:inline text-[10px]">GENERATE</span>
          </button>
        )}

        {showCopy && value && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy ID to Clipboard"
            className="flex items-center gap-1 px-2.5 py-2 bg-surface hover:bg-border text-black-primary border border-black-primary rounded text-xs font-mono transition-all active:scale-95 cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" weight="bold" />
                <span className="hidden sm:inline text-[10px] text-emerald-600 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                <span className="hidden sm:inline text-[10px]">COPY</span>
              </>
            )}
          </button>
        )}
      </div>

      {helperText && <span className="text-[10px] text-black-secondary">{helperText}</span>}
    </div>
  );
}

export default ProductIdInput;
