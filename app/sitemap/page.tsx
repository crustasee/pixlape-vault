"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CARDS, CardCategory } from "@/lib/db/card";
import { siteConfig } from "@/config/site";

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  APPS: "◉",
  TOOLS: "⌧",
  BRUSH: "⌑",
  TEMPLATE: "▤",
  ICON: "◈",
  "ART FOR SELL": "◆",
  OTHERS: "◌",
};

const BADGE_LABELS: Record<string, string> = {
  free: "FREE",
  paid: "PAID",
  premium: "PREMIUM",
};

// ─── All categories excluding "ALL ASSETS" ───────────────────────────────────
const ASSET_CATEGORIES = siteConfig.categories.filter(
  (c) => c !== "ALL ASSETS"
) as CardCategory[];

// ─── Route tree definition ────────────────────────────────────────────────────
const ROUTES = [
  {
    path: "/",
    label: "HOME PAGE",
    desc: "Main vault index with asset grid & sidebar filters",
    tags: ["INDEX", "STATIC"],
    icon: "⌂",
    external: false,
  },
  {
    path: "https://pixlblog-page.pixlape.workers.dev/",
    label: "/blog — ARTICLES & BLOG",
    desc: "External blog platform with guides, tutorials & release notes",
    tags: ["EXTERNAL"],
    icon: "⎈",
    external: true,
  },
  {
    path: "/contact",
    label: "/contact — CONTACT US",
    desc: "Multi-channel transmission dispatch form",
    tags: ["FORM", "STATIC"],
    icon: "⌨",
    external: false,
  },
  {
    path: "/help",
    label: "/help — HELP CENTER",
    desc: "Interactive FAQ, knowledge base & troubleshooting",
    tags: ["INFO", "STATIC"],
    icon: "⍰",
    external: false,
  },
  {
    path: "/changelog",
    label: "/changelog — VERSION LOGS",
    desc: "Platform release history and build changelogs",
    tags: ["LOGS", "STATIC"],
    icon: "⎗",
    external: false,
  },
  {
    path: "/pixlteam",
    label: "/pixlteam — THE TEAM",
    desc: "Creator directory, architect profiles and role cards",
    tags: ["INFO", "STATIC"],
    icon: "⌬",
    external: false,
  },
  {
    path: "/sitemap",
    label: "/sitemap — SYSTEM MAP",
    desc: "Full route index and asset directory (you are here)",
    tags: ["INDEX", "CURRENT"],
    icon: "◎",
    external: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function SiteMapPage() {
  const [activeCategory, setActiveCategory] = useState<CardCategory | "ALL">(
    "ALL"
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(ASSET_CATEGORIES)
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Group cards by first category
  const cardsByCategory = ASSET_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = CARDS.filter((c) => c.categories.includes(cat));
      return acc;
    },
    {} as Record<CardCategory, typeof CARDS>
  );

  // Filtered cards for the flat list view
  const filteredCards =
    activeCategory === "ALL"
      ? CARDS
      : CARDS.filter((c) => c.categories.includes(activeCategory));

  return (
    <div className="bg-surface min-h-screen flex flex-col font-mono">
      <Header />

      <main className="grow w-full mx-auto mt-12 py-6 px-12 flex flex-col gap-6">
        {/* ── Back ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="self-start text-xs font-mono text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
        >
          &lt; BACK
        </Link>

        {/* ── Page Title ───────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-pixel text-black-secondary tracking-wide uppercase">
            +++ SYSTEM MAP // PIXLAPE_VAULT +++
          </h1>
          <p className="text-xs text-text-secondary font-mono">
            Full route index, asset directory &amp; category map.
          </p>
        </div>

        {/* ── Stats Bar ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "TOTAL ROUTES", value: `${ROUTES.length + ASSET_CATEGORIES.length}` },
            { label: "VAULT ASSETS", value: `${CARDS.length}` },
            { label: "CATEGORIES", value: `${ASSET_CATEGORIES.length}` },
            { label: "STATUS", value: "OPTIMAL" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-border border border-black rounded-md px-4 py-3 flex flex-col gap-1"
            >
              <span className="text-[10px] text-text-secondary uppercase tracking-widest">
                {label}
              </span>
              <span className="text-sm font-pixel text-black-secondary">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Main Terminal Container ───────────────────────── */}
        <div className="bg-black border border-black-primary rounded-lg overflow-hidden shadow-lg">
          {/* Terminal title bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-black-primary border-b border-black-secondary">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
            </div>
            <span className="text-[10px] font-pixel text-text-secondary tracking-widest ml-2">
              PIXLAPE_VAULT — SITEMAP.SYS
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-primary font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              ACTIVE
            </span>
          </div>

          {/* ── Section 1: Main Routes ────────────────────────── */}
          <div className="p-6 border-b border-black-primary">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-pixel text-[10px] text-primary">▷</span>
              <span className="font-pixel text-xs text-primary tracking-wider">
                _MAIN PAGES &amp; ROUTE ENDPOINTS//
              </span>
            </div>

            <div className="ml-4 flex flex-col gap-1">
              {ROUTES.map((route) =>
                route.external ? (
                  <a
                    key={route.path}
                    href={route.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-black-primary transition-colors cursor-pointer"
                  >
                    <RouteRow route={route} />
                  </a>
                ) : (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="group flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-black-primary transition-colors cursor-pointer"
                  >
                    <RouteRow route={route} />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* ── Section 2: Asset Categories (collapsible) ──────── */}
          <div className="p-6 border-b border-black-primary">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-pixel text-[10px] text-primary">▷</span>
              <span className="font-pixel text-xs text-primary tracking-wider">
                _ASSETS/ (DIGITAL VAULT — CATEGORY MAP)//
              </span>
              <span className="ml-auto text-[10px] text-text-secondary font-mono">
                {CARDS.length} items
              </span>
            </div>

            {/* Category filter pills */}
            <div className="ml-4 flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setActiveCategory("ALL")}
                className={`text-[10px] font-pixel px-3 py-1.5 rounded-sm border transition-colors cursor-pointer ${
                  activeCategory === "ALL"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-black-secondary text-text-secondary hover:border-primary/60 hover:text-primary/70"
                }`}
              >
                ALL ({CARDS.length})
              </button>
              {ASSET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] font-pixel px-3 py-1.5 rounded-sm border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? "border-primary text-primary bg-primary/10"
                      : "border-black-secondary text-text-secondary hover:border-primary/60 hover:text-primary/70"
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  {cat} ({cardsByCategory[cat].length})
                </button>
              ))}
            </div>

            {/* Grouped view */}
            {activeCategory === "ALL" ? (
              <div className="ml-4 flex flex-col gap-3">
                {ASSET_CATEGORIES.map((cat) => {
                  const cards = cardsByCategory[cat];
                  if (cards.length === 0) return null;
                  const isOpen = expandedCategories.has(cat);

                  return (
                    <div key={cat} className="border border-black-primary rounded-md overflow-hidden">
                      {/* Category header — toggle */}
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-black-primary hover:bg-black-secondary/60 transition-colors text-left cursor-pointer"
                      >
                        <span className="text-primary text-xs">{CATEGORY_ICONS[cat]}</span>
                        <span className="font-pixel text-[10px] text-white tracking-wider uppercase">
                          /cards/category/{cat.toLowerCase().replace(/\s+/g, "-")}
                        </span>
                        <span className="text-[10px] text-text-secondary ml-1">
                          ({cards.length})
                        </span>
                        <span className="ml-auto text-primary text-xs transition-transform duration-200"
                          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                          ▷
                        </span>
                      </button>

                      {/* Cards list */}
                      {isOpen && (
                        <div className="divide-y divide-black-primary/60">
                          {cards.map((card) => (
                            <Link
                              key={card.id}
                              href={`/cards/${card.id}`}
                              className="group flex items-center gap-3 px-5 py-2 hover:bg-black-primary/50 transition-colors"
                            >
                              <span className="text-primary text-xs shrink-0">▢</span>
                              <span className="text-white text-xs group-hover:text-primary transition-colors truncate flex-1">
                                {card.title}
                              </span>
                              <span className="text-[9px] font-mono text-text-secondary shrink-0">
                                /cards/{card.id}
                              </span>
                              <span
                                className={`text-[9px] font-pixel px-1.5 py-0.5 rounded-sm border shrink-0 ${
                                  card.badge === "free"
                                    ? "border-primary/50 text-primary"
                                    : card.badge === "premium"
                                    ? "border-yellow-400/50 text-yellow-400"
                                    : "border-blue-400/50 text-blue-400"
                                }`}
                              >
                                {BADGE_LABELS[card.badge]}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Filtered flat list */
              <div className="ml-4 flex flex-col gap-1">
                <div className="text-[10px] text-text-secondary font-mono mb-2 px-1">
                  Showing {filteredCards.length} result{filteredCards.length !== 1 ? "s" : ""} in{" "}
                  <span className="text-primary">{activeCategory}</span>
                </div>
                {filteredCards.map((card) => (
                  <Link
                    key={card.id}
                    href={`/cards/${card.id}`}
                    className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black-primary transition-colors"
                  >
                    <span className="text-primary text-xs shrink-0">▢</span>
                    <span className="text-white text-xs group-hover:text-primary transition-colors truncate flex-1">
                      {card.title}
                    </span>
                    <span className="text-[9px] font-mono text-text-secondary shrink-0">
                      /cards/{card.id}
                    </span>
                    <span
                      className={`text-[9px] font-pixel px-1.5 py-0.5 rounded-sm border shrink-0 ${
                        card.badge === "free"
                          ? "border-primary/50 text-primary"
                          : card.badge === "premium"
                          ? "border-yellow-400/50 text-yellow-400"
                          : "border-blue-400/50 text-blue-400"
                      }`}
                    >
                      {BADGE_LABELS[card.badge]}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Section 3: Articles ───────────────────────────── */}
          <div className="p-6 border-b border-black-primary">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-pixel text-[10px] text-primary">▷</span>
              <span className="font-pixel text-xs text-primary tracking-wider">
                _ARTICLES/ (PUBLISHED GUIDES &amp; LOGS)//
              </span>
            </div>

            <div className="ml-4 flex flex-col gap-1">
              <a
                href="https://pixlblog-page.pixlape.workers.dev/styleuiux/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-black-primary transition-colors"
              >
                <span className="text-primary font-bold text-xs mt-0.5 shrink-0">↳</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs group-hover:text-primary transition-colors">
                    #01: 10 STYLE UI/UX TREND 2026
                  </div>
                  <div className="text-[10px] text-text-secondary mt-0.5">
                    External blog post — pixlblog-page.pixlape.workers.dev
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] text-text-secondary font-mono">AUG 22, 2026</span>
                  <span className="text-[9px] border border-yellow-500/40 text-yellow-400 px-1.5 py-0.5 rounded-sm font-pixel">
                    EXTERNAL
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* ── Section 4: System / Admin routes ─────────────── */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-pixel text-[10px] text-primary">▷</span>
              <span className="font-pixel text-xs text-primary tracking-wider">
                _SYSTEM/ (PROTECTED &amp; INTERNAL ROUTES)//
              </span>
            </div>

            <div className="ml-4 flex flex-col gap-1">
              {[
                { path: "/admin", label: "ADMIN DASHBOARD", desc: "Asset management, uploads & CMS panel", tags: ["PROTECTED", "ADMIN"] },
                { path: "/auth", label: "AUTH LOGIN", desc: "Administrator authentication gate", tags: ["PROTECTED", "AUTH"] },
              ].map((r) => (
                <div
                  key={r.path}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-md opacity-60 cursor-not-allowed select-none"
                >
                  <span className="text-red-400/70 font-bold text-xs mt-0.5 shrink-0">⊗</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-text-secondary text-xs">
                      {r.path} — {r.label}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">{r.desc}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] border border-red-500/30 text-red-400/60 px-1.5 py-0.5 rounded-sm font-pixel"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer note ───────────────────────────────────── */}
        <div className="flex items-center justify-between text-[10px] text-text-secondary font-mono pb-2">
          <span>PIXLAPE_VAULT / SITEMAP.SYS — AUTO-GENERATED INDEX</span>
          <span className="text-primary">
            {ROUTES.length + ASSET_CATEGORIES.length} ROUTES INDEXED
          </span>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Sub-component: single route row ─────────────────────────────────────────
function RouteRow({
  route,
}: {
  route: {
    icon: string;
    label: string;
    desc: string;
    tags: string[];
    path: string;
  };
}) {
  return (
    <>
      <span className="text-primary text-xs mt-0.5 shrink-0 w-4 text-center">
        {route.icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-white text-xs group-hover:text-primary transition-colors font-mono">
          {route.label}
        </span>
        <div className="text-[10px] text-text-secondary mt-0.5">{route.desc}</div>
      </div>
      <div className="flex gap-1 shrink-0 flex-wrap justify-end">
        {route.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-pixel ${
              tag === "CURRENT"
                ? "border-primary/60 text-primary bg-primary/10"
                : tag === "EXTERNAL"
                ? "border-yellow-500/40 text-yellow-400/80"
                : "border-black-secondary text-text-secondary"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
