"use client";

import React from "react";
import Header from "@/components/Header";
import ArticleSection from "@/components/ArticleSection";
import Footer from "@/components/Footer";

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono">
      <Header />
      <main className="mt-17">
        <ArticleSection />
      </main>
      <Footer />
    </div>
  );
}
