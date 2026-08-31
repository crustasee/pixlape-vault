"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type ChannelType = "general" | "bug" | "creator" | "request";

const CHANNELS: { id: ChannelType; label: string; icon: string; desc: string }[] = [
  { id: "general", label: "GENERAL INQUIRY", icon: "✉", desc: "Questions, feedback, or general greetings." },
  { id: "bug", label: "REPORT BUG / LINK", icon: "⚠", desc: "Broken downloads, 404s, or UI issues." },
  { id: "creator", label: "CREATOR SUBMISSION", icon: "★", desc: "Submit your tools, brushes, or templates." },
  { id: "request", label: "ASSET REQUEST", icon: "⌗", desc: "Request specific digital assets or apps." },
];

export default function ContactPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>("general");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    handle: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@pixlape.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", handle: "", subject: "", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-white text-text-primary font-mono flex flex-col">
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-full mx-auto px-6 sm:px-10 pt-17 pb-16 flex flex-col gap-5">
        
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
          <Link
            href="/"
            className="text-xs font-mono text-black-secondary hover:text-black-primary transition-colors flex items-center gap-1.5"
          >
            <span>&lt;</span> BACK TO TROVE
          </Link>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-border border border-black text-black-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
              STATUS: <strong>DISPATCH ONLINE</strong>
            </span>
            <span className="text-border">|</span>
            <span className="px-3 py-1 rounded-md bg-surface border border-border text-black-secondary">
              AVG RESPONSE: &lt; 24H
            </span>
          </div>
        </div>

        {/* Hero Banner Header */}
        <section className="bg-border border border-black rounded-md p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 text-xs font-black text-black-primary absolute top-3 right-3">
            <span>+++++[ PROTOCOL: DIRECT_TRANSMISSION ]++++++</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-pixel font-bold text-black-secondary tracking-wide">
            ++ TRANSMIT TO PIXLAPE ++
          </h1>
          <p className="border border-black rounded-sm bg-surface p-2 text-xs sm:text-sm text-text-secondary max-w-full leading-relaxed">
            Need support with digital assets, discovered a broken download link, interested in publishing your tools, or looking to collaborate? Select your transmission channel and dispatch your message below.
          </p>
        </section>

        {/* Channel Selector Pills */}
        <div className="flex flex-col gap-3">
          <span className="text-md font-black uppercase tracking-wide text-black-secondary">
            1. SELECT TRANSMISSION CHANNEL :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHANNELS.map((ch) => {
              const active = selectedChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`p-4 rounded-md border text-left flex flex-col gap-1.5 transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-black-secondary border-black text-surface scale-[1.02] shadow-sm font-bold"
                      : "bg-surface border-black text-black-primary hover:bg-border hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black">{ch.icon} {ch.label}</span>
                    {active && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black-primary text-primary rounded-xs">◉</span>}
                  </div>
                  <p className={`text-sm font-mono leading-tight ${active ? "text-border" : "text-black-secondary"}`}>
                    {ch.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Grid: Left Sidebar Info + Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          
          {/* Left Info & Channels Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-3">
            
            {/* Direct Email Card with One-Click Copy */}
            <div className="bg-border border border-black rounded-lg p-6 flex flex-col gap-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-black-primary border-b border-black pb-2">
                ✉ DIRECT DISPATCH
              </h2>
              <p className="text-xs font-mono text-text-secondary">
                Prefer using your own mail client? Copy our direct address:
              </p>
              <div className="flex items-center justify-between p-2 bg-white border border-black rounded-md">
                <span className="text-xs font-mono font-bold text-border truncate">
                  contact@pixlape.com
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1 text-xs font-black bg-border border border-black rounded-sm text-black-primary hover:opacity-85 transition-opacity cursor-pointer shrink-0 ml-2"
                >
                  {copiedEmail ? "COPIED!" : "COPY"}
                </button>
              </div>
            </div>

            {/* Quick Assistance & Resources */}
            <div className="bg-border border border-black rounded-lg p-5 flex flex-col gap-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-black-primary border-b border-black pb-2">
                ▩ QUICK CHANNELS
              </h2>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <Link
                    href="/help"
                    className="text-text-secondary hover:text-primary hover:translate-x-1 inline-block transition-transform duration-150"
                  >
                    &gt; Frequently Asked Questions (FAQ)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles"
                    className="text-text-secondary hover:text-primary hover:translate-x-1 inline-block transition-transform duration-150"
                  >
                    &gt; Guides & Vault Articles
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-primary hover:translate-x-1 inline-block transition-transform duration-150"
                  >
                    &gt; Report GitHub Issue / PR
                  </a>
                </li>
              </ul>
            </div>

            {/* Response Time SLA Pill Box */}
            <div className="bg-border border border-black rounded-lg p-5 flex flex-col gap-5 text-sm text-black-primary">
              <div className="flex items-center gap-6 text-black-primary font-black border-b border-black pb-2">
                <span>⏱</span>
                <span>DISPATCH SLA</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Messages dispatched during Mon–Fri are reviewed within 24 hours. Weekend inquiries will be processed on the next operating cycle.
              </p>
            </div>

          </aside>

          {/* Right Form Box (8 Cols) */}
          <div className="lg:col-span-8 bg-surface border border-black rounded-md p-6 sm:p-8 flex flex-col gap-7">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-pixel font-bold text-black-primary uppercase tracking-wide">
                2. COMPOSE TRANSMISSION
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-border border border-black-primary text-black-primary">
                CHANNEL: {selectedChannel.toUpperCase()}
              </span>
            </div>

            {/* Success Alert Banner */}
            {submitted && (
              <div className="p-4 rounded-md bg-primary/20 border-2 border-primary text-black-primary text-xs font-mono flex items-center gap-3 animate-in fade-in duration-200">
                <span className="text-lg">✓</span>
                <div>
                  <p className="font-bold font-pixel text-xs">TRANSMISSION RECEIVED BY THE VAULT!</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Thank you, {form.name || "creator"}. We have logged your dispatch and will reply to <strong className="text-black-primary">{form.email}</strong> shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-black-primary mb-1.5">
                    Your Name / Alias <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. PixelHacker99"
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-black bg-white rounded-md text-black-primary outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-black-primary mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="creator@domain.com"
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-black bg-white rounded-md text-black-primary outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Optional Handle / Social Handle & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-black-primary mb-1.5">
                    Discord / GitHub Handle <span className="text-text-secondary font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.handle}
                    onChange={(e) => setForm({ ...form, handle: e.target.value })}
                    placeholder="@username#0001"
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-black bg-white rounded-md text-black-primary outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-black-primary mb-1.5">
                    Subject Header
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder={`[${selectedChannel.toUpperCase()}] Quick summary...`}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-black bg-white rounded-md text-black-primary outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-mono font-bold text-black-primary">
                    Transmission Message <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-text-secondary">
                    {form.message.length} CHARACTERS
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={
                    selectedChannel === "bug"
                      ? "Please describe what asset or page has an issue, what happened, and any download link involved..."
                      : selectedChannel === "creator"
                      ? "Tell us about your asset, format (SVG/EXE/PNG/ABR), demo link, and how creators can use it..."
                      : "Describe your question or message in detail..."
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-black bg-white rounded-md text-black-primary outline-none focus:ring-1 focus:ring-primary transition-all resize-y leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setForm({ name: "", email: "", handle: "", subject: "", message: "" })}
                  className="px-5 py-2 rounded-md border border-black bg-border text-black-primary text-xs font-mono font-semibold hover:bg-pink-300 shadow-pixel hover:scale-98 active:scale-97 transition-all duration-150 cursor-pointer"
                >
                  CLEAR FORM
                </button>
                <button
                  type="submit"
                  className="px-7 py-2 rounded-md bg-black-secondary border shadow-pixel border-black text-surface text-xs font-mono font-bold hover:opacity-90 hover:scale-98 active:scale-97 transition-all duration-150 cursor-pointer"
                >
                  DISPATCH TRANSMISSION &gt;
                </button>
              </div>

            </form>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}