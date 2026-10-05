"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GithubLogo,
  XLogo,
  InstagramLogo,
  LinkedinLogo,
  DiscordLogo,
  YoutubeLogo,
  TwitchLogo,
  TiktokLogo,
} from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

const getSocialIcon = (name: string) => {
  const key = name.toLowerCase();
  switch (key) {
    case "github":
      return GithubLogo;
    case "twitter":
    case "x":
      return XLogo;
    case "instagram":
      return InstagramLogo;
    case "linkedin":
      return LinkedinLogo;
    case "discord":
      return DiscordLogo;
    case "youtube":
      return YoutubeLogo;
    case "twitch":
      return TwitchLogo;
    case "tiktok":
      return TiktokLogo;
    default:
      return null;
  }
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {siteConfig.socials.map((social) => {
                const IconComponent = getSocialIcon(social.name);
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="w-9 h-9 rounded-sm bg-black border border-black-secondary text-neutral-400 hover:text-primary hover:border-primary hover:bg-black-primary/50 transition-all duration-150 flex items-center justify-center group"
                  >
                    {IconComponent ? (
                      <IconComponent
                        size={18}
                        weight="bold"
                        className="group-hover:scale-110 transition-transform duration-150"
                      />
                    ) : (
                      <span className="text-xs">{social.icon}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/*     =================================================Resources Column (2 Cols) ====================================================================== */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-pixel uppercase tracking-wider text-border/50 pb-2">
              _NAVIGATE_
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#aaaaaa]">
              {siteConfig.footerLinks.map((item) => (
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
      <div className="border-t border-black py-4 px-4 lg:px-10">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-border/60">
          
          <div className="flex items-center gap-2">
            <span>PIXLape Trove © 2026</span>
            <span className="text-border">|</span>
            <span className="text-border">ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/document/privacy" className="hover:text-primary transition-colors">PRIVACY</Link>
            <span>•</span>
            <Link href="/document/terms" className="hover:text-primary transition-colors">TERMS</Link>
            <span>•</span>
            <Link href="/document/license" className="hover:text-primary transition-colors">LICENSE</Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="px-4 py-1 bg-border border border-black-secondary rounded-lg text-xs text-black-secondary hover:text-primary hover:border-primary transition-all duration-150 cursor-pointer flex items-center gap-3"
          >
            <span>▲</span> TOP
          </button>

        </div>
      </div>
    </footer>
  );
}
