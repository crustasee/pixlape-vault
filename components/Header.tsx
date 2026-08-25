import React from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "ARTICLES", href: "/articles" },
  { label: "CONTACT US", href: "/contact" },
  { label: "HELP", href: "/help" },
];

export default function Header() {
  return (
    <header className="h-12.75 flex items-center px-6 fixed top-0 w-full z-50 font-mono border-b border-border bg-border text-surface shadow-xs">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
        <div className="w-7 h-7 rounded-sm flex items-center justify-center bg-surface border shadow-xs">
          <Image src="/logop2.svg" alt="Logo" width={26} height={26} />
        </div>
        <span className="text-xs font-pixel tracking-wide text-black-primary">
          +++ PIXLape.com
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="ml-auto flex gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-xs font-black text-black-secondary hover:text-black-primary hover:scale-105 transition-all duration-150"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
