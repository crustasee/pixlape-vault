"use client";

import React, { useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import Link from "next/link";

interface FAQItem {
  id: number;
  category: "General" | "Downloads & Assets" | "Licensing & Safety" | "Creators & Donating";
  question: string;
  answer: string;
  steps?: string[];
  note?: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: "Downloads & Assets",
    question: "How to Download Asset?",
    answer: "Downloading digital assets from Pixlape Vault is direct and free of intrusive ads. All assets are verified and hosted with high-speed direct mirrors.",
    steps: [
      "Navigate to the asset detail page from the homepage card grid.",
      "Click the green 'DOWNLOAD' button located in the top-right action area.",
      "A 15-second safety verification countdown will initiate.",
      "Once completed, click 'YOUR DOWNLOAD LINK IS READY' to obtain your file."
    ],
    note: "All files are scanned for malware before being indexed into the vault."
  },
  {
    id: 2,
    category: "Downloads & Assets",
    question: "What software and formats are free?",
    answer: "Most tools, brush packs (.ABR), templates (Figma/PSD), and icon sets (.SVG/.PNG) marked with the green 'FREE' badge can be downloaded and used at zero cost.",
    steps: [
      "Look for the 'Free' pill badge on the card preview.",
      "Check the 'System Requirements' list on the detail page to ensure software compatibility.",
      "No account registration is required for free tier assets."
    ]
  },
  {
    id: 3,
    category: "Licensing & Safety",
    question: "Are files and software safe from malware?",
    answer: "Every asset submitted by creators undergoes automated and manual integrity checks, SHA-256 verification, and VirusTotal scanning prior to public listing.",
    note: "If you detect any false positives or suspicious behavior, please report immediately via our Contact page."
  },
  {
    id: 4,
    category: "Licensing & Safety",
    question: "What is the Pixlape License policy?",
    answer: "Free assets are generally distributed under Creative Commons or MIT licenses for personal and commercial projects unless stated otherwise by the creator in the requirement block.",
    steps: [
      "Personal Use: 100% permitted for all free vault items.",
      "Commercial Projects: Permitted for items with CC-BY or MIT licenses.",
      "Redistribution / Reselling: Strictly prohibited without creator permission."
    ]
  },
  {
    id: 5,
    category: "Creators & Donating",
    question: "How to donate or tip a creator?",
    answer: "You can support creators directly through our integrated tipping modal. Pixlape takes 0% commission on creator tips.",
    steps: [
      "Click the pink 'DONATE ❤️' button on any asset view page.",
      "Choose your preferred gateway: Trakteer, Saweria, or QRIS / Midtrans.",
      "Follow the on-screen prompt to complete your tip."
    ]
  },
  {
    id: 6,
    category: "Creators & Donating",
    question: "How to become a contributor?",
    answer: "We welcome developers, UI designers, pixel artists, and brush makers to share their creations with the Pixlape community.",
    steps: [
      "Go to the 'Contact Us' page.",
      "Select the 'CREATOR SUBMISSION' channel.",
      "Provide your asset name, file formats, demo previews, and download links.",
      "Our curation team will review and list your tool within 24–48 hours."
    ]
  },
  {
    id: 7,
    category: "General",
    question: "How to contact vault support?",
    answer: "For bug reports, broken links, or business inquiries, transmit a message directly through our Contact page or email contact@pixlape.com.",
    note: "Average response time is under 24 hours during standard operating cycles."
  }
];

export default function HelpPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "General", "Downloads & Assets", "Licensing & Safety", "Creators & Donating"];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === "ALL" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeFaq = FAQS.find((f) => f.id === selectedId) || FAQS[0];

  return (
    <div className="min-h-screen w-full max-w-full bg-surface text-text-primary font-mono flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-full w-full mx-auto px-6 sm:px-12 pt-18.75 pb-16 flex flex-col gap-5">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <Link
            href="/"
            className="text-xs font-mono text-black-secondary hover:text-black-primary transition-colors flex items-center gap-2"
          >
            <span>&lt;</span> BACK TO TROVE
          </Link>
          <span className="text-xs font-bold text-black-secondary">
            KNOWLEDGE BASE // FAQ PROTOCOL
          </span>
        </div>

        {/* Top Hero Banner */}
        <section className="bg-border border border-black rounded-md p-6 flex flex-col gap-3 relative overflow-hidden">
          <div className="text-xs font-black text-black-secondary">
            <span>[ SYSTEM HELP CENTER & DIRECTORY ]</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-pixel font-bold text-black-secondary tracking-wide">
            +++++ HELP CENTER & FAQ ???
          </h1>
          <p className="border border-border rounded-md bg-black-secondary/40 p-3 text-xs sm:text-sm text-surface max-w-full leading-relaxed">
            Your comprehensive resource for Pixlape Vault. Discover download instructions, software compatibility, safety checks, creator tipping, and license guidelines.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords (e.g. download, license, donate)..."
              className="w-full px-5 py-2.5 text-xs font-mono border border-black bg-white rounded-md text-black-primary placeholder:text-black-secondary/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </section>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-4">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 text-xs font-mono rounded-md border transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-black-secondary text-white border-black font-bold scale-[1.05]"
                    : "bg-white text-black-primary border-black hover:bg-border"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Side-by-Side: Question Panel (Left) & Answer Panel (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          
          {/* ── Left Column: Question List (5 Cols) ── */}
          <aside className="lg:col-span-5 bg-border/50 border rounded-md p-5 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-black font-bold text-black-primary uppercase tracking-wide">
                ≡ LIST QUESTIONS ({filteredFaqs.length})
              </h2>
              <span className="text-[10px] font-mono text-text-secondary">
                ▽
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-150 overflow-y-auto pr-1">
              {filteredFaqs.length === 0 ? (
                <div className="p-6 text-center text-xs text-text-secondary bg-border rounded-md border border-dashed border-black">
                  No matching questions found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isActive = activeFaq.id === faq.id;
                  return (
                    <button
                      key={faq.id}
                      type="button"
                      onClick={() => setSelectedId(faq.id)}
                      className={`p-2 rounded-md border text-left flex items-start gap-4 transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-primary border-black text-black-primary shadow-xs font-bold translate-x-1"
                          : "bg-white border-black text-black-primary hover:bg-green-100 hover:border-black"
                      }`}
                    >
                      <span className="font-black text-xs shrink-0 mt-0.5">
                        {isActive ? "▶" : `${faq.id}.`}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono font-bold leading-snug">
                          {faq.question}
                        </span>
                        <span className={`text-[10px] font-mono ${isActive ? "text-black-primary/80" : "text-text-secondary"}`}>
                          TAG: {faq.category}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ── Right Column: Answer Panel (7 Cols) ── */}
          <section className="lg:col-span-7 bg-surface border border-black rounded-md p-5 sm:p-6 flex flex-col gap-4 shadow-sm sticky top-17">
            
            {/* Header / Question Title */}
            <div className="flex flex-col gap-5 border-b border-black pb-4">
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-border border border-black rounded-md text-[10px] font-mono text-black-primary">
                  CATEGORY: {activeFaq.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-black-secondary">
                  QUESTION #{activeFaq.id}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-pixel font-bold text-black-secondary tracking-wide leading-tight">
                {activeFaq.id}. {activeFaq.question}
              </h2>
            </div>

            {/* Answer Explanation */}
            <div className="flex flex-col gap-6 text-xs sm:text-sm font-mono text-black-primary leading-relaxed">
              <p className="bg-white border border-border p-5 rounded-md text-text-secondary leading-relaxed">
                {activeFaq.answer}
              </p>

              {/* Step-by-Step Instructions */}
              {activeFaq.steps && (
                <div className="flex flex-col gap-3 bg-border/50 border border-black p-4 rounded-md">
                  <h3 className="text-sm font-black font-bold text-black-primary uppercase">
                    ≡ PROCEDURE & STEPS:
                  </h3>
                  <ol className="flex flex-col gap-2 pl-4 list-decimal text-xs text-text-secondary">
                    {activeFaq.steps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <strong className="text-black-primary">Step {idx + 1}:</strong> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Notice / Tip Box */}
              {activeFaq.note && (
                <div className="p-3.5 bg-primary/20 border border-black rounded-md flex items-start gap-2.5 text-xs text-black-primary">
                  <span className="text-sm shrink-0">💡</span>
                  <p className="leading-relaxed">
                    <strong>VAULT NOTE:</strong> {activeFaq.note}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Panel Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border mt-2">
              <span className="text-xs text-text-secondary">
                Did this answer resolve your inquiry?
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/contact"
                  className="px-3 py-1 bg-black-secondary border border-black rounded-md text-border text-xs font-mono font-bold hover:bg-primary hover:text-black-primary transition-colors"
                >
                  CONTACT SUPPORT &gt;
                </Link>
                <Link
                  href="/"
                  className="px-3 py-1 bg-border border border-black rounded-md text-black-primary text-xs font-mono font-bold hover:bg-surface transition-opacity"
                >
                  EXPLORE VAULT &gt;
                </Link>
              </div>
            </div>

          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}
