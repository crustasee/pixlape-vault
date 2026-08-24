import React from "react";
import Header from "../component/Header";
import ArticleSection from "../component/ArticleSection";
import Footer from "../component/Footer";

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono">
      <Header />
      <main className="mt-[68px]">
        <ArticleSection />
      </main>
      <Footer />
    </div>
  );
}
