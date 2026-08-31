"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CARDS } from "@/lib/db/card";

export default function SiteMap() {
  return (
    <div className="bg-border min-h-screen flex flex-col font-mono">
      <Header />

      {/* Main Content */}
      <main className="grow w-full max-w-full mx-auto px-6 mt-12 py-8 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/"
          className="self-start text-xs font-mono text-black-secondary hover:text-primary transition-colors flex items-center gap-3"
        >
          &lt; BACK
        </Link>

        

        {/* Console Terminal Container */}
        <div className="bg-black-secondary border border-black rounded-lg  p-6 sm:p-8 shadow-md text-white mx-24">
          {/* Console Header Section */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-pixel">
              <span className="text-primary flex items-center gap-9">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
                SYSTEM MAP ONLINE // ACTIVE INDEX
              </span>
              <span className="text-primary">STATUS: OPTIMAL (100% ROUTE ACCESSIBLE)</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="bg-black-primary p-3 rounded-md border border-black">
                <p className="text-text-secondary mb-1">ROOT DIRECTORY:</p>
                <p className="text-green-400 font-bold">[ PIXLAPE_VAULT ]</p>
              </div>
              <div className="bg-black-primary p-3 rounded-md border border-black">
                <p className="text-text-secondary mb-1">ACCESS LEVEL:</p>
                <p className="text-green-400 font-bold">[ PUBLIC / USER ]</p>
              </div>
              <div className="bg-black-primary p-3 rounded-md border border-black">
                <p className="text-text-secondary mb-1">INDEXED ASSETS:</p>
                <p className="text-green-400 font-bold">[{CARDS.length} VAULT ITEMS]</p>
              </div>
            </div>
          </div>

          {/* Directory Tree Structure */}
          <div className="space-y-6 text-sm">
            {/* Root Node */}
            <div>
              <div className="flex items-center gap-9 mb-4 border-b border-black-secondary pb-8">
            
                <span className="font-pixel text-lg sm:text-xl text-primary">
                  _______PIXLAPE_VAULT//__
                </span>
              </div>

              <div className="ml-4 sm:ml-8 space-y-3">
                {/* Main Pages */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4 font-pixel text-xs text-primary uppercase">
                    <span>▷</span>  _MAIN PAGES & ROUTE ENDPOINTS//
                    
                  </div>

                  <div className="ml-9 font-mono text-xs">
                    <Link
                      href="/"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:text-surface font-bold">/ (HOME PAGE)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[INDEX] [STATIC]</span>
                    </Link>

                    <Link
                      href="/articles"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:text-surface">/articles (ARTICLES & BLOG)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[LISTING] [DYNAMIC]</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:text-surface">/contact (CONTACT US)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[FORM] [STATIC]</span>
                    </Link>

                    <Link
                      href="/help"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:text-surface">/help (HELP CENTER & FAQ)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[INFO] [STATIC]</span>
                    </Link>
                  </div>
                </div>

                {/* Vault Asset Items Directory */}
                <div className="space-y-2 pt-4 ">
                  <div className="flex items-center gap-4 font-pixel text-xs text-primary uppercase">
                    <span>▷</span> _ASSETS/ (DIGITAL VAULT ITEMS)//
                  </div>

                  <div className="ml-9 grid grid-cols-1 md:grid-cols-1 font-mono text-xs">
                    {CARDS.map((card) => (
                      <Link
                        key={card.id}
                        href={`/cards/${card.id}`}
                        className="flex items-center justify-between p-1 rounded-md hover:border-primary hover:text-primary transition-all group"
                      >
                        <div className="flex items-center gap-4 overflow-hidden">
                          <span className="text-primary font-bold">▢</span>
                          <span className="text-white group-hover:text-primary truncate">{card.title}</span>
                        </div>
                        <span className="text-[9px] text-border font-mono uppercase shrink-0 border border-border px-1.5 py-0.5 rounded-sm ml-2">
                          {card.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Article Entries */}
                <div className="space-y-5 pt-6 border-white/10">
                  <div className="flex items-center gap-4 font-pixel text-xs text-primary uppercase">
                    <span>▷</span> _ARTICLES/ (PUBLISHED GUIDES & LOGS)//
                  </div>

                  <div className="ml-9 space-y-1.5 font-mono text-xs">
                    <Link
                      href="/articles/1"
                      className="flex items-center justify-between p-2  border border-black-secondary rounded-md hover:border-primary hover:text-primary transition-all group"
                    >
                      <div className="flex items-center gap-9">
                        <span className="text-primary font-bold">↳</span>
                        <span className="text-white group-hover:text-primary">#01: OPTIMIZING RETRO WORKFLOWS & VAULT STORAGE</span>
                      </div>
                      <span className="text-[10px] text-text-secondary font-mono">[AUG 22, 2026]</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}