"use client";

import React, { useState } from "react";

/* ─── Mock Markdown Content Data ─────────────────────────────────────────── */
const MOCK_README_MARKDOWN = `# PIXLape Vault Asset Package v1.4.2

> **[!NOTE]** Tested and optimized for high performance workflows. Compatible with Windows 10/11, macOS Sonoma, and Linux x64.

## ⚡ Key Features & Highlights

- [x] **Zero-Latency Rendering**: Ultra-fast asset processing engine built with C++ bindings.
- [x] **Custom Workspace Presets**: Save and load custom configurations on the fly.
- [x] **Lossless Compression**: Built-in SVG and WebP optimizer with customizable quality thresholds.
- [x] **Batch Processing Support**: Process multiple files simultaneously with thread-safe workers.
- [ ] **Cloud Workspace Sync**: *Scheduled for v1.5.0 update release.*

## 🛠️ Quick Start & Installation

Execute the command line snippet below to install and activate the vault asset package:

\`\`\`bash
# Install package via PIXLape CLI runner
pixlape-cli install --package=pixel-vault-core --version=1.4.2

# Run health diagnostics
pixlape-cli test --all --verbose
\`\`\`

## 📊 Technical Specifications

| Property | Details & Metrics |
| :--- | :--- |
| **Engine Version** | v1.4.2-stable (build #8820) |
| **License Type** | MIT / Royalty-Free Commercial Use |
| **File Footprint** | ~48.5 MB compressed (.zip) |
| **Memory Target** | < 120 MB RAM operational memory |
| **Architecture** | Native x86_64 / ARM64 Universal Binary |
| **Security Hash** | \`sha256: 8f4a9b2c7e...3d11e9a\` |
`;

const MOCK_REQUIREMENTS_MARKDOWN = `# System & Compatibility Requirements

> **[!IMPORTANT]** Ensure your hardware drivers and environment meet the minimum threshold before installation.

### 💻 Minimum Hardware
- **Processor**: Dual-Core 2.0 GHz or higher (Intel/AMD/Apple Silicon)
- **RAM**: 4 GB RAM (8 GB Recommended for 4K canvas rendering)
- **Disk Space**: 500 MB minimum available NVMe/SSD storage
- **Display**: 1280x720 minimum screen resolution

### 🌐 Software Dependencies
- **Windows**: Windows 10 / 11 (64-bit) with Visual C++ Redistributable 2022
- **macOS**: macOS 12.0 Monterey or newer (Universal Binary)
- **Linux**: Ubuntu 22.04 LTS / Arch Linux (glibc 2.35+)
`;

const MOCK_CHANGELOG_MARKDOWN = `# Version History & Release Notes

### 🚀 v1.4.2 (Latest Release) — 2026-08-15
- **Fixed**: SVG path rendering glitches under high-DPI scaling modes.
- **Improved**: Accelerated memory cleanup on tab disposal.
- **Added**: Full support for custom theme tokens and retro typography.

### 📦 v1.4.0 — 2026-07-02
- Initial release of the restructured Vault Asset System.
- Introduced dark mode retro surface aesthetics and fast search indexing.
`;

type TabType = "readme" | "requirements" | "changelog";
type ViewMode = "formatted" | "raw";

interface MarkdownDescriptionProps {
  description?: string;
  requirements?: string[];
  title?: string;
}

export default function MarkdownDescription({ description, requirements, title }: MarkdownDescriptionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("readme");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Get active markdown string
  const getCurrentMarkdown = () => {
    switch (activeTab) {
      case "requirements":
        return requirements && requirements.length > 0
          ? `# System & Compatibility Requirements\n\n${requirements.map((req) => `- ${req}`).join("\n")}`
          : MOCK_REQUIREMENTS_MARKDOWN;
      case "changelog":
        return MOCK_CHANGELOG_MARKDOWN;
      case "readme":
      default:
        return description
          ? `# ${title || "Vault Asset Package"}\n\n${description}\n\n${MOCK_README_MARKDOWN}`
          : MOCK_README_MARKDOWN;
    }
  };

  const currentMarkdown = getCurrentMarkdown();

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="flex flex-col border border-black rounded-md overflow-hidden bg-surface shadow-xs font-mono">
      {/* ── =======================================Toolbar / Header Bar ========================================= ── */}
      <div className="flex flex-wrap items-center justify-between border-black bg-border px-2 py-2 text-white">
        {/* ........................................... Tabs ............................................*/}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("readme")}
            className={`px-5 py-1 text-xs font-black rounded-t-sm transition-all duration-150 cursor-pointer flex items-center gap-2 ${
              activeTab === "readme"
                ? "bg-surface text-black-primary rounded-sm"
                : "bg-black-secondary/40 text-white hover:bg-primary hover:text-black-primary"
            }`}
          >
            <span>▷</span> Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requirements")}
            className={`px-3 py-1 text-xs font-black rounded-t-sm transition-all duration-150 cursor-pointer flex items-center gap-2 ${
              activeTab === "requirements"
                ? "bg-surface text-black-primary rounded-sm"
                : "bg-black-secondary/40 text-white hover:bg-primary hover:text-black-primary"
            }`}
          >
            <span>▷</span> Requirements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("changelog")}
            className={`px-3 py-1 text-xs font-black rounded-sm transition-all duration-150 cursor-pointer flex items-center gap-3 ${
              activeTab === "changelog"
                ? "bg-surface text-black-primary rounded-lg"
                : "bg-black-secondary/40 text-white hover:bg-primary hover:text-black-primary"
            }`}
          >
            <span>▷</span> Changelog
          </button>
        </div>

        {/* ==========================================View Mode & Action Controls========================================= */}
        <div className="flex items-center gap-2">
          {/* .............................................Formatted vs Raw Toggle............................................ */}
          <div className="flex items-center bg-border border border-black-primary rounded-lg p-0.5 text-xs ">
            <button
              type="button"
              onClick={() => setViewMode("formatted")}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "formatted"
                  ? "bg-black-secondary border border-black-primary text-white font-bold"
                  : "text-black-secondary hover:text-black-primary"
              }`}
            >
            Formatted
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === "raw"
                  ? "bg-black-secondary border border-black-primary text-white font-bold"
                  : "text-black-secondary hover:text-black-primary"
              }`}
            >
            Formating
            </button>
          </div>

          {/* ....................................Copy MD button.................................... */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="px-2.5 py-1 text-xs rounded-lg bg-border border border-black-primary hover:border-black-secondary hover:text-black-primary text-black-secondary transition-all cursor-pointer flex items-center gap-1"
            title="Copy Raw Markdown"
          >
            {copied ? (
              <span className="text-black-primary font-bold">✓ Copied!</span>
            ) : (
              <span>COPY</span>
            )}
          </button>
        </div>
      </div>

      {/* ──====================================================================================  Main Markdown View Container  ==================================================================================== ── */}
      <div className="p-6 bg-surface min-h-95">
        {viewMode === "raw" ? (
          /* ....................................Raw Markdown Editor Code Display.............................. */
          <div className="bg-border text-black-primary p-6 rounded-sm border border-black font-mono text-xs overflow-x-auto leading-relaxed relative">
            <div className="absolute top-2 right-2 text-[10px] text-black-secondary uppercase tracking-widest px-2 py-0.5 bg-surface rounded-md">
              RAW MARKDOWN SOURCE
            </div>
            <pre className="whitespace-pre-wrap font-mono">{currentMarkdown}</pre>
          </div>
        ) : (
          /* ............................................................................Rendered Formatted Markdown View ............................................................................ */
          <div className="flex flex-col gap-6 text-text-primary text-sm leading-relaxed">
            {activeTab === "readme" && (
              <>
                {/* ......................................................................................Heading 1.............................................................................................................................. */}
                <div className="border-b-2 border-black pb-3 flex items-center justify-between">
                  <h1 className="text-xl font-pixel text-black-primary flex items-center gap-2">
                    <span className="text-black-secondary font-bold">#</span> PIXLape Vault Asset Package
                  </h1>
                  <span className="px-3 py-1.5 text-xs font-mono font-bold bg-black-secondary text-border border border-black rounded-lg">
                    v1.4.2-STABLE
                  </span>
                </div>

                {/* ...........................................................................................Callout Note Box................................................................................................................................................... */}
                <div className="p-4 bg-white border-l-4 border-black-primary rounded-md text-xs font-mono text-black-primary flex items-start gap-4 border border-border">
                  <span className="text-base leading-none">💡</span>
                  <div>
                    <strong className="font-bold text-md text-black uppercase tracking-wide block mb-2">
                      [!NOTE] Operational Standard
                    </strong>
                    Tested and optimized for high performance workflows. Compatible with Windows 10/11, macOS Sonoma, and Linux x64.
                  </div>
                </div>

                {/* ...........................................................................................Heading 2 & Checkbox Feature List................................................................................................................................................... */}
                <div className="flex flex-col gap-3 pt-2">
                  <h2 className="text-base font-pixel text-black-primary flex items-center gap-2 border-b border-border pb-1">
                    <span className="text-black-secondary font-bold">##</span> ⚡ Key Features & Highlights
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white border border-border rounded-sm flex items-start gap-2.5 hover:border-black transition-colors">
                      <span className="text-primary font-bold text-base leading-none">✔</span>
                      <div className="text-xs">
                        <strong className="font-mono text-black-primary block">Zero-Latency Rendering</strong>
                        Ultra-fast asset processing engine built with C++ bindings.
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-border rounded-sm flex items-start gap-2.5 hover:border-black transition-colors">
                      <span className="text-primary font-bold text-base leading-none">✔</span>
                      <div className="text-xs">
                        <strong className="font-mono text-black-primary block">Custom Presets</strong>
                        Save and load custom configurations on the fly.
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-border rounded-sm flex items-start gap-2.5 hover:border-black transition-colors">
                      <span className="text-primary font-bold text-base leading-none">✔</span>
                      <div className="text-xs">
                        <strong className="font-mono text-black-primary block">Lossless Compression</strong>
                        Built-in SVG and WebP optimizer with threshold controls.
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-border rounded-sm flex items-start gap-2.5 hover:border-black transition-colors opacity-75">
                      <span className="text-black-secondary font-bold text-base leading-none">⏳</span>
                      <div className="text-xs">
                        <strong className="font-mono text-black-secondary block">Cloud Workspace Sync</strong>
                        Scheduled for upcoming v1.5.0 update release.
                      </div>
                    </div>
                  </div>
                </div>

                {/* ...........................................................................................Heading 2 & Terminal Code Snippet................................................................................................................................................... */}
                <div className="flex flex-col gap-3 pt-2">
                  <h2 className="text-lg font-black text-black-primary flex items-center gap-2 border-b border-border pb-1">
                    <span className="text-black-secondary font-bold">##</span> 🛠️ Quick Start & Installation
                  </h2>

                  <div className="rounded-sm border border-black bg-black-primary overflow-hidden">
                    <div className="bg-black px-4 py-1.5 flex items-center justify-between border-b border-black text-xs text-[#aaaaaa]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                        <span className="ml-2 font-mono text-border">terminal.sh</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            "pixlape-cli install --package=pixel-vault-core --version=1.4.2"
                          )
                        }
                        className="text-[10px] font-mono px-2 py-0.5 bg-black hover:bg-primary hover:text-black-primary text-white rounded-xs transition-colors cursor-pointer"
                      >
                        {codeCopied ? "✓ Copied" : "Copy Code"}
                      </button>
                    </div>
                    <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto">
                      <code>
                        <span className="text-muted"># Install package via PIXLape CLI runner</span>{"\n"}
                        <span className="text-white">pixlape-cli</span> install --package=pixel-vault-core --version=1.4.2{"\n\n"}
                        <span className="text-muted"># Run health diagnostics</span>{"\n"}
                        <span className="text-white">pixlape-cli</span> test --all --verbose
                      </code>
                    </pre>
                  </div>
                </div>

                {/* ............................................Heading 2 & Specifications Table....................................................................................................................................... */}
                <div className="flex flex-col gap-3 pt-2">
                  <h2 className="text-lg font-black text-black-primary flex items-center gap-2 border-b border-border pb-1">
                    <span className="text-black-secondary font-bold">##</span> 📊 Technical Specifications
                  </h2>

                  <div className="border border-black rounded-sm overflow-hidden">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-black-secondary/60 text-white border-black">
                          <th className="p-2.5 w-1/3 border-r border-black font-black uppercase tracking-wide">Property</th>
                          <th className="p-2.5 font-black uppercase tracking-wide">Details & Metrics</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-white">
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="p-2.5 font-bold text-black-primary border-r border-border">Engine Version</td>
                          <td className="p-2.5 text-text-secondary">v1.4.2-stable (build #8820)</td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="p-2.5 font-bold text-black-primary border-r border-border">License Type</td>
                          <td className="p-2.5 text-text-secondary">MIT / Royalty-Free Commercial Use</td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="p-2.5 font-bold text-black-primary border-r border-border">File Size</td>
                          <td className="p-2.5 text-text-secondary">~48.5 MB compressed (.zip bundle)</td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="p-2.5 font-bold text-black-primary border-r border-border">Memory Target</td>
                          <td className="p-2.5 text-text-secondary">&lt; 120 MB RAM operational memory</td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="p-2.5 font-bold text-black-primary border-r border-border">Architecture</td>
                          <td className="p-2.5 text-text-secondary">Native x86_64 / ARM64 Universal Binary</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "requirements" && (
              <>
                <div className="border-black flex items-center justify-between">
                  <h1 className="text-lg font-pixel text-black-primary flex items-center gap-4">
                    <span className="text-black-secondary font-bold">#</span> System & Compatibility Requirements
                  </h1>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-sm text-xs font-mono text-black-primary flex items-start gap-4 border">
                  <span className="text-base leading-none">⚠️</span>
                  <div>
                    <strong className="font-bold text-black uppercase tracking-wide block mb-0.5">
                      [!IMPORTANT] Hardware Thresholds
                    </strong>
                    Ensure your system drivers and graphics accelerator meet the minimum hardware configuration prior to running full resolution asset renders.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  <div className="p-4 bg-white border border-black rounded-sm flex flex-col gap-3">
                    <h3 className="font-black text-xs text-black-primary border-b border-border pb-2 uppercase tracking-wide flex items-center gap-2">
                      <span>💻</span> Hardware Requirements
                    </h3>
                    <ul className="flex flex-col gap-2 text-xs text-text-secondary">
                      <li className="flex justify-between border-b border-dotted border-border pb-1">
                        <span className="font-bold text-black-primary">Processor:</span>
                        <span>Dual-Core 2.0 GHz+</span>
                      </li>
                      <li className="flex justify-between border-b border-dotted border-border pb-1">
                        <span className="font-bold text-black-primary">System RAM:</span>
                        <span>4 GB (8 GB Recommended)</span>
                      </li>
                      <li className="flex justify-between border-b border-dotted border-border pb-1">
                        <span className="font-bold text-black-primary">Disk Storage:</span>
                        <span>500 MB free SSD space</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-bold text-black-primary">Display:</span>
                        <span>1280x720 resolution</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white border border-black rounded-sm flex flex-col gap-3">
                    <h3 className="font-black text-xs text-black-primary border-b border-border pb-2 uppercase tracking-wide flex items-center gap-2">
                      <span>🌐</span> Platform OS Compatibility
                    </h3>
                    <ul className="flex flex-col gap-2 text-xs text-text-secondary">
                      <li className="flex items-center gap-2 border-b border-dotted border-border pb-1">
                        <span className="text-primary font-bold">✓</span>
                        <span className="font-bold text-black-primary">Windows:</span>
                        <span>Win 10/11 (64-bit)</span>
                      </li>
                      <li className="flex items-center gap-2 border-b border-dotted border-border pb-1">
                        <span className="text-primary font-bold">✓</span>
                        <span className="font-bold text-black-primary">macOS:</span>
                        <span>12.0 Monterey+ (M1/M2/Intel)</span>
                      </li>
                      <li className="flex items-center gap-2 border-b border-dotted border-border pb-1">
                        <span className="text-primary font-bold">✓</span>
                        <span className="font-bold text-black-primary">Linux:</span>
                        <span>Ubuntu 22.04 LTS / Arch</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary font-bold">✓</span>
                        <span className="font-bold text-black-primary">Web Runtime:</span>
                        <span>Chrome / Firefox / Safari</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {activeTab === "changelog" && (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-black text-black-primary flex items-center gap-2">
                    <span className="text-black-secondary font-bold">#</span> Version History & Release Notes
                  </h1>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="p-3 bg-white border border-black rounded-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="font-black text-sm text-black-primary">▣ v1.4.2 (Latest Build)</span>
                      <span className="text-xs text-black-secondary font-mono">Released: Aug 15, 2026</span>
                    </div>
                    <ul className="flex flex-col gap-1.5 text-xs text-text-primary pl-2 pt-1">
                      <li>• <strong className="text-black-primary">Fixed:</strong> SVG path rendering glitches under high-DPI scaling modes.</li>
                      <li>• <strong className="text-black-primary">Improved:</strong> Accelerated memory cleanup on component disposal.</li>
                      <li>• <strong className="text-black-primary">Added:</strong> Full support for custom theme tokens and retro typography.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white border border-black rounded-sm flex flex-col gap-2 opacity-85">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="font-black text-sm text-black-primary">▣ v1.4.0 (Initial Major Release)</span>
                      <span className="text-xs text-black-secondary font-mono">Released: Jul 02, 2026</span>
                    </div>
                    <ul className="flex flex-col gap-1.5 text-xs text-text-primary pl-2 pt-1">
                      <li>• Initial release of the restructured Vault Asset System.</li>
                      <li>• Introduced dark mode retro surface aesthetics and fast search indexing.</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Metadata bar ── */}
      <div className="bg-white border-t border-black px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-black-secondary">
        <div className="flex items-center gap-4">
          <span>FORMAT: MARKDOWN (.MD)</span>
          <span>•</span>
          <span>LAST UPDATED: 2026-08-15</span>
        </div>
        <div className="flex items-center gap-4 font-black text-border">
          <span>PIXLAPE VAULT VERIFIED</span>
          <span className="text-green-600 font-bold">✓</span>
        </div>
      </div>
    </div>
  );
}
