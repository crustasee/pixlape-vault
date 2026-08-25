/**
 * Global Site Configuration & Metadata
 */

export const siteConfig = {
  name: "PIXLAPE TROVE",
  description:
    "Discover and download premium digital assets — apps, tools, brushes, templates, icons, and more.",
  url: "https://pixlape.com",
  ogImage: "/img/banner01.svg",
  navItems: [
    { label: "HOME", href: "/" },
    { label: "ARTICLES", href: "/articles" },
    { label: "CONTACT US", href: "/contact" },
    { label: "HELP", href: "/help" },
  ],
  footerLinks: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Article & Blog", href: "/articles" },
    { label: "Pixlape Team", href: "/pixlteam" },
    { label: "Sitemap", href: "/sitemap" },
    { label: "Changelog", href: "/changelog" },
  ],
  categories: [
    "ALL ASSETS",
    "APPS",
    "TOOLS",
    "BRUSH",
    "TEMPLATE",
    "ICON",
    "ART FOR SELL",
    "OTHERS",
  ] as const,
  socials: [
    { name: "GitHub", href: "https://github.com", icon: "⌗" },
    { name: "Twitter", href: "https://twitter.com", icon: "𝕏" },
    { name: "Instagram", href: "https://instagram.com", icon: "◈" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "▣" },
    { name: "Discord", href: "https://discord.com", icon: "⌂" },
  ],
};