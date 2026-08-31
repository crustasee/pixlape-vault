"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Badge, { CategoryBadge } from "./Badge";
import { CARDS, CardItem } from "@/lib/db/card";

interface CardGridProps {
  cards?: CardItem[];
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
          {displayCards.map((card) => (
            <div
              key={card.id}
              className="bg-surface rounded-md border border-black overflow-hidden flex flex-col hover:scale-102 hover:border-primary hover:bg-green-100 hover:shadow-lg transition-all duration-200"
            >
              {/* Card thumbnail with border background, white grid texture, and centered product icon */}
              <div
                className="h-48 relative overflow-hidden bg-border border-b border-black flex items-center justify-center group/thumb"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={card.icon || card.thumbnail || "/img/Icontemp1.svg"}
                    alt={`${card.title} icon`}
                    width={80}
                    height={80}
                    unoptimized
                    className="object-contain w-full h-full drop-shadow-md"
                  />
                </div>
              </div>

              {/* Badge & Category tag */}
              <div className="px-4 pt-3 flex items-center justify-between">
                <Badge variant={card.badge} />
                <CategoryBadge category={card.categories[0]} />
              </div>

              <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <h2 className="text-sm font-mono font-bold text-text-primary line-clamp-2">
                  {card.title}
                </h2>
                <Link
                  href={`/cards/${card.id}`}
                  className="w-full py-2 bg-border border border-black-primary text-black-primary text-xs font-mono font-semibold shadow-pixel rounded-md hover:bg-primary hover:scale-95 transition-all duration-200 text-center block"
                >
                  VIEW DETAIL PAGE &gt;
                </Link>
              </div>
            </div>
          ))}
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
