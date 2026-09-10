"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

function getIsMounted(): boolean {
  return true;
}

function getIsMountedServer(): boolean {
  return false;
}

function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function subscribeTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(emptySubscribe, getIsMounted, getIsMountedServer);
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);

  const toggleTheme = () => {
    const willBeDark = !document.documentElement.classList.contains("dark");
    if (willBeDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Prevent layout shift during SSR hydration
  if (!mounted) {
    return (
      <div
        className="w-13 h-6.5 rounded-full border border-zinc-400/50 bg-zinc-200/50 dark:bg-zinc-900/50 dark:border-zinc-700/50 opacity-60"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center w-13 h-6.5 px-0.5 rounded-full cursor-pointer
        transition-all duration-300 ease-in-out select-none
        border font-mono text-[10px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          isDark
            ? "bg-zinc-900/90 border-primary/50 shadow-[0_0_10px_rgba(0,255,0,0.25)] hover:border-primary hover:shadow-[0_0_14px_rgba(0,255,0,0.4)]"
            : "bg-zinc-200 border-zinc-400 hover:border-zinc-500 shadow-inner"
        }
      `}
    >
      {/* Background track icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun
          size={11}
          className={`transition-opacity duration-200 ${
            isDark ? "opacity-30 text-zinc-500" : "opacity-0"
          }`}
        />
        <Moon
          size={11}
          className={`transition-opacity duration-200 ${
            isDark ? "opacity-0" : "opacity-40 text-zinc-600"
          }`}
        />
      </div>

      {/* Sliding knob */}
      <div
        className={`
          relative z-10 flex items-center justify-center w-5 h-5 rounded-full
          transition-transform duration-300 ease-out shadow-sm
          ${
            isDark
              ? "translate-x-6.5 bg-zinc-950 border border-primary text-primary shadow-[0_0_8px_rgba(0,255,0,0.5)]"
              : "translate-x-0 bg-white border border-zinc-300 text-amber-500 shadow-xs"
          }
        `}
      >
        {isDark ? (
          <Moon size={11} className="transition-transform duration-300 animate-in spin-in-180" />
        ) : (
          <Sun size={11} className="transition-transform duration-300 animate-in spin-in-180" />
        )}
      </div>
    </button>
  );
}
