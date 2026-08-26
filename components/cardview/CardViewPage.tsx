"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../Header";
import Footer from "../Footer";
import Image from "next/image";
import CardGrid from "../CardGrid";
import Badge, { CategoryBadge } from "../Badge";
import DownloadModal from "../modal/DownloadModal";
import DonateModal from "../modal/DonateModal";
import MarkdownDescription from "./MarkdownDescription";
import { getCardById, CARDS, CardDetail } from "@/lib/db/card";

interface CardViewPageProps {
  cardId?: string;
  initialCard?: CardDetail;
}

/* ==================================== PAGE ========================================================*/
export default function CardViewPage({ cardId, initialCard }: CardViewPageProps) {
  const card = initialCard || (cardId ? getCardById(cardId) : CARDS[0]) || CARDS[0];

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Filter related cards excluding the current active card
  const relatedCards = CARDS.filter((c) => c.id !== card.id);

  return (
    <div className="min-h-screen bg-border text-text-primary font-mono">
      <Header />

      <main className="mx-24 mt-14 pb-12 flex flex-col gap-6">
        {/* +++++++++++++++++++++++ Back +++++++++++++++++++++++++ */}
        <Link
          href="/"
          className="self-start text-xs font-mono text-black-secondary hover:text-black-primary transition-colors"
        >
          &lt; BACK
        </Link>

        {/* ──====================================================== Detail section ========================================================── */}
        <section className="bg-surface border border-black rounded-lg flex flex-col gap-4 p-6">
          {/* =======================================================Banner ========================================================*/}
          <div className="relative w-full h-55 rounded-sm overflow-hidden bg-white border border-black hover:scale-101 hover:shadow-md transition-all duration-200">
            <Image
              src={card.banner}
              alt={`${card.title} banner`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* ======================================================= Header row ======================================================== */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 bg-white border border-border rounded-sm flex items-center justify-center text-xs font-mono text-text-secondary shrink-0 overflow-hidden">
              <Image src={card.icon} alt={`${card.title} icon`} width={100} height={100} className="object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-pixel text-text-primary tracking-wide">
               ◆ {card.title}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant={card.badge} />
                {card.categories.map((tag) => (
                  <CategoryBadge key={tag} category={tag} />
                ))}
              </div>
            </div>
         
          </div>

          {/* ========================================== Description columns ========================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <MarkdownDescription
                title={card.title}
                description={card.description}
                requirements={card.requirements}
              />
            </div>

            {/* ===================================================Quick Tech Specs & Metadata Sidebar ============================================================*/}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* ...............................................Asset Metadata Card ..................................................... */}
              <div className="bg-white border border-black rounded-md p-4 flex flex-col gap-3 shadow-xs">
                <h3 className="font-pixel text-xs text-black-primary uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                  <span>≡</span> INFORMATION
                </h3>
                <ul className="flex flex-col gap-2.5 text-xs font-mono text-text-secondary">
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Category:</span>
                    <span className="bg-surface px-1.5 py-0.5 border border-border rounded-xs text-[11px] font-bold text-black-primary uppercase">{card.categories.join(", ")}</span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">License:</span>
                    <span className="text-green-700 font-bold uppercase">{card.badge === "free" ? "Free Commercial" : card.badge}</span>
                  </li>
                  <li className="flex justify-between border-b border-dotted border-border pb-1.5">
                    <span className="font-bold text-black-primary">Requirements:</span>
                    <span>{card.requirements.length} Items Listed</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold text-black-primary">Checksum:</span>
                    <span className="font-mono text-[10px] text-black-secondary">SHA-256 Valid</span>
                  </li>
                </ul>
              </div>

              {/* Support Creator Card */}
              <div className="bg-pink-50 border border-black rounded-md p-4 flex flex-col gap-8 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">💖</span>
                  <h4 className="font-pixel text-xs text-black-primary uppercase">Support Creator</h4>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed">
                  Enjoying this asset package? Consider making a small donation to keep free tools coming!
                </p>
                <button
                  type="button"
                  onClick={() => setIsDonateOpen(true)}
                  className="mt-1 py-3 px-3 bg-pink-300 text-pink-600 border border-red-600 text-xs font-pixel rounded-md hover:text-pink-600 hover:scale-97 transition-all duration-200 cursor-pointer text-center"
                >
                  DONATE NOW &gt;
                </button>
              </div>
                         {/* ====================== ACTION BUTTON DOWNLOAD & DONATE ====================== */}
            <div className="flex w-full max-w-full items-center justify-center">
              <button
                type="button"
                onClick={() => setIsDownloadOpen(true)}
                className="w-full max-w-full py-3 bg-primary text-green-700 text-sm font-pixel rounded-md border border-green-700 hover:text-black-primary hover:scale-97 transition-all duration-200 cursor-pointer"
              >
                DOWNLOAD
              </button>
             
            </div>
            </div>
          </div>
          
        </section>
        

        {/* ..................................................RELATED ASSETS ........................................ */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-pixel uppercase tracking-wide text-black-secondary">
            ▩ Related List Card :
          </h2>
          <CardGrid cards={relatedCards} limit={4} />
        </section>
      </main>

      <Footer />

      {/* .................................................... MODALS ....................................................... */}
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
