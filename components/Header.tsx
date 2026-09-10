import React from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { siteConfig } from "@/config/site";

export default function Header() {
  return (
    <header className="h-12.75 flex items-center px-6 fixed top-0 w-full z-50 font-mono border-b border-border bg-surface/90 backdrop-blur-md text-text-primary dark:bg-zinc-950/95 dark:backdrop-blur-md dark:border-zinc-800 dark:text-zinc-100 shadow-xs transition-colors">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
        <div className="w-7 h-7 rounded-sm flex items-center justify-center bg-surface border shadow-xs dark:bg-zinc-900 dark:border-zinc-700">
          <Image src="/logop2.svg" alt="Logo" width={26} height={26} />
        </div>
        <span className="text-xs font-pixel tracking-wide text-black-primary dark:text-zinc-100">
          +++ PIXLape.com
        </span>
      </Link>

      {/* Navigation Links & Dark Mode Toggle */}
      <div className="ml-auto flex items-center gap-4 sm:gap-6">
        <nav className="flex items-center gap-4 sm:gap-6">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs font-black text-black-secondary hover:text-black-primary dark:text-zinc-400 dark:hover:text-primary hover:scale-105 transition-all duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-4 w-px bg-border dark:bg-zinc-800" />

        {/* Dark Mode Switch Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
