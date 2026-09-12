"use client";

import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";

type DocumentTab = "terms" | "privacy" | "license";

interface SectionItem {
  id: string;
  label: string;
}

const TABS: { id: DocumentTab; label: string; icon: string; path: string }[] = [
  { id: "terms", label: "TERMS", icon: "▤", path: "/document/terms" },
  { id: "privacy", label: "PRIVACY", icon: "◎", path: "/document/privacy" },
  { id: "license", label: "LICENSE", icon: "◈", path: "/document/license" },
];

const SECTIONS_MAP: Record<DocumentTab, SectionItem[]> = {
  terms: [
    { id: "acceptance", label: "01. Acceptance of Terms" },
    { id: "services", label: "02. Platform Description" },
    { id: "acceptable-use", label: "03. Acceptable Use & Integrity" },
    { id: "safety", label: "04. Downloads & Safety Checks" },
    { id: "creator-conduct", label: "05. Creator Submissions" },
    { id: "donations", label: "06. Creator Tips & Donations" },
    { id: "liability", label: "07. Limitation of Liability" },
    { id: "modifications", label: "08. Amendments & Termination" },
  ],
  privacy: [
    { id: "philosophy", label: "01. Privacy Philosophy" },
    { id: "collection", label: "02. Data We Collect" },
    { id: "usage", label: "03. Purpose of Processing" },
    { id: "storage", label: "04. Cookies & Local Storage" },
    { id: "third-party", label: "05. Third-Party Integrations" },
    { id: "retention", label: "06. Security & Data Retention" },
    { id: "rights", label: "07. User Rights (GDPR & Global)" },
    { id: "contact-privacy", label: "08. Privacy Officer Contact" },
  ],
  license: [
    { id: "overview", label: "01. License Scope & Grant" },
    { id: "free-tier", label: "02. Free Commercial License" },
    { id: "premium-tier", label: "03. Premium & Paid Assets" },
    { id: "permitted", label: "04. Permitted Applications" },
    { id: "prohibited", label: "05. Prohibited Uses" },
    { id: "creator-rights", label: "06. Creator Intellectual Property" },
    { id: "disclaimer", label: "07. Warranty Disclaimer & DMCA" },
  ],
};

function DocumentView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Resolve active tab from URL path (e.g. /document/terms) or query (e.g. /document?tab=terms)
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const rawQuery = searchParams.get("tab");
  const tabCandidate = (rawSlug || rawQuery || "terms").toLowerCase() as DocumentTab;

  const activeTab: DocumentTab =
    tabCandidate === "privacy" || tabCandidate === "license" ? tabCandidate : "terms";

  const handleTabSwitch = (tab: DocumentTab) => {
    router.push(`/document/${tab}`, { scroll: false });
  };

  const sections = SECTIONS_MAP[activeTab];

  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 w-full max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 pt-16 pb-16 flex flex-col gap-2">
        {/* ── Breadcrumb & Document Switcher Tabs ──────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:border-zinc-800 pb-4">
          <Link
            href="/"
            className="self-start text-xs font-mono text-black-secondary hover:text-black-primary dark:text-zinc-400 dark:hover:text-primary transition-colors flex items-center gap-2"
          >
            <span>&lt;</span> BACK TO TROVE
          </Link>

          {/* Legal Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`px-3 py-1.5 rounded-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-primary text-black font-bold shadow-xs"
                      : "border border-border dark:border-zinc-700 bg-surface dark:bg-zinc-900 text-black-secondary dark:text-zinc-400 hover:text-primary hover:border-primary"
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Dynamic Hero Banner ─────────────────────────────── */}
        {activeTab === "terms" && (
          <section className="bg-border/60 dark:bg-zinc-900/90 border border-black dark:border-zinc-800 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="px-2 py-0.5 rounded-xs bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black-primary dark:text-zinc-200">
                OPERATING COVENANT // REF: PV-TOS-2026.08
              </span>
              <span className="text-primary font-bold">STATUS: ENFORCED PROTOCOL</span>
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-pixel text-black-primary dark:text-zinc-100 tracking-wide uppercase mt-1 mb-3">
              +++ TERMS OF SERVICE &amp; OPERATING DIRECTIVE +++
            </h1>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              By connecting to Pixlape Vault, utilizing repository mirrors, or accessing hosted digital tools, you agree
              to abide by these binding Terms of Service. Please review these operational stipulations carefully before
              executing asset transfers.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 border-t border-border/80 dark:border-zinc-800 pt-3">
              <span>VERSION: 2.4.0-STABLE</span>
              <span>•</span>
              <span>GOVERNING ARCHIVE: PIXLAPE TROVE</span>
              <span>•</span>
              <span>DISPUTE CHANNEL: CONTACT@PIXLAPE.COM</span>
            </div>
          </section>
        )}

        {activeTab === "privacy" && (
          <section className="bg-border/60 dark:bg-zinc-900/90 border border-black dark:border-zinc-800 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="px-2 py-0.5 rounded-xs bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black-primary dark:text-zinc-200">
                PRIVACY PROTOCOL // REF: PV-PRIV-2026.08
              </span>
              <span className="text-primary font-bold">ZERO TRACKER DIRECTIVE</span>
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-pixel text-black-primary dark:text-zinc-100 tracking-wide uppercase mt-1 mb-3">
              +++ DATA PRIVACY &amp; TELEMETRY DIRECTIVE +++
            </h1>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              Pixlape Vault is built on principles of minimal telemetry, sovereign data privacy, and open asset
              distribution. We do not engage in behavioral advertising, third-party pixel tracking, or covert
              data harvesting. Learn how your data is handled when you browse and download from the vault.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 border-t border-border/80 dark:border-zinc-800 pt-3">
              <span>LAST UPDATED: AUGUST 2026</span>
              <span>•</span>
              <span>TRACKING COOKIES: 0 ACTIVE</span>
              <span>•</span>
              <span>COMPLIANCE: GLOBAL PRIVACY &amp; GDPR ALIGNED</span>
            </div>
          </section>
        )}

        {activeTab === "license" && (
          <section className="bg-border/60 dark:bg-zinc-900/90 border border-black dark:border-zinc-800 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 mb-2">
              <span className="px-2 py-0.5 rounded-xs bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black-primary dark:text-zinc-200">
                LEGAL DIRECTIVE // REF: PV-LIC-2026.08
              </span>
              <span className="text-primary font-bold">STATUS: RATIFIED &amp; ENFORCED</span>
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-pixel text-black-primary dark:text-zinc-100 tracking-wide uppercase mt-1 mb-3">
              +++ PIXLAPE ASSET LICENSING PROTOCOL +++
            </h1>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              This document sets forth the comprehensive terms governing the distribution, modification,
              and commercial deployment of digital assets hosted across Pixlape Vault (including software
              applications, developer utilities, Photoshop/Procreate brushes, UI design kits, icons, and artwork).
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 border-t border-border/80 dark:border-zinc-800 pt-3">
              <span>EFFECTIVE DATE: AUGUST 2026</span>
              <span>•</span>
              <span>APPLIES TO: ALL REPOSITORY ASSETS</span>
              <span>•</span>
              <span>COMMISSION MODEL: 0% CREATOR CUT</span>
            </div>
          </section>
        )}

        {/* ── Main Layout: Table of Contents & Content Body ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Table of Contents */}
          <aside className="lg:col-span-4 sticky top-20 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/60 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-pixel text-black-primary dark:text-zinc-200 mb-4 pb-2 border-b border-border dark:border-zinc-800">
              <span>▷</span> TABLE OF CONTENTS
            </div>
            <nav className="flex flex-col gap-1.5 text-xs font-mono">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="px-2.5 py-1.5 rounded-sm text-zinc-600 dark:text-zinc-400 hover:text-primary hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-colors flex items-center justify-between"
                >
                  <span>{sec.label}</span>
                  <span className="text-[10px] text-zinc-400">↳</span>
                </a>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-border dark:border-zinc-800 flex flex-col gap-2">
              <span className="text-[10px] font-pixel text-zinc-500 uppercase tracking-wider">
                Need Legal Clarification?
              </span>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Explore our FAQ archive or contact our administrative routing desk.
              </p>
              <div className="flex gap-2 mt-1">
                <Link
                  href="/help"
                  className="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 border border-border dark:border-zinc-700 rounded-sm text-xs font-mono hover:text-primary hover:border-primary transition-colors text-center"
                >
                  HELP CENTER
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 bg-black text-white dark:bg-zinc-100 dark:text-black rounded-sm text-xs font-mono font-bold hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-colors text-center"
                >
                  CONTACT ✉
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Document Content */}
          <article className="lg:col-span-8 flex flex-col gap-8">
            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: TERMS OF SERVICE                                  */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === "terms" && (
              <>
                <section
                  id="acceptance"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 01</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      ACCEPTANCE OF TERMS
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    By browsing, accessing, or downloading from Pixlape Vault (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
                    you signify your unreserved assent to these Terms of Service, along with our accompanying Privacy Directive
                    and Asset Licensing Protocol. If you disagree with any portion of these provisions, your sole remedy is to
                    discontinue use of the Platform immediately.
                  </p>
                </section>

                <section
                  id="services"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 02</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PLATFORM DESCRIPTION &amp; INTENDED USE
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Pixlape Vault provides an open digital index and mirror network featuring curated graphic design tools,
                    Photoshop and Procreate brushes, vector icons, UI layout templates, application builds, and digital
                    artifacts. We serve as a neutral showcase hub empowering creative artisans to publish and discover
                    high-caliber resources.
                  </p>
                </section>

                <section
                  id="acceptable-use"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 03</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      ACCEPTABLE USE &amp; SYSTEM INTEGRITY
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Users shall not execute or orchestrate any of the following activities on our network infrastructure:
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">⊗</span>
                      <span>
                        Deploying robotic scrapers, automated crawl bots, or flood scripts that overburden download
                        bandwidth or mirror rate limits.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">⊗</span>
                      <span>
                        Attempting to reverse-engineer, inject SQL exploits, probe unauthorized administrative routes,
                        or bypass security verification timers.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">⊗</span>
                      <span>
                        Submitting corrupted file payloads, trojans, ransomware, spyware, or keyloggers disguised as
                        legitimate creative toolkits.
                      </span>
                    </li>
                  </ul>
                </section>

                <section
                  id="safety"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 04</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      DOWNLOADS &amp; SAFETY VERIFICATION TIMERS
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    To prevent automated hotlinking and bandwidth denial-of-service, asset downloads may require a
                    brief on-page security validation countdown (typically 15 seconds).
                  </p>
                  <div className="bg-zinc-100 dark:bg-zinc-900 border-l-4 border-primary p-4 rounded-r-md text-xs text-zinc-800 dark:text-zinc-300">
                    <strong>MALWARE PROTOCOL:</strong> Every asset submitted to Pixlape Vault is scanned via automated
                    antivirus engines and SHA-256 cryptographic checksums before listing. However, users are always advised
                    to execute software downloads in isolated sandboxes or testing environments.
                  </div>
                </section>

                <section
                  id="creator-conduct"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 05</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      CREATOR SUBMISSIONS &amp; ACCURACY
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Creators who transmit asset entries warrant that they possess legitimate ownership or necessary licensing
                    rights to distribute their materials. Submissions must include accurate system compatibility requirements,
                    explicit license terms, and genuine demonstration previews.
                  </p>
                </section>

                <section
                  id="donations"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 06</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      CREATOR TIPS &amp; VOLUNTARY DONATIONS
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Pixlape incorporates integrated donation modals (Saweria, Trakteer, QRIS) allowing users to tip
                    contributing creators. All donations are purely voluntary gifts. Pixlape takes a <strong>0% fee</strong>,
                    and all processing is governed by the respective third-party payment intermediary.
                  </p>
                </section>

                <section
                  id="liability"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 07</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      LIMITATION OF LIABILITY
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    UNDER NO CIRCUMSTANCES SHALL PIXLAPE VAULT, ITS OPERATORS, VOLUNTEERS, OR AFFILIATES BE LIABLE FOR ANY
                    DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES (INCLUDING DATA LOSS,
                    HARDWARE MALFUNCTION, COMMERCIAL INTERRUPTION, OR LOST PROFITS) RESULTING FROM THE USE OR INABILITY
                    TO USE ASSETS OBTAINED VIA THE PLATFORM.
                  </p>
                </section>

                <section
                  id="modifications"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 08</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      AMENDMENTS &amp; TERMINATION
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    We reserve the right to revise or modify these Terms at our sole discretion. Any changes will be posted
                    directly to this page with an updated revision date. Continued utilization of the repository following
                    such updates constitutes binding ratification of the revised conditions.
                  </p>
                </section>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: PRIVACY POLICY                                    */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === "privacy" && (
              <>
                <section
                  id="philosophy"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 01</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PRIVACY PHILOSOPHY &amp; ARCHITECTURE
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Pixlape operates on a simple premise: great tools and creative resources do not require tracking
                    individuals across the web. We believe software repositories should respect digital sovereignty.
                    Consequently, our infrastructure is architected from the ground up to minimize telemetry and omit
                    intrusive behavioral trackers.
                  </p>
                  <div className="bg-zinc-100 dark:bg-zinc-900 border-l-4 border-primary p-4 rounded-r-md text-xs text-zinc-800 dark:text-zinc-300">
                    <strong>COMMITMENT:</strong> We do NOT sell, rent, monetize, or broker personal records to data aggregators,
                    advertising networks, or machine learning scrapers.
                  </div>
                </section>

                <section
                  id="collection"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 02</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      DATA WE COLLECT (MINIMAL FOOTPRINT)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    We categorize our minimal data collection into two explicit streams:
                  </p>
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <h3 className="font-pixel text-xs text-primary mb-1">A. VOLUNTARILY PROVIDED INFORMATION</h3>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        When you dispatch an inquiry via our Contact form or transmit a creator asset submission, we collect
                        the specific fields you input (such as your Name, Email address, Social Handle, and transmission
                        message) to respond directly to your request.
                      </p>
                    </div>
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <h3 className="font-pixel text-xs text-primary mb-1">B. AUTOMATED SERVER LOGS (ANONYMIZED)</h3>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        When connecting to our web nodes, standard HTTP request headers are logged temporarily for network
                        health and DDoS defense (anonymized IP address, timestamp, requested URI, and user-agent string). These
                        logs are retained for 14 days solely for security monitoring.
                      </p>
                    </div>
                  </div>
                </section>

                <section
                  id="usage"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 03</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PURPOSE OF DATA PROCESSING
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Any information collected is strictly utilized for the following legitimate technical purposes:
                  </p>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-2 pl-2">
                    <li>Verifying download mirror integrity and routing high-speed asset transfers.</li>
                    <li>Executing automated malware verification and hash integrity checks.</li>
                    <li>Facilitating creator reviews and publishing verified asset metadata.</li>
                    <li>Mitigating robotic scrapers, automated exploit probes, and denial-of-service attempts.</li>
                  </ul>
                </section>

                <section
                  id="storage"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 04</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      COOKIES &amp; LOCAL STORAGE
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Pixlape Vault does <strong>NOT</strong> employ third-party advertising cookies or cross-site tracking beacons.
                    We rely exclusively on lightweight, privacy-preserving browser local storage:
                  </p>
                  <div className="border border-border dark:border-zinc-800 rounded-md overflow-hidden text-xs">
                    <div className="grid grid-cols-3 bg-zinc-200 dark:bg-zinc-800 p-2.5 font-pixel text-[10px] text-black-primary dark:text-zinc-200">
                      <span>KEY</span>
                      <span>STORAGE TYPE</span>
                      <span>PURPOSE</span>
                    </div>
                    <div className="grid grid-cols-3 p-2.5 border-t border-border dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <span className="font-mono text-primary font-bold">theme</span>
                      <span>localStorage</span>
                      <span>Persists your Light / Dark mode UI display selection.</span>
                    </div>
                  </div>
                </section>

                <section
                  id="third-party"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 05</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      THIRD-PARTY INTEGRATIONS
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    To support open-source creators and host external guides, Pixlape integrates with select external endpoints:
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">→</span>
                      <span>
                        <strong>Creator Donation Platforms:</strong> Tipping links connect directly to Trakteer, Saweria,
                        or Midtrans. Any payment data entered on these gateways is encrypted by those independent processors;
                        Pixlape does not store credit card or banking information.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">→</span>
                      <span>
                        <strong>Cloudflare CDN &amp; Mirror Nodes:</strong> Asset downloads and edge routing are secured
                        through global edge networks to ensure DDOS mitigation and rapid file delivery.
                      </span>
                    </li>
                  </ul>
                </section>

                <section
                  id="retention"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 06</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      SECURITY &amp; DATA RETENTION
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    All communications transmitted to Pixlape Vault are encrypted in transit using industry-standard
                    TLS 1.3 cryptographic protocols. Correspondence sent through our Contact form is purged from active
                    dispatch buffers after 90 days unless required for unresolved legal or licensing compliance.
                  </p>
                </section>

                <section
                  id="rights"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 07</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      USER RIGHTS (GDPR &amp; GLOBAL STANDARDS)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Regardless of your physical jurisdiction, Pixlape honors universal digital rights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="font-bold text-black-primary dark:text-zinc-100 block mb-1">RIGHT TO ACCESS</span>
                      <p className="text-zinc-600 dark:text-zinc-400">Request a complete copy of any communications linked to your email.</p>
                    </div>
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="font-bold text-black-primary dark:text-zinc-100 block mb-1">RIGHT TO ERASURE</span>
                      <p className="text-zinc-600 dark:text-zinc-400">Demand total deletion of your message history and contact records.</p>
                    </div>
                  </div>
                </section>

                <section
                  id="contact-privacy"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 08</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PRIVACY OFFICER CONTACT
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    To submit privacy compliance inquiries or request data audit reports, transmit a dispatch to our
                    designated data privacy officer:
                  </p>
                  <div className="p-4 rounded-md border border-border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 text-xs text-zinc-700 dark:text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold block text-black-primary dark:text-zinc-100">DATA PRIVACY DIRECTORY</span>
                      <span>Email: contact@pixlape.com</span>
                    </div>
                    <Link
                      href="/contact"
                      className="px-3 py-1.5 bg-black text-white dark:bg-zinc-100 dark:text-black rounded-sm text-xs font-mono font-bold hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-colors self-start sm:self-center"
                    >
                      DISPATCH FORM ✉
                    </Link>
                  </div>
                </section>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: ASSET LICENSE PROTOCOL                             */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === "license" && (
              <>
                <section
                  id="overview"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 01</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      LICENSE SCOPE &amp; GRANT
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Pixlape Vault serves as a curated digital repository connecting creators, artists, and software
                    engineers with high-utility assets. When you download, install, or mirror an asset indexed within
                    this platform, you are granted a non-exclusive, worldwide, revocable license pursuant to the tier
                    designated on the asset&apos;s cryptographic manifest badge.
                  </p>
                  <div className="bg-zinc-100 dark:bg-zinc-900 border-l-4 border-primary p-4 rounded-r-md text-xs text-zinc-800 dark:text-zinc-300">
                    <strong>CORE PRINCIPLE:</strong> You obtain the legal authorization to utilize the digital artifact
                    within your projects; however, ownership of copyright, trademarks, and underlying source code remains
                    vested entirely with the verified original author.
                  </div>
                </section>

                <section
                  id="free-tier"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 02</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PIXLAPE FREE COMMERCIAL LICENSE
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    All digital tools, brush libraries, templates, and UI components marked with the green{" "}
                    <span className="font-pixel px-1.5 py-0.5 rounded-xs border border-primary text-primary bg-primary/10">
                      FREE
                    </span>{" "}
                    badge are distributed under the standard Pixlape Free License (modeled on CC-BY and MIT principles).
                  </p>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-2 pl-2">
                    <li>
                      <strong>Zero Download Fees:</strong> No subscription tiers, paywalls, or mandatory billing
                      information are required to access free tier mirrors.
                    </li>
                    <li>
                      <strong>Commercial Monetization:</strong> Permitted for incorporation into commercial client work,
                      indie video games, advertising campaigns, and client websites without additional licensing fees.
                    </li>
                    <li>
                      <strong>Attribution Guidelines:</strong> While crediting the original creator (e.g., &quot;Brushes
                      by [Creator] via Pixlape&quot;) is deeply appreciated, it is voluntary unless specifically mandated in
                      the creator&apos;s packaged license file.
                    </li>
                  </ul>
                </section>

                <section
                  id="premium-tier"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 03</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PREMIUM &amp; PAID ASSETS
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Assets labeled with{" "}
                    <span className="font-pixel px-1.5 py-0.5 rounded-xs border border-yellow-400 text-yellow-400 bg-yellow-400/10">
                      PREMIUM
                    </span>{" "}
                    or{" "}
                    <span className="font-pixel px-1.5 py-0.5 rounded-xs border border-blue-400 text-blue-400 bg-blue-400/10">
                      PAID
                    </span>{" "}
                    are curated showcases linking directly to creator-authorized storefronts (e.g., Gumroad, itch.io, or
                    direct payment gates).
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Pixlape takes <strong>0% commission</strong> on creator sales and donations. Purchases completed
                    through external creator gateways are governed by that creator&apos;s custom commercial agreement.
                  </p>
                </section>

                <section
                  id="permitted"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 04</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PERMITTED APPLICATIONS
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-primary font-bold block mb-1">✓ COMMERCIAL PRODUCTS</span>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Use icons, textures, and brushes in production software, SaaS dashboards, and commercial merchandise.
                      </p>
                    </div>
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-primary font-bold block mb-1">✓ MODIFICATION &amp; DERIVATIVES</span>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Customize code, alter color palettes, and adapt geometry to fulfill design specifications.
                      </p>
                    </div>
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-primary font-bold block mb-1">✓ BROADCAST &amp; STREAMING</span>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Incorporate graphics in YouTube videos, Twitch overlays, film post-production, and animations.
                      </p>
                    </div>
                    <div className="border border-border dark:border-zinc-800 rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-primary font-bold block mb-1">✓ UNLIMITED RUNTIME COPIES</span>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        No limits on end-user impressions, downloads, or impressions of your finished composite works.
                      </p>
                    </div>
                  </div>
                </section>

                <section
                  id="prohibited"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 text-xs font-pixel">§ 05</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      PROHIBITED USES (NEGATIVE COVENANTS)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    To protect our community creators, the following actions constitute a material breach of license and
                    will trigger legal remediation:
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">⊗</span>
                      <span>
                        <strong>Direct Resale or Redistribution:</strong> You may not repackage, re-license, sell, or
                        host raw source files on rival stock asset platforms, torrent trackers, or subscription portals.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">⊗</span>
                      <span>
                        <strong>False Authorship Claims:</strong> You may not claim original intellectual design over
                        verbatim assets or register unaltered assets as registered trademarks.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">⊗</span>
                      <span>
                        <strong>Unauthorized Model Ingestion:</strong> Assets may not be scraped for mass automated model
                        training where explicitly prohibited in the asset manifest.
                      </span>
                    </li>
                  </ul>
                </section>

                <section
                  id="creator-rights"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 06</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      CREATOR INTELLECTUAL PROPERTY
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Artists and toolmakers retain 100% intellectual property ownership over their submissions. By listing
                    assets on Pixlape Vault, creators grant Pixlape a non-exclusive license to generate promotional
                    thumbnails, conduct integrity verification scans, and host download mirrors for community benefit.
                  </p>
                </section>

                <section
                  id="disclaimer"
                  className="scroll-mt-24 border border-black dark:border-zinc-800 rounded-lg bg-surface dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-pixel">§ 07</span>
                    <h2 className="text-lg font-pixel text-black-primary dark:text-zinc-100">
                      WARRANTY DISCLAIMER &amp; DMCA NOTICE
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    ALL ASSETS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTY OF ANY KIND,
                    EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                    OR NON-INFRINGEMENT. IN NO EVENT SHALL PIXLAPE OR ITS CURATORS BE LIABLE FOR ANY DAMAGES ARISING FROM
                    SOFTWARE EXECUTION OR FILE CORRUPTION.
                  </p>
                  <div className="p-4 rounded-md border border-border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 text-xs text-zinc-700 dark:text-zinc-300">
                    <span className="font-bold text-black-primary dark:text-zinc-100 block mb-1">
                      DMCA &amp; Takedown Protocol:
                    </span>
                    If you believe any content indexed within Pixlape Vault infringes upon your copyrighted work, please
                    dispatch a formal takedown notice with proof of ownership to{" "}
                    <a
                      href="mailto:contact@pixlape.com"
                      className="text-primary underline hover:text-primary-hover"
                    >
                      contact@pixlape.com
                    </a>{" "}
                    or via our{" "}
                    <Link href="/contact" className="text-primary underline hover:text-primary-hover">
                      Contact Gateway
                    </Link>
                    . Infringing listings will be removed within 24 hours of verification.
                  </div>
                </section>
              </>
            )}
          </article>
        </div>

        {/* ── Document Footer ─────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-border dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <span>PIXLAPE VAULT ARCHIVE // LEGAL PROTOCOL SUITE</span>
          <div className="flex items-center gap-3">
            {TABS.filter((t) => t.id !== activeTab).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabSwitch(t.id)}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                → {t.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center font-mono text-xs text-text-secondary">
          LOADING PROTOCOL...
        </div>
      }
    >
      <DocumentView />
    </Suspense>
  );
}
