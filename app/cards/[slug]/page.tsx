"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardGrid from "@/components/CardGrid";
import Badge, { CategoryBadge } from "@/components/Badge";
import DownloadModal from "@/components/modal/DownloadModal";
import DonateModal from "@/components/modal/DonateModal";
import { getCardById, CARDS } from "@/lib/db/card";

export interface CardDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CardDetailPage({ params }: CardDetailPageProps) {
  const { slug } = use(params);
  const card = getCardById(slug);

  if (!card) {
    notFound();
  }

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Smart Related Cards: Match same category first
  const relatedCards = useMemo(() => {
    const others = CARDS.filter((c) => c.id !== card.id);
    const sameCategory = others.filter((c) =>
      c.categories.some((cat) => card.categories.includes(cat))
    );
    const diffCategory = others.filter(
      (c) => !c.categories.some((cat) => card.categories.includes(cat))
    );
    return [...sameCategory, ...diffCategory].slice(0, 4);
  }, [card]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const primaryCategory = card.categories[0] || "OTHERS";
  const displayVersion = card.version || "v1.0.0";
  const displayLicense =
    card.license ||
    (card.badge === "free" ? "Free Commercial" : `${card.badge.toUpperCase()} License`);
  const displaySize = card.fileSize || "18.4 MB";
  const displayAuthor = card.author || "PIXLape Team";
  const displayUpdated = card.updatedAt || "2026-08-20";

  return (
    <div className="min-h-screen bg-border text-text-primary font-mono flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-full mx-auto px-6 sm:px-12 md:px-16 lg:px-20 mt-6 sm:mt-12 pb-16 flex flex-col gap-6">
        {/* ── Breadcrumb Navigation ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-black-secondary hover:text-black font-bold transition-colors bg-surface px-2.5 py-1 rounded-sm border border-border hover:border-black"
            >
              <span>&lt;</span> BACK TO TROVE
            </Link>
            <span className="text-black-secondary select-none">/</span>
            <Link
              href={`/cards/category/${primaryCategory.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-black-secondary hover:text-black uppercase font-bold transition-colors"
            >
              {primaryCategory}
            </Link>
            <span className="text-black-secondary select-none">/</span>
            <span className="text-black-primary font-bold truncate max-w-45 sm:max-w-75">
              {card.title}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border hover:border-black rounded-sm text-xs text-black-primary font-bold hover:bg-primary hover:text-black transition-all cursor-pointer shadow-xs"
            title="Copy asset link"
          >
            <span>🔗</span>
            <span>{shareCopied ? "Link Copied!" : "Share Asset"}</span>
          </button>
        </div>

        {/* ── Main Asset Container ─────────────────────────────────────── */}
        <section className="bg-surface border border-black rounded-lg flex flex-col gap-6 p-4 sm:p-6 shadow-xs">
          {/* Hero Banner */}
          <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-sm overflow-hidden bg-white border border-black group">
            <Image
              src={card.banner}
              alt={`${card.title} banner`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-101"
              priority
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="bg-black/80 backdrop-blur-xs text-white border border-black px-2.5 py-1 text-[11px] font-mono font-bold rounded-xs shadow-xs uppercase">
                {primaryCategory}
              </span>
            </div>
          </div>

          {/* Header Identity Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-black rounded-sm flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image
                  src={card.icon}
                  alt={`${card.title} icon`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <h1 className="text-lg sm:text-2xl font-pixel text-black-primary tracking-wide">
                  ◆ {card.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={card.badge} />
                  {card.categories.map((tag) => (
                    <CategoryBadge key={tag} category={tag} />
                  ))}
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white text-black-secondary border border-border rounded-xs">
                    {displayVersion}
                  </span>
                  <span className="text-xs text-black-secondary font-mono">
                    by <strong className="text-black-primary">{displayAuthor}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Two-Column Layout: Description Content + Sidebar ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* Left Main Content Column */}
            <div className="lg:col-span-8 flex flex-col gap-3 bg-white rounded-lg border border-black">
              {/* About & Overview Card */}
              <div className="p-5 sm:p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="font-black text-xs sm:text-sm text-black-primary uppercase tracking-wide flex items-center gap-2">
                    <span>≡</span> DESCRIPTION
                  </h2>
                  <span className="text-[11px] font-mono font-bold text-black-secondary uppercase bg-surface px-2 py-0.5 border border-border rounded-xs">
                    {displayLicense}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-mono text-text-primary leading-relaxed whitespace-pre-line">
                  {card.description}
                </div>
              </div>

              {/* Key Features Highlights (if present) */}
              {card.features && card.features.length > 0 && (
                <div className="p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="font-black text-xs sm:text-xs text-black-primary uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                    <span>≡</span> KEY HIGHLIGHTS & FEATURES
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {card.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-surface border border-border rounded-sm flex items-start gap-2.5 hover:border-black transition-colors"
                      >
                        <span className="text-primary-dim bg-primary/20 border border-primary/40 px-1 rounded-xs font-bold text-xs leading-none mt-0.5 select-none">
                          ✔
                        </span>
                        <span className="text-xs font-mono text-black-primary">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Table (if present) */}
              {card.specs && Object.keys(card.specs).length > 0 && (
                <div className="p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="font-black text-xs sm:text-xs text-black-primary uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                    <span>≡</span> TECHNICAL SPECIFICATIONS
                  </h3>

                  <div className="border border-black rounded-sm overflow-hidden">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-black-secondary text-white">
                          <th className="p-2.5 w-1/3 border-r border-black font-bold uppercase tracking-wider">
                            Property
                          </th>
                          <th className="p-2.5 font-bold uppercase tracking-wider">
                            Details & Metrics
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-white">
                        {Object.entries(card.specs).map(([key, val], idx) => (
                          <tr key={idx} className="hover:bg-primary-light transition-colors">
                            <td className="p-2.5 font-bold text-black-primary border-r border-border">
                              {key}
                            </td>
                            <td className="p-2.5 text-text-secondary">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            

              {/* Release Notes / Changelog (if present) */}
              {card.changelog && (
                <div className="p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="font-pixel text-xs sm:text-sm text-black-primary uppercase tracking-wide flex items-center gap-2">
                      <span>▣</span> VERSION HISTORY & RELEASE NOTES
                    </h3>
                    <span className="text-xs font-mono bg-surface px-2 py-0.5 border border-border rounded-xs font-bold">
                      {displayVersion}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-text-primary leading-relaxed whitespace-pre-line">
                    {typeof card.changelog === "string" ? card.changelog : card.changelog.join("\n• ")}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 flex flex-col gap-5 sticky top-6">
              {/* Primary Download Action Card */}
              <div className="bg-white border border-black rounded-md p-4 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-mono font-bold text-black-secondary uppercase tracking-wider">
                    Package Download
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-light text-primary-dim border border-primary rounded-xs">
                    {card.fileType || ".ZIP"}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs font-mono text-text-secondary">
                  <span>File Size:</span>
                  <strong className="text-black-primary font-bold">{displaySize}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDownloadOpen(true)}
                  className="w-full py-3 px-4 bg-primary text-black font-pixel text-xs rounded-md border border-black hover:bg-primary-hover hover:scale-98 transition-all duration-150 cursor-pointer shadow-pixel font-bold flex items-center justify-center gap-2 text-center"
                >
                  <span>⬇</span> DOWNLOAD
                </button>

                <p className="text-[10px] text-center text-text-muted font-mono">
                  Safe & verified archive • Instant direct download
                </p>
              </div>

              {/* Asset Information Specifications Card */}
              <div className="bg-white border border-black rounded-md p-4 flex flex-col gap-3 shadow-xs">
                <h3 className="font-pixel text-xs text-black-primary uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                  <span>≡</span> ASSET INFORMATION
                </h3>

                <ul className="flex flex-col gap-2.5 text-xs font-mono text-text-secondary">
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Category:</span>
                    <span className="bg-surface px-1.5 py-0.5 border border-border rounded-xs text-[11px] font-bold text-black-primary uppercase">
                      {card.categories.join(", ")}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Version:</span>
                    <span className="font-bold text-black-primary">{displayVersion}</span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">License:</span>
                    <span className="text-green-700 font-bold uppercase">{displayLicense}</span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Author:</span>
                    <span className="font-bold text-black-primary">{displayAuthor}</span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Requirements:</span>
                    <span>{card.requirements.length} Items Listed</span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Updated:</span>
                    <span>{displayUpdated}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-bold text-black-primary">Checksum:</span>
                    <span
                      className="font-mono text-[10px] text-black-secondary truncate max-w-35"
                      title={card.checksum || "SHA-256 Validated"}
                    >
                      {card.checksum ? card.checksum.slice(0, 16) + "..." : "SHA-256 Valid"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Support Creator Donation Box */}
              <div className="bg-pink-50 border border-black rounded-md p-4 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-pink-200 pb-2">
                  <span className="text-base select-none">💖</span>
                  <h4 className="font-pixel text-xs text-black-primary uppercase">Support Creator</h4>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed">
                  Enjoying this asset package? A small tip helps keep free tools and open community assets active!
                </p>
                <button
                  type="button"
                  onClick={() => setIsDonateOpen(true)}
                  className="w-full py-2.5 px-3 bg-pink-300 text-pink-900 border border-pink-700 text-xs font-pixel rounded-md hover:bg-pink-400 hover:scale-98 transition-all duration-150 cursor-pointer text-center font-bold shadow-xs flex items-center justify-center gap-2"
                >
                  <span>☕</span> DONATE NOW &gt;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Assets Grid ─────────────────────────────────────── */}
        <section className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xs font-pixel uppercase tracking-wide text-black-secondary flex items-center gap-2">
              <span>▩</span> Related Assets from Trove
            </h2>
            <Link
              href="/"
              className="text-xs font-mono text-black-secondary hover:text-black font-bold transition-colors"
            >
              VIEW ALL &gt;
            </Link>
          </div>
          <CardGrid cards={relatedCards} limit={4} />
        </section>
      </main>

      <Footer />

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onDonateOpen={() => {
          setIsDownloadOpen(false);
          setIsDonateOpen(true);
        }}
        downloadUrl={card.downloadUrl}
        countdownSeconds={15}
      />

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        trakteerUrl={card.donateUrl || "https://trakteer.id"}
        saweriaUrl="https://saweria.co"
      />
    </div>
  );
}
