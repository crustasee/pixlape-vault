import React from "react";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Link from "next/link";

const CHANGELOG_LOGS = [
  {
    version: "v1.4.2-STABLE",
    date: "AUG 22, 2026",
    title: "Vault Asset Categorization & Markdown Documentation Engine",
    changes: [
      "Added dynamic category filtering in Sidebar and CardGrid components.",
      "Integrated rich MarkdownDescription renderer for vault asset details.",
      "Implemented full-page Article document view and interactive like buttons.",
      "Added team directory profile cards with white photo image frame styling.",
    ],
  },
  {
    version: "v1.2.0",
    date: "AUG 10, 2026",
    title: "Theme System & Component Architecture Overhaul",
    changes: [
      "Restructured design system tokens with retro monochrome palettes.",
      "Added support for multi-variant badges (Free, Paid, Premium, and Categories).",
      "Optimized SVG asset delivery with root-relative URL resolution.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono flex flex-col">
      <Header />

      <main className="mx-24 mt-[52px] pb-14 flex-1 flex flex-col gap-4">
        <Link
          href="/"
          className="self-start mt-4 text-xs font-mono text-text-secondary hover:text-primary transition-colors flex items-center gap-3"
        >
          &lt; BACK
        </Link>

        <h1 className="text-xl sm:text-xl font-pixel text-black-secondary tracking-wide uppercase">
          + CHANGELOG & VERSION LOGS +
        </h1>

        <div className="bg-border border border-black rounded-md p-8 flex flex-col gap-7 shadow-xs">
          {CHANGELOG_LOGS.map((log) => (
            <div key={log.version} className="border-b border-border pb-6 last:border-0 last:pb-0 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-7 py-2 bg-black-primary/30 text-black-primary text-xs font-pixel rounded-md">
                  {log.version}
                </span>
                <span className="text-xs text-black-primary font-mono">{log.date}</span>
              </div>

              <h2 className="text-lg font-mono font-bold text-black-primary">
                {log.title}
              </h2>

              <ul className="flex flex-col gap-1.5 pl-2 text-xs text-black-primary">
                {log.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="text-black-primary font-bold">✓</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
