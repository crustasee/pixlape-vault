import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full border border-black dark:border-zinc-800 bg-white dark:bg-card p-8 rounded-lg shadow-pixel flex flex-col items-center gap-5">
          <div className="text-4xl animate-bounce select-none">⚠</div>

          <div className="space-y-2">
            <span className="text-[11px] font-pixel tracking-widest text-red-500 uppercase">
              [ ERROR 404 // SECTOR_NOT_FOUND ]
            </span>
            <h1 className="text-xl sm:text-2xl font-pixel text-black-primary dark:text-zinc-100 uppercase">
              DATA MISSING
            </h1>
            <p className="text-xs font-mono text-text-secondary dark:text-zinc-400 leading-relaxed">
              The requested asset or coordinate does not exist in the PIXLape Vault matrix. It may have been relocated or purged.
            </p>
          </div>

          <div className="w-full border-t border-border dark:border-zinc-800 pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 bg-primary text-black font-pixel text-xs rounded-md border border-black hover:scale-98 active:scale-95 transition-all shadow-pixel-sm font-bold text-center"
            >
              RETURN TO TROVE →
            </Link>
            <Link
              href="/help"
              className="py-2.5 px-4 bg-surface dark:bg-zinc-800 text-black-secondary dark:text-zinc-300 font-mono text-xs rounded-md border border-border dark:border-zinc-700 hover:text-black-primary dark:hover:text-white transition-all text-center"
            >
              HELP CENTER
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
