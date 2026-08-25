"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono flex flex-col">
      <Header />
      <main className="flex-1 max-w-full mx-auto px-6 sm:px-12 pt-24 pb-16 flex flex-col items-center justify-center text-center gap-6">
        <div className="bg-border border border-black rounded-lg p-8 sm:p-12 max-w-lg w-full flex flex-col items-center gap-4 shadow-md">
          <span className="text-4xl">⚠️</span>
          <h1 className="text-xl font-pixel text-black-primary">
            [ SYSTEM FAULT // 500 ]
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            An unexpected error occurred while executing the vault protocol.
          </p>
          {error.message && (
            <div className="w-full bg-white border border-black p-3 rounded text-[11px] text-red-600 font-mono overflow-x-auto text-left">
              {error.message}
            </div>
          )}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-primary text-black-primary border border-black rounded-md text-xs font-mono font-bold hover:bg-green-400 transition-all cursor-pointer"
            >
              RETRY OPERATION &gt;
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-black-secondary text-white border border-black rounded-md text-xs font-mono font-bold hover:bg-black-primary transition-all"
            >
              RETURN HOME &gt;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}