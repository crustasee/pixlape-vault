import React from "react";
import Image from "next/image";
import Link from "next/link";
import Badge, { CategoryBadge } from "./Badge";
import { CARDS, CardItem } from "@/app/data/card";

interface CardGridProps {
  cards?: CardItem[];
  selectedCategory?: string | null;
  limit?: number;
}

export default function CardGrid({
  cards = CARDS,
  selectedCategory,
  limit,
}: CardGridProps) {
  // Filter cards by category if selected
  const filteredCards =
    selectedCategory && selectedCategory !== "ALL" && selectedCategory !== "ALL ASSETS"
      ? cards.filter((card) =>
          card.categories.some(
            (cat) => cat.toUpperCase() === selectedCategory.toUpperCase()
          )
        )
      : cards;

  const displayCards = limit ? filteredCards.slice(0, limit) : filteredCards;

  return (
    <main className="flex-1">
      {/* Active Category Filter Header */}
      {selectedCategory && selectedCategory !== "ALL" && selectedCategory !== "ALL ASSETS" && (
        <div className="mb-4 p-1.5 bg-white border border-black rounded-md flex items-center justify-between font-mono text-xs shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-black-secondary font-bold">FILTERED CATEGORY:</span>
            <CategoryBadge category={selectedCategory} />
            <span className="text-black-secondary">({displayCards.length} assets found)</span>
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
              {/* Card thumbnail image */}
              <div className="h-50 relative overflow-hidden bg-border border-b border-black">
                <Image
                  src={card.thumbnail}
                  alt={`${card.title} preview`}
                  fill
                  className="object-cover"
                />
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
                  href={`/card/${card.id}`}
                  className="w-full py-2 bg-black-secondary text-white text-xs font-mono font-semibold rounded-md hover:bg-primary hover:text-green-700 transition-opacity text-center block"
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

      {/* Next Button */}
      <div className="flex justify-end mt-4">
        <button className="px-5 py-1 bg-border border border-black-primary text-black-secondary text-lg font-mono font-semibold rounded-lg hover:bg-black-secondary hover:text-white transition-opacity">
          NEXT &gt;
        </button>
      </div>
    </main>
  );
}
