"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import Sidebar from "@/components/Sidebar";
import CardGrid from "@/components/CardGrid";
import ArticleSection from "@/components/ArticleSection";
import Footer from "@/components/Footer";
import { useAssets } from "@/hooks/useAssets";

function HomeContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || null;
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentPage, setCurrentPage] = useState<number>(isNaN(initialPage) ? 1 : initialPage);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  const assets = useAssets();

  // Sync state when URL searchParams change
  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCategory(cat || null);

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(isNaN(pageParam) ? 1 : pageParam);

    const query = searchParams.get("search");
    setSearchQuery(query || "");
  }, [searchParams]);

  // Update browser URL query string without page reload
  const updateUrl = (cat: string | null, page: number, search: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (cat && cat !== "ALL" && cat !== "ALL ASSETS") {
      params.set("category", cat);
    }
    if (page > 1) {
      params.set("page", page.toString());
    }
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const qs = params.toString();
    const newPath = qs ? `/?${qs}` : "/";
    window.history.replaceState(null, "", newPath);
  };

  const handleSelectCategory = (cat: string | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    updateUrl(cat, 1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(selectedCategory, page, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateUrl(selectedCategory, 1, query);
  };

  // Filter assets by search query if typed
  const displayedAssets = searchQuery.trim()
    ? assets.filter((asset) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          asset.title.toLowerCase().includes(q) ||
          asset.description.toLowerCase().includes(q) ||
          (asset.author && asset.author.toLowerCase().includes(q)) ||
          asset.id.toLowerCase().includes(q)
        );
      })
    : assets;

  return (
    <div className="min-h-screen bg-white text-text-primary font-mono">
      <Header />

      <HeroBanner searchQuery={searchQuery} onSearch={handleSearch} />

      {/* ============================MAIN LAYOUT: Sidebar + Content============================ */}
      <div className="mx-12 flex gap-8 mb-8">
        <Sidebar
          cards={assets}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <CardGrid
          cards={displayedAssets}
          selectedCategory={selectedCategory}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="mx-12 flex mb-8 border gap-8" />

      {/* ============================ARTICLE SECTION============================ */}
      <ArticleSection />

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-text-primary font-mono flex items-center justify-center">
          <span className="text-sm font-bold font-pixel">LOADING PIXLAPE VAULT...</span>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}