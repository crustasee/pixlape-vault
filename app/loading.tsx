import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center font-mono text-black-primary">
      <div className="flex flex-col items-center gap-4 p-8 bg-border border border-black rounded-lg shadow-sm">
        <div className="w-8 h-8 border-4 border-black border-t-primary rounded-full animate-spin" />
        <span className="text-xs font-pixel tracking-wider animate-pulse">
          INITIALIZING VAULT DATA...
        </span>
      </div>
    </div>
  );
}