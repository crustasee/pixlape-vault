"use client";

import React, { useState } from "react";
import Header from "./component/Header";
import HeroBanner from "./component/HeroBanner";
import Sidebar from "./component/Sidebar";
import CardGrid from "./component/CardGrid";
import ArticleSection from "./component/ArticleSection";
import Footer from "./component/Footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg- text-text-primary font-mono">
      <Header />

      <HeroBanner />

      {/* ============================MAIN LAYOUT: Sidebar + Content============================ */}
      <div className="mx-12 flex gap-8 mb-8">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <CardGrid selectedCategory={selectedCategory} />
      </div>

      <div className="mx-12 flex mb-8 border-b-2 gap-8" />

      {/* ============================ARTICLE SECTION============================ */}
      <ArticleSection />

      <Footer />
    </div>
  );
}