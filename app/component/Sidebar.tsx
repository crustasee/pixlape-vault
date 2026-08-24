"use client";

import React from "react";
import { CARDS } from "@/app/data/card";

const categories = [
  "ALL ASSETS",
  "APPS",
  "TOOLS",
  "BRUSH",
  "TEMPLATE",
  "ICON",
  "ART FOR SELL",
  "OTHERS",
];

interface SidebarProps {
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}

export default function Sidebar({
  selectedCategory = null,
  onSelectCategory,
}: SidebarProps) {
  // Get asset counts per category from card.ts
  const getCategoryCount = (cat: string) => {
    if (cat === "ALL ASSETS") return CARDS.length;
    return CARDS.filter((c) =>
      c.categories.some((item) => item.toUpperCase() === cat.toUpperCase())
    ).length;
  };

  const handleCategoryClick = (cat: string) => {
    if (!onSelectCategory) return;
    if (cat === "ALL ASSETS") {
      onSelectCategory(null);
    } else if (selectedCategory === cat) {
      onSelectCategory(null); // toggle off if clicked again
    } else {
      onSelectCategory(cat);
    }
  };

  return (
    <aside className="w-92.5 bg-surface rounded-md border border-black-primary p-6 flex flex-col gap-4 shrink-0 font-mono">
      {/* ================================TAB filter Cattegory============================================ */}
      <div className="flex items-center justify-between mt-1 border-b border-black pb-2">
        <h3 className="text-xs font-pixel text-black-primary uppercase tracking-wider">
          ++ Categories
        </h3>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory?.(null)}
            className="text-[10px] font-mono text-black-secondary hover:text-primary transition-colors uppercase underline cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const isSelected =
            cat === "ALL ASSETS"
              ? !selectedCategory || selectedCategory === "ALL"
              : selectedCategory === cat;
          const count = getCategoryCount(cat);

          return (
            <button
              type="button"
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`w-full py-2.5 px-4 border rounded-md text-sm font-mono font-semibold transition-all cursor-pointer flex items-center justify-between text-left ${
                isSelected
                  ? "bg-primary border-green-700 text-green-700 shadow-xs font-bold scale-[1.04]"
                  : "bg-border border-black-primary text-black-primary hover:bg-green-100 hover:border-primary"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md border font-black ${
                  isSelected
                    ? "bg-green-600 text-white border-white"
                    : "bg-surface text-black-secondary border-border"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/*-------------------InfoStats-------------------*/}
      <div className="border border-white p-3 rounded-sm flex flex-col mt-auto bg-border/40 gap-2 text-xs text-black-secondary font-mono">
        <div className="flex items-center gap-4">
          <span className="text-green-600 font-bold">▣</span> 126 Online Users
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-600 font-bold">▣</span> {CARDS.length} Total Assets
        </div>
      </div>
    </aside>
  );
}
