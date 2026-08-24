"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import { ArticleItem } from "@/app/data/article";

interface ArticlePageProps {
  article: ArticleItem;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const [likes, setLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="min-h-screen bg-border text-text-primary font-mono flex flex-col">
      <Header />

      <main className="max-w-full w-full px-24 mt-13 pb-12 flex-1 flex flex-col gap-3">
        {/* ──========================================= Top Navigation & Meta Header =========================================── */}
        <div className="flex items-center justify-between mt-4">
          <Link
            href="/"
            className="text-xs font-mono text-text-secondary hover:text-black-secondary transition-colors flex items-center gap-1"
          >
            &lt; BACK
          </Link>
          <div className="flex items-center gap-3 text-xs text-text-secondary font-mono">
            <span>📅 {article.date}</span>
            <span>•</span>
            <span>⏱️ {article.readTime}</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-black-secondary text-white rounded-lg font-mono text-xs">
              ARTICLE #{article.id}
            </span>
          </div>
        </div>

        {/* ──========================================= Document Container Section =========================================── */}
        <article className="bg-surface border border-black rounded-lg p-5 sm:p-10 flex flex-col gap-8 shadow-xs">
          
          {/* ========================================== Article Header ========================================== */}
          <header className="flex flex-col gap-3 border-border pb">
            <div className="flex items-center gap-6">
              <span className="px-4 py-0.5 bg-border border border-black text-black-primary text-xs font-black rounded-md uppercase tracking-wide">
                {article.category}
              </span>
              <span className="text-xs font-mono text-black-secondary">
                by {article.author}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-pixel text-black-primary leading-tight tracking-wide">
              {article.title}
            </h1>

            <p className="text-sm font-mono text-text-secondary leading-relaxed">
             ▦ {article.subtitle}
            </p>
          </header>

          {/* ========================================== Cover Hero Banner Image ========================================== */}
          <div className="relative w-full h-70 sm:h-75 rounded-md overflow-hidden border border-black bg-white flex items-center justify-center p-5">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-contain p-2"
              priority
            />
          </div>

          {/* ========================================== Document Content Body ========================================== */}
          <div className="flex flex-col gap-5 text-sm font-mono text-black-primary leading-relaxed">
            
            {/* ========================================== Lead Paragraph ========================================== */}
            <p className="text-base font-medium leading-relaxed border-l-2 border-primary pl-4 text-black-primary">
              {article.excerpt}
            </p>

            {/* ========================================== Section 1 ========================================== */}
            <div className="flex flex-col gap-3 pt-2">
              <h2 className="text-lg font-pixel text-black-primary border-b border-black-secondary pb-1 flex items-center gap-2">
                <span className="text-black-secondary">#1</span> Structural Architecture & Modular Design
              </h2>
              <p>
                A well-structured design system separates core UI components into predictable, single-responsibility units. By using standardized token themes (such as retro monochrome surfaces, pixelated headers, and high-contrast borders), user interfaces remain clean, consistent, and instantly recognizable.
              </p>
              <p>
                When organizing digital vault archives, metadata such as bundle sizes, license types, and system requirements must be presented clearly alongside asset downloads to minimize user friction.
              </p>
            </div>

            {/* ========================================== Quote Callout Box ========================================== */}
            <blockquote className="p-5 bg-white border-l-4 border-l-black-primary border border-border rounded-r-md my-2 flex flex-col gap-2">
              <p className="italic text-sm text-black-primary font-mono">
                &ldquo;Simplicity is not the lack of clutter, that&apos;s a consequence of simplicity. Simplicity is somehow almost describing the purpose and essential nature of a tool.&rdquo;
              </p>
              <cite className="text-xs font-pixel text-black-secondary not-italic uppercase text-right">
                — Vault Architecture Guidelines
              </cite>
            </blockquote>

            {/* ========================================== Section 2 ========================================== */}
            <div className="flex flex-col gap-3 pt-2">
              <h2 className="text-lg font-pixel text-black-primary border-b border-black-secondary pb-1 flex items-center gap-2">
                <span className="text-black-secondary">#2</span> Essential Takeaways & Implementation Rules
              </h2>
              <p>
                Below is a quick checklist of rules enforced across all PIXLape vault components to ensure peak client-side performance:
              </p>

              {/* ========================================== Bulleted checklist ========================================== */}
              <ul className="flex flex-col gap-2.5 pl-2 pt-1">
                <li className="flex items-start gap-3 p-3 bg-white border border-border rounded-sm">
                  <span className="text-primary font-bold text-base leading-none">✔</span>
                  <div>
                    <strong className="font-bold text-black-primary block">SVG Vector Pre-Scaling</strong>
                    Always define explicit aspect ratios and viewport bounds to avoid layout shifts during dynamic rendering.
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white border border-border rounded-sm">
                  <span className="text-primary font-bold text-base leading-none">✔</span>
                  <div>
                    <strong className="font-bold text-black-primary block">Absolute Asset Path Resolution</strong>
                    Enforce root-relative resource URLs (<code className="bg-surface px-1.5 py-0.5 border border-border rounded-xs text-xs">/img/...</code>) across nested dynamic route handlers.
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white border border-border rounded-sm">
                  <span className="text-primary font-bold text-base leading-none">✔</span>
                  <div>
                    <strong className="font-bold text-black-primary block">Responsive Grid Breakdown</strong>
                    Adapt card grids dynamically across standard desktop breakpoint containers for balanced scannability.
                  </div>
                </li>
              </ul>
            </div>

            {/* ========================================== Terminal Command Code Snippet Box ========================================== */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-xs font-pixel text-black-secondary uppercase">
                ▤ Example CLI Vault Inspection:
              </span>
              <div className="rounded-sm border border-black bg-border overflow-hidden font-mono text-xs">
                <div className="bg-black-secondary px-7 py-1.5 border-b border-black flex items-center justify-between text-[11px] text-white">
                  <span>vault-cli inspect --article={article.id}</span>
                  <span>BASH</span>
                </div>
                <pre className="p-4 text-green-700 overflow-x-auto">
                  <code>
                    <span className="text-black"># Fetching article package metadata...</span>{"\n"}
                    pixlape-vault get article --id={article.id} --format=json{"\n\n"}
                    <span className="text-black"># Status: 200 OK | Payload: 48.5KB</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* ========================================== Summary Conclusion ========================================== */}
            <div className="p-4 bg-green-100 border border-black rounded-sm flex flex-col gap-4">
              <h3 className="font-pixel text-xs text-black-primary uppercase flex items-center gap-2">
                <span>📌</span> Conclusion
              </h3>
              <p className="text-xs text-text-secondary">
                Following modular document standards ensures your web application stays fast, accessible, and easily maintainable as the vault library expands.
              </p>
            </div>

          </div>

          {/* ========================================== Document Footer & Interactive Bar ========================================== */}
          <footer className="border-t border-black pt-6 flex flex-wrap items-center justify-between gap-4">
            {/* ========================================== Author Profile ========================================== */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md border border-black overflow-hidden bg-white relative">
                <Image
                  src="/img/Icontemp1.svg"
                  alt="Author Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-black-primary font-mono">{article.author}</span>
                <span className="text-xs text-black-primary">Published in Vault Articles</span>
              </div>
            </div>

            {/* ========================================== Interactive Actions (Like & Share) ========================================== */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleLike}
                className={`px-4 py-1.5 text-xs font-mono font-semibold rounded-lg border border-black transition-all cursor-pointer flex items-center gap-3 ${
                  hasLiked
                    ? "bg-pink-300 text-red-500 font-bold"
                    : "bg-surface text-black-primary hover:bg-pink-400 hover:text-white"
                }`}
              >
                <span>♥</span>
                <span>{hasLiked ? "Liked" : "Like"}</span>
                <span className="px-1.5 py-0.2 bg-pink-200 rounded-xs text-[11px]">
                  {likes}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Article link copied to clipboard!");
                  }
                }}
                className="px-4 py-1.5 text-xs font-mono font-semibold bg-surface border border-black text-black-primary rounded-lg hover:bg-green-300 hover:text-black-primary transition-all cursor-pointer"
              >
                🔗 Share
              </button>
            </div>
          </footer>

        </article>

        {/* ──========================================= Related Article Navigation Links =========================================── */}
        <div className="flex items-center justify-between pt-4 text-xs font-mono">
          <Link
            href="/article"
            className="px-4 py-2 border border-black rounded-sm bg-surface hover:bg-black-secondary hover:text-white transition-colors"
          >
            &lt; PREVIOUS ARTICLE
          </Link>
          <Link
            href="/article"
            className="px-4 py-2 border border-black rounded-sm bg-surface hover:bg-black-secondary hover:text-white transition-colors"
          >
            NEXT ARTICLE &gt;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
