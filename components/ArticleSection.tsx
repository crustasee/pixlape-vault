"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/data/article";

export default function ArticleSection() {
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    const initial: Record<string, { count: number; liked: boolean }> = {};
    ARTICLES.forEach((item) => {
      initial[item.id] = { count: item.likes, liked: false };
    });
    return initial;
  });

  const toggleLike = (id: string) => {
    setLikesMap((prev) => {
      const current = prev[id] || { count: 0, liked: false };
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  const featuredArticles = ARTICLES.filter((a) => a.featured);
  const sideArticles = ARTICLES.filter((a) => !a.featured);

  return (
    <section className="mx-12 bg-border/40 border border-black rounded-md p-6 sm:p-6 mb-8 font-mono shadow-xs">
      {/* ── Section Title Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black pb-4 mb-6">
        <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-pixel text-black-secondary uppercase tracking-wide">
          <span className="text-border font-bold">○○○●●</span>
          <span>_BLOG_ARTICLE_VAULT</span>
        </h2>
        <span className="text-xs font-mono text-text-secondary">
          TOTAL PUBLISHED: {ARTICLES.length} ARTICLES
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* ── Left Column: Featured Main Articles ── */}
        <div className="flex flex-col gap-4 flex-1">
          {featuredArticles.map((article) => {
            const likeInfo = likesMap[article.id] || { count: article.likes, liked: false };

            return (
              <div
                key={article.id}
                className="rounded-md border border-black p-5 flex flex-col sm:flex-row gap-5 min-h-55 bg-surface hover:bg-green-100 hover:scale-[1.01] hover:shadow-md transition-all duration-200"
              >
                {/* Image Frame Box */}
                <div className="w-full sm:w-47.5 h-40 sm:h-auto bg-white border border-black rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative p-3">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-contain p-2"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black-primary text-white text-[10px] font-pixel rounded-xs uppercase">
                    {article.category}
                  </span>
                </div>

                {/* Article Info & Text Body */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    {/* Meta Line: Date, Read Time, Author */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondary font-mono border-b border-border pb-1.5">
                      <span className="flex items-center gap-3 font-bold text-black-primary">
                        📅 {article.date}
                      </span>
                      <span>•</span>
                      <span>⏱️ {article.readTime}</span>
                      <span>•</span>
                      <span className="text-black-secondary">{article.author}</span>
                    </div>

                    {/* Title & Excerpt */}
                    <Link href={`/article/${article.id}`}>
                      <h3 className="text-base sm:text-lg font-mono font-bold text-black-primary hover:text-green-600 transition-colors leading-snug">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-xs font-mono text-text-secondary leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Action Buttons: Like & Read */}
                  <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                    <button
                      type="button"
                      onClick={() => toggleLike(article.id)}
                      className={`px-2 py-1 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        likeInfo.liked
                          ? "bg-pink-200 text-red-500 font-bold"
                          : "bg-surface text-black-primary hover:bg-pink-300 hover:text-white"
                      }`}
                    >
                      <span>♥</span>
                      <span>{likeInfo.liked ? "Liked" : "Like"}</span>
                      <span className="text-[11px] opacity-80">({likeInfo.count})</span>
                    </button>

                    <Link
                      href={`/article/${article.id}`}
                      className="px-5 py-1 rounded-lg bg-primary/50 border border-green-600 text-green-700 text-xs font-mono font-bold hover:scale-[1.03] active:scale-[0.98] transition-all inline-block text-center cursor-pointer uppercase shadow-xs"
                    >
                      Read &gt;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right Column: Minimalist Secondary Articles List ── */}
        <div className="flex flex-col gap-2 w-full lg:w-125">
          <h3 className="font-pixel text-xs text-black-secondary uppercase tracking-wider  border-black pb-2 flex items-center gap-2">
            <span>≡</span> LATEST DISPATCHES & GUIDES
          </h3>

          {sideArticles.map((article) => {
            const likeInfo = likesMap[article.id] || { count: article.likes, liked: false };

            return (
              <div
                key={article.id}
                className="rounded-md border border-black p-4 flex gap-4 min-h-40 bg-surface hover:bg-green-100 hover:scale-[1.01] hover:shadow-sm transition-all duration-200"
              >
                {/* Image Icon Box */}
                <div className="w-30 self-stretch bg-white border border-black rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative p-2">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Body Content */}
                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    {/* Date Meta Badge */}
                    <div className="flex items-center justify-between text-[10px] text-text-secondary border-b border-border pb-1">
                      <span className="font-bold text-black-primary">📅 {article.date}</span>
                      <span className="px-2 py-0.2 bg-black-secondary text-white rounded-md uppercase font-mono">
                        {article.category}
                      </span>
                    </div>

                    <Link href={`/article/${article.id}`}>
                      <h4 className="text-xs sm:text-sm font-mono font-bold text-black-primary hover:text-green-600 transition-colors leading-snug line-clamp-2">
                       ▦ {article.title}
                      </h4>
                    </Link>
                    <p className="text-[11px] font-mono text-text-secondary leading-normal line-clamp-2">
                      {article.subtitle}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                    <button
                      type="button"
                      onClick={() => toggleLike(article.id)}
                      className={`px-2 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                        likeInfo.liked
                          ? "bg-pink-200 text-pink-500 font-bold"
                          : "bg-surface text-black-primary hover:bg-pink-300 hover:text-red-600"
                      }`}
                    >
                      <span>♥</span>
                      <span>({likeInfo.count})</span>
                    </button>

                    <Link
                      href={`/article/${article.id}`}
                      className="px-2 py-1 rounded-lg bg-primary/50 border text-green-700 text-xs font-mono font-bold hover:scale-[1.05] transition-all inline-block text-center cursor-pointer uppercase"
                    >
                      Read &gt;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Section Button ── */}
      <div className="flex justify-end mt-6 pt-4 border-t border-black">
        <Link
          href="/article"
          className="px-6 py-2 bg-surface border border-black-primary text-text-secondary text-sm font-mono font-semibold rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer"
        >
          ALL ARTICLES &gt;
        </Link>
      </div>
    </section>
  );
}
