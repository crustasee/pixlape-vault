import React from "react";
import Image from "next/image";

interface HeroBannerProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function HeroBanner({ searchQuery = "", onSearch }: HeroBannerProps) {
  const [internalSearch, setInternalSearch] = React.useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = React.useState(searchQuery);
  const [isFocused, setIsFocused] = React.useState(false);

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setInternalSearch(searchQuery);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(internalSearch);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <section className="mt-16 mx-12 mb-3">
      {/* Main Hero Container */}
      <div className="relative overflow-hidden rounded-lg border border-border shadow-sm">
        {/* Lava Banner Background (cropped to HeroBanner dimensions) */}
        <Image
          src="/lavabanner.gif"
          alt="Hero Banner Background"
          fill
          unoptimized
          priority
          className="object-cover object-center pointer-events-none select-none opacity-50 grayscale"
        />

        {/* Subtle Dark Overlay to ensure high contrast and text readability */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: "linear-gradient(0deg, transparent 24%, #fff 25%, #fff 26%, transparent 27%, transparent 74%, #fff 75%, #fff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #fff 25%, #fff 26%, transparent 27%, transparent 74%, #fff 75%, #fff 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px"
          }}
        />

        <div className="relative px-10 py-12 md:py-16 z-10">
          {/* Header Section */}
          <div className="mb-10">
            {/* Main Title with Glitch Effect */}
            <div className="mb-4">
              <h1 className="text-5xl md:text-6xl font-pixel tracking-widest text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-3 
                hover:text-primary transition-colors duration-200 cursor-pointer">
                ++PIXLAPE_TROVE++
              </h1>
              <div className="flex items-center gap-3">
              </div>
            </div>
          </div>

          {/* Search Bar Section */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <form
              onSubmit={handleSubmit}
              className="flex gap-3 flex-1 sm:flex-none sm:w-auto group"
            >
              {/* Search Input */}
              <div className={`relative flex-1 sm:flex-none transition-all duration-300 ${
                isFocused ? "sm:w-96" : "sm:w-120"
              }`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono transition-colors duration-200 ${
                  isFocused ? "text-primary" : "text-black-tertiary"
                }`}>
                  🔍
                </div>
                <input
                  type="text"
                  value={internalSearch}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search assets..."
                  className="w-full pl-12 pr-4 py-2 rounded-md bg-surface-card text-black-primary text-sm font-mono 
                    outline-none border border-black-tertiary transition-all duration-200
                    focus:border-primary focus:shadow-[0_0_12px_rgba(0,255,0,0.2)]
                    hover:border-black-secondary placeholder:text-black-tertiary"
                  aria-label="Search digital assets"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-2 bg-black-secondary text-white text-xs font-mono font-bold rounded-md 
                  border border-black-primary transition-all duration-200
                  hover:scale-98 hover:text-primary hover:border-primary
                  active:scale-95 active:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2)]
                  shadow-pixel cursor-pointer whitespace-nowrap
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Submit search"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
