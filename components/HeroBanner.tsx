import React from "react";

export default function HeroBanner() {
  return (
    <section
      className="mt-17 mx-12 rounded-md h-44 flex flex-col justify-center px-8 relative mb-4 border border-black"
      style={{ backgroundColor: "#cccccc" }}
    >
      <h1 className="text-4xl font-pixel tracking-wide text-black-secondary mb-4 hover:text-black-primary transition-all duration-150 cursor-pointer">
        ++PIXLAPE_TROVE++
      </h1>
      <p className="font-mono text-sm text-black-primary max-w-xl leading-relaxed">
        Discover and download premium digital assets — apps, tools, brushes, templates, icons, and more.
      </p>

      {/* ----------------------------------Search Bar----------------------------------------- */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-2">
        <input
          type="text"
          placeholder="Search assets..."
          className="w-auto h-9.25 px-7 rounded-md bg-surface text-black-primary text-xs font-mono outline-none border border-black-primary transition-colors"
        />
        <button className="h-9.25 px-6 bg-black-secondary text-white text-xs font-mono rounded-md border border-black hover:text-white hover:scale-95 shadow-pixel transition-all">
          SEARCH
        </button>
      </div>
    </section>
  );
}
