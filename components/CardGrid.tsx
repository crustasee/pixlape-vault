"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Badge, { CategoryBadge } from "./Badge";
import { CARDS, CardDetail, CardItem } from "@/lib/db/card";

interface CardGridProps {
  cards?: (CardItem | CardDetail)[];
  selectedCategory?: string | null;
  limit?: number;
  itemsPerPage?: number;
}

export default function CardGrid({
  cards = CARDS,
  selectedCategory,
  limit,
  itemsPerPage = 8,
}: CardGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevCategory, setPrevCategory] = useState(selectedCategory);
  const [prevCards, setPrevCards] = useState(cards);

  // Reset to page 1 during render whenever category filter or cards array changes
  if (selectedCategory !== prevCategory || cards !== prevCards) {
    setPrevCategory(selectedCategory);
    setPrevCards(cards);
    setCurrentPage(1);
  }

  // Filter cards by category if selected
  const filteredCards =
    selectedCategory && selectedCategory !== "ALL" && selectedCategory !== "ALL ASSETS"
      ? cards.filter((card) =>
          card.categories.some(
            (cat) => cat.toUpperCase() === selectedCategory.toUpperCase()
          )
        )
      : cards;
  const totalPages = limit
    ? 1
    : Math.max(1, Math.ceil(filteredCards.length / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);

  const startIndex = limit ? 0 : (effectivePage - 1) * itemsPerPage;
  const endIndex = limit ? limit : startIndex + itemsPerPage;
  const displayCards = limit
    ? filteredCards.slice(0, limit)
    : filteredCards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Smooth scroll back to grid top if in view
    if (typeof window !== "undefined") {
      const gridElem = document.getElementById("asset-card-grid");
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <main id="asset-card-grid" className="flex-1">
      {/* Active Category Filter Header */}
      {selectedCategory && selectedCategory !== "ALL" && selectedCategory !== "ALL ASSETS" && (
        <div className="mb-4 p-1.5 bg-white border border-black rounded-md flex items-center justify-between font-mono text-xs shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-black-secondary font-bold">FILTERED CATEGORY:</span>
            <CategoryBadge category={selectedCategory} />
            <span className="text-black-secondary">
              ({filteredCards.length} {filteredCards.length === 1 ? "asset" : "assets"} found)
            </span>
          </div>
        </div>
      )}

      {/* Card Grid */}
      {displayCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5 font-mono">
          {displayCards.map((card) => {
            const detail = card as CardDetail;
            return (
              <div
                key={card.id}
                className="bg-surface border border-black-secondary rounded-md overflow-hidden flex flex-col justify-between hover:border-primary transition-all shadow-sm group hover:scale-[1.01]"
              >
                <div>
                  {/* Thumbnail header with background image and centered product icon */}
                  <div className="h-28 relative overflow-hidden bg-surface border flex items-center justify-center group/thumb">
                    <Image
                      src={card.thumbnail || "https://res.cloudinary.com/lbovk2lu/image/upload/v1788330128/bgthumb.svg"}
                      alt={`${card.title} background`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 z-20">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white border border-border text-border rounded backdrop-blur-xs">
                        #{card.id}
                      </span>
                    </div>

                    <div className="relative z-10 w-20 h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={card.icon || "/img/Icontemp1.svg"}
                        alt={`${card.title} icon`}
                        width={100}
                        height={100}
                        unoptimized
                        className="object-contain w-full h-full drop-shadow-md"
                      />
                    </div>
                  </div>

                  {/* Badge & Category tag */}
                  <div className="px-4 pt-3 flex items-center justify-between">
                    <Badge variant={card.badge} />
                    <CategoryBadge category={card.categories[0] || "TOOLS"} />
                  </div>

                  {/* Body Content */}
                  <div className="p-4 pt-2.5 flex flex-col gap-2">
                    <Link href={`/cards/${card.id}`}>
                      <h3 className="font-bold text-sm text-black-primary group-hover:text-emerald-700 leading-snug line-clamp-1">
                        {card.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-black-secondary line-clamp-2 leading-relaxed">
                      {detail.description || "Digital vault asset package with complete resources and documentation."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] text-black-secondary bg-white p-2.5 rounded border border-border">
                      <div>
                        <span className="text-[10px] text-black-secondary/80 block">FORMAT</span>
                        <span className="font-bold text-black-primary truncate block">
                          {detail.fileType || detail.fileFormat || ".ZIP"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-black-secondary/80 block">VERSION / SIZE</span>
                        <span className="font-bold text-black-primary truncate block">
                          {detail.version || "v1.0"} ({detail.fileSize || "10MB"})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="p-3 bg-white border-border flex items-center justify-center">

                  <Link
                    href={`/cards/${card.id}`}
                    className="px-8 py-1 bg-surface border border-black-secondary text-black-secondary text-xs font-mono font-bold shadow-pixel rounded-md hover:bg-primary hover:scale-95 transition-all text-center block"
                  >
                    VIEW DETAIL &gt;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white border border-black rounded-md font-mono flex flex-col items-center gap-3">
          <span className="text-2xl">📦</span>
          <h3 className="font-pixel text-sm text-black-primary">NO ASSETS FOUND</h3>
          <p className="text-xs text-text-secondary">
            No digital assets currently match the selected category filter.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!limit && filteredCards.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border font-mono">
          {/* Asset Count / Page Indicator */}
          <div className="text-xs text-black-secondary">
            SHOWING <span className="font-bold text-black-primary">{startIndex + 1}</span>-
            <span className="font-bold text-black-primary">
              {Math.min(endIndex, filteredCards.length)}
            </span>{" "}
            OF <span className="font-bold text-black-primary">{filteredCards.length}</span> ASSETS
            {totalPages > 1 && (
              <span className="ml-2 text-text-secondary font-semibold">
                [PAGE {effectivePage} / {totalPages}]
              </span>
            )}
          </div>

          {/* Page Buttons & Next / Prev navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(effectivePage - 1)}
                disabled={effectivePage <= 1}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md border transition-all ${
                  effectivePage <= 1
                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-surface border-black-primary text-black-primary shadow-pixel hover:bg-primary hover:scale-95 cursor-pointer"
                }`}
                aria-label="Previous Page"
              >
                &lt; PREV
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 flex items-center justify-center text-xs font-mono font-bold rounded-md border transition-all ${
                      effectivePage === pageNum
                        ? "bg-primary border-black-strong text-black shadow-pixel font-bold"
                        : "bg-surface border-black-primary text-black-secondary hover:bg-border hover:text-black-primary cursor-pointer hover:scale-95"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(effectivePage + 1)}
                disabled={effectivePage >= totalPages}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md border transition-all ${
                  effectivePage >= totalPages
                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-surface border-black-primary text-black-primary shadow-pixel hover:bg-primary hover:scale-95 cursor-pointer"
                }`}
                aria-label="Next Page"
              >
                NEXT &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
