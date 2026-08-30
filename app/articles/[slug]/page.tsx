"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticleById, getAdjacentArticles } from "@/lib/db/article";
import { notFound } from "next/navigation";

export interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = use(params);
  const article = getArticleById(slug);

  if (!article) {
    notFound();
  }

  const { prev: prevArticle, next: nextArticle } = getAdjacentArticles(article.id);

  const [likes, setLikes] = useState<number>(article.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((prev: number) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev: number) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-border text-text-primary font-mono flex flex-col">
      <Header />

      <main className="max-w-full w-full px-6 sm:px-12 md:px-20 lg:px-24 mt-13 pb-12 flex-1 flex flex-col gap-3">
        {/* ──========================================= Top Navigation & Meta Header =========================================── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Link
              href="/articles"
              className="text-xs font-mono text-text-secondary hover:text-black-secondary transition-colors flex items-center gap-1 bg-surface px-2.5 py-1 rounded-sm border border-border hover:border-primary"
            >
              &lt; BACK TO ARTICLES
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary font-mono">
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
          <header className="flex flex-col gap-3 border-border pb-2">
            <div className="flex items-center gap-4">
              <span className="px-4 py-0.5 bg-border border border-black text-black-primary text-xs font-black rounded-md uppercase tracking-wide">
                {article.category}
              </span>
              <span className="text-xs font-mono text-black-secondary">
                by <strong className="text-black-primary">{article.author}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-pixel text-black-primary leading-tight tracking-wide">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-sm font-mono text-text-secondary leading-relaxed">
                ▦ {article.subtitle}
              </p>
            )}
          </header>

          {/* ========================================== Cover Hero Banner Image ========================================== */}
          <div className="relative w-full h-64 sm:h-75 rounded-md overflow-hidden border border-black bg-white flex items-center justify-center p-5">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-contain p-2"
              priority
            />
          </div>

          {/* ========================================== Document Content Body ========================================== */}
          <div className="flex flex-col gap-6 text-sm font-mono text-black-primary leading-relaxed">
            
            {/* ========================================== Lead Paragraph ========================================== */}
            {(article.leadParagraph || article.excerpt)?.includes("<") &&
            (article.leadParagraph || article.excerpt)?.includes(">") ? (
              <div
                className="text-base font-medium leading-relaxed border-l-3 border-primary pl-4 text-black-primary bg-white/50 py-2 rounded-r-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.leadParagraph || article.excerpt,
                }}
              />
            ) : (
              <p className="text-base font-medium leading-relaxed border-l-3 border-primary pl-4 text-black-primary bg-white/50 py-2 rounded-r-sm">
                {article.leadParagraph || article.excerpt}
              </p>
            )}

            {/* ========================================== Dynamic Sections ========================================== */}
            {article.sections && article.sections.length > 0 && (
              <div className="flex flex-col gap-6">
                {article.sections.map((section, idx) => (
                  <div key={idx} className="flex flex-col gap-3 pt-2">
                    {section.title && (
                      <h2 className="text-lg font-pixel text-black-primary border-b border-black-secondary pb-1.5 flex items-center gap-2">
                        <span className="text-black-secondary">#{idx + 1}</span> {section.title}
                      </h2>
                    )}
                    {section.paragraphs.map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ========================================== Dynamic Quote Callout Box ========================================== */}
            {article.quote && (
              <blockquote className="p-5 bg-white border-l-4 border-l-black-primary border border-border rounded-r-md my-2 flex flex-col gap-2 shadow-xs">
                <p className="italic text-sm text-black-primary font-mono leading-relaxed">
                  &ldquo;{article.quote.text}&rdquo;
                </p>
                <cite className="text-xs font-pixel text-black-secondary not-italic uppercase text-right">
                  — {article.quote.author}
                </cite>
              </blockquote>
            )}

            {/* ========================================== Dynamic Checklist ========================================== */}
            {article.checklist && article.checklist.items.length > 0 && (
              <div className="flex flex-col gap-3 pt-2">
                <h2 className="text-lg font-pixel text-black-primary border-b border-black-secondary pb-1.5 flex items-center gap-2">
                  <span className="text-black-secondary">#✓</span> {article.checklist.title || "Checklist & Guidelines"}
                </h2>

                <ul className="flex flex-col gap-2.5 pl-1 pt-1">
                  {article.checklist.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white border border-border rounded-sm hover:border-black transition-colors">
                      <span className="text-primary-dim bg-primary/20 border border-primary/40 px-1.5 py-0.5 rounded-xs font-bold text-xs leading-none select-none mt-0.5">
                        ✔
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <strong className="font-bold text-black-primary block text-xs sm:text-sm">
                          {item.label}
                        </strong>
                        <span className="text-xs text-text-secondary leading-relaxed">
                          {item.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ========================================== Dynamic Code / CLI Snippet Box ========================================== */}
            {article.codeSnippet && (
              <div className="flex flex-col gap-2 pt-2">
                {article.codeSnippet.label && (
                  <span className="text-xs font-pixel text-black-secondary uppercase flex items-center gap-1.5">
                    <span>▤</span> {article.codeSnippet.label}:
                  </span>
                )}
                <div className="rounded-sm border border-black bg-border overflow-hidden font-mono text-xs shadow-xs">
                  <div className="bg-black-secondary px-4 py-2 border-b border-black flex items-center justify-between text-[11px] text-white">
                    <span className="font-bold truncate max-w-sm">
                      {article.codeSnippet.command || "terminal"}
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded-xs text-[10px] font-black uppercase tracking-wide">
                      {article.codeSnippet.lang || "CODE"}
                    </span>
                  </div>
                  <pre className="p-4 text-black-secondary bg-white font-mono overflow-x-auto text-xs leading-relaxed">
                    <code>{article.codeSnippet.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* ========================================== Dynamic Summary Conclusion ========================================== */}
            {article.conclusion && (
              <div className="p-5 bg-green-50 border border-black rounded-sm flex flex-col gap-2 shadow-xs">
                <h3 className="font-pixel text-xs text-black-primary uppercase flex items-center gap-2">
                  <span>📌</span> {article.conclusion.title || "Conclusion"}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-mono">
                  {article.conclusion.text}
                </p>
              </div>
            )}

          </div>

          {/* ========================================== Document Footer & Interactive Bar ========================================== */}
          <footer className="border-t border-black pt-6 flex flex-wrap items-center justify-between gap-4">
            {/* ========================================== Author Profile ========================================== */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-md border border-black overflow-hidden bg-white relative shrink-0 shadow-xs">
                <Image
                  src={article.authorAvatar || "/img/Icontemp1.svg"}
                  alt={article.author}
                  fill
                  className="object-cover p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-black-primary font-mono">{article.author}</span>
                <span className="text-[11px] text-text-secondary font-mono">
                  {article.authorRole || "Published in Vault Articles"}
                </span>
              </div>
            </div>

            {/* ========================================== Interactive Actions (Like & Share) ========================================== */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLike}
                className={`px-4 py-1 text-xs font-mono font-semibold rounded-md border border-black transition-all hover:scale-96 cursor-pointer flex items-center gap-2.5 shadow-pixel ${
                  hasLiked
                    ? "bg-pink-300 text-red-600 font-bold"
                    : "bg-border text-black-primary hover:bg-pink-300 hover:text-black"
                }`}
              >
                <span>♥</span>
                <span>{hasLiked ? "Liked" : "Like"}</span>
                <span className="px-2 py-0.5 bg-surface border border-black rounded-sm text-[10px] font-bold">
                  {likes}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-1.5 shadow-pixel text-xs font-mono font-semibold bg-surface border border-black text-black-primary rounded-md hover:bg-primary hover:scale-96 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🔗</span>
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </footer>

        </article>

        {/* ──========================================= Dynamic Related Article Navigation Links =========================================── */}
        <div className="flex items-center justify-between pt-4 text-xs font-mono">
          {prevArticle ? (
            <Link
              href={`/articles/${prevArticle.id}`}
              className="px-4 py-2 border border-black rounded-md bg-surface hover:bg-black-secondary hover:text-white transition-colors flex items-center gap-1.5 font-bold shadow-xs"
            >
              <span>&lt;</span> PREV: {prevArticle.title.slice(0, 24)}...
            </Link>
          ) : (
            <span className="px-4 py-2 border border-border rounded-md bg-surface/50 text-text-muted cursor-not-allowed">
              &lt; FIRST ARTICLE
            </span>
          )}

          {nextArticle ? (
            <Link
              href={`/articles/${nextArticle.id}`}
              className="px-4 py-2 border border-black rounded-sm bg-surface hover:bg-border hover:text-white transition-colors flex items-center gap-1.5 font-bold shadow-xs"
            >
              NEXT: {nextArticle.title.slice(0, 24)}... <span>&gt;</span>
            </Link>
          ) : (
            <span className="px-4 py-2 border border-border rounded-sm bg-surface/50 text-text-muted cursor-not-allowed">
              LATEST ARTICLE &gt;
            </span>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
