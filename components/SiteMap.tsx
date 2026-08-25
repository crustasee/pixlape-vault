"use client";

import React from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { CARDS } from "@/lib/db/card";

export default function SiteMap() {
  return (
    <div className="bg-black-secondary min-h-screen flex flex-col font-mono">
      <Header />

      {/* Main Content */}
      <main className="grow w-full max-w-full mx-auto px-6 mt-17 py-8 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/"
          className="self-start text-xs font-mono text-text-secondary hover:text-primary transition-colors flex items-center gap-3"
        >
          &lt; BACK TO VAULT
        </Link>

        <h1 className="text-xl sm:text-xl font-pixel text-black-primary tracking-wide uppercase">
          ++++++++++++++SYSTEM MAP // SITE ARCHITECTURE & INDEX+++++++++++++++
        </h1>

        {/* Console Terminal Container */}
        <div className="bg-black-primary/60 border border-black rounded-lg  p-6 sm:p-8 shadow-md text-white mx-12">
          {/* Console Header Section */}
          <div className="mb-8 border-b border-white/20 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-pixel">
              <span className="text-primary flex items-center gap-9">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
                SYSTEM MAP ONLINE // ACTIVE INDEX
              </span>
              <span className="text-primary">STATUS: OPTIMAL (100% ROUTE ACCESSIBLE)</span>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="bg-black-primary p-3 rounded-xs border border-border">
                <p className="text-text-secondary mb-1">ROOT DIRECTORY:</p>
                <p className="text-green-400 font-bold">[ PIXLAPE_VAULT ]</p>
              </div>
              <div className="bg-black-primary p-3 rounded-xs border border-border">
                <p className="text-text-secondary mb-1">ACCESS LEVEL:</p>
                <p className="text-green-400 font-bold">[ PUBLIC / USER ]</p>
              </div>
              <div className="bg-black-primary p-3 rounded-xs border border-border">
                <p className="text-text-secondary mb-1">INDEXED ASSETS:</p>
                <p className="text-green-400 font-bold">[{CARDS.length} VAULT ITEMS]</p>
              </div>
            </div>
          </div>

          {/* Directory Tree Structure */}
          <div className="space-y-6 text-sm">
            {/* Root Node */}
            <div>
              <div className="flex items-center gap-9 mb-4 border-b-1 border-black-secondary pb-8">
            
                <span className="font-pixel text-lg sm:text-xl text-primary">
                  _______PIXLAPE_VAULT//__
                </span>
              </div>

              <div className="ml-4 sm:ml-9 space-y-5">
                {/* Main Pages */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 font-pixel text-xs text-primary uppercase">
                    <span>▷</span>  _MAIN PAGES & ROUTE ENDPOINTS//
                    
                  </div>

                  <div className="ml-9 space-y-4 font-mono text-xs">
                    <Link
                      href="/"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:underline font-bold">/ (HOME PAGE)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[INDEX] [STATIC]</span>
                    </Link>

                    <Link
                      href="/articles"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:underline">/articles (ARTICLES & BLOG)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[LISTING] [DYNAMIC]</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:underline">/contact (CONTACT US)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[FORM] [STATIC]</span>
                    </Link>

                    <Link
                      href="/help"
                      className="flex items-center gap-4 hover:text-primary transition-colors py-1 group"
                    >
                      <span className="text-primary font-bold">→</span>
                      <span className="text-white group-hover:underline">/help (HELP CENTER & FAQ)</span>
                      <span className="text-text-secondary text-[11px] ml-auto">[INFO] [STATIC]</span>
                    </Link>
                  </div>
                </div>

                {/* Vault Asset Items Directory */}
                <div className="space-y-5 pt-5 border-t border-border">
                  <div className="flex items-center gap-4 font-pixel text-xs text-primary uppercase">
                    <span>▷</span> _ASSETS/ (DIGITAL VAULT ITEMS)//
                  </div>

                  <div className="ml-9 grid grid-cols-1 md:grid-cols-1 gap-4 font-mono text-xs">
                    {CARDS.map((card) => (
                      <Link
                        key={card.id}
                        href={`/cards/${card.id}`}
                        className="flex items-center justify-between p-2 bg-black-primary border border-black-secondary rounded-xs hover:border-primary hover:text-primary transition-all group"
                      >
                        <div className="flex items-center gap-8 overflow-hidden">
                          <span className="text-primary font-bold">●●●●○○</span>
                          <span className="text-white group-hover:text-primary truncate">{card.title}</span>
                        </div>
                        <span className="text-xs text-text-secondary font-pixel uppercase shrink-0 border border-white/20 px-1.5 py-0.5 rounded-xs ml-2">
                          {card.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Article Entries */}
                <div className="space-y-5 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4 font-pixel text-xs text-primary uppercase">
                    <span>▷</span> _ARTICLES/ (PUBLISHED GUIDES & LOGS)//
                  </div>

                  <div className="ml-9 space-y-1.5 font-mono text-xs">
                    <Link
                      href="/articles/1"
                      className="flex items-center justify-between p-3 bg-black-primary border border-black-secondary rounded-xs hover:border-primary hover:text-primary transition-all group"
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