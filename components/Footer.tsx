"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resources = [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Article & Blog", href: "https://pixlblog-page.pixlape.workers.dev/" },
    { label: "Pixlape Team", href: "/pixlteam" },
    { label: "Sitemap", href: "/sitemap" },
    { label: "Changelog", href: "/changelog" },
  ];

  const socials = [
    { name: "GitHub", href: "https://github.com", icon: "⌗" },
    { name: "Twitter", href: "https://twitter.com", icon: "𝕏" },
    { name: "Instagram", href: "https://instagram.com", icon: "◈" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "▣" },
    { name: "Discord", href: "https://discord.com", icon: "⌂" },
  ];

  return (
    <footer className="w-full border-t-2 border-black bg-black text-white font-mono mt-auto">
      {/* ── ------------------------------------------------------ Top Main Footer Grid ── ----------------------------------------------------- */}
      <div className="max-w-full mx-auto px-8 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* -----------------------------------------------Brand & About (5 Cols) ---------------------------------------------------- */}
          <div className="lg:col-span-10 flex flex-col gap-12">
            <div className="flex items-center gap-9">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-black-primary shadow-sm shrink-0 hover:bg-primary hover:scale-105 transition-all duration-150">
                <Image src="/logop2.svg" alt="PIXLape Logo" width={85} height={85} />
              </div>
              <span className="text-sm font-pixel tracking-wider text-border">
                +++ PIXLape.com
              </span>
            </div>

            {/* ---------------------------------------------------------Social Icons Bar---------------------------------------------------------------------- */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="px-3 py-1.5 text-xs bg-black border border-black-secondary rounded-sm hover:border-primary hover:text-primary hover:bg-black-primary transition-all duration-150 flex items-center gap-1.5"
                >
                  <span className="text-xs text-black-secondary hover:text-primary">{social.icon}</span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/*     =================================================Resources Column (2 Cols) ====================================================================== */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-pixel uppercase tracking-wider text-border/50 pb-2">
              _NAVIGATE_
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#aaaaaa]">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-primary hover:translate-x-1 inline-block transition-transform duration-150"
                  >
                    # {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── ----------------------------------------Bottom Bar & Copyright ── ---------------------------------------- */}
      <div className="border-t border-black bg-black-primary py-4 px-4 lg:px-10">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-border/60">
          
          <div className="flex items-center gap-2">
            <span>PIXLape Trove © 2026</span>
            <span className="text-border">|</span>
            <span className="text-border">ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">PRIVACY</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">TERMS</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">LICENSE</a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="px-4 py-1 bg-black-primary border border-black-secondary rounded-lg text-xs text-black-secondary hover:text-primary hover:border-primary transition-all duration-150 cursor-pointer flex items-center gap-3"
          >
            <span>▲</span> TOP
          </button>

        </div>
      </div>
    </footer>
  );
}
