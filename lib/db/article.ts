// ====================================================== Article Data =====================================================

export interface ArticleSectionContent {
  title?: string;
  paragraphs: string[];
}

export interface ArticleChecklistItem {
  label: string;
  desc: string;
}

export interface ArticleQuote {
  text: string;
  author: string;
}

export interface ArticleCodeSnippet {
  label?: string;
  command?: string;
  lang?: string;
  code: string;
}

export interface ArticleConclusion {
  title?: string;
  text: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar?: string;
  authorRole?: string;
  image: string;
  category: string;
  likes: number;
  featured?: boolean;

  // Modular detailed content fields for dynamic article pages
  leadParagraph?: string;
  sections?: ArticleSectionContent[];
  quote?: ArticleQuote;
  checklist?: {
    title?: string;
    items: ArticleChecklistItem[];
  };
  codeSnippet?: ArticleCodeSnippet;
  conclusion?: ArticleConclusion;
}

export const ARTICLES: ArticleItem[] = [
  {
    id: "1",
    title: "Optimizing Retro Workflows & Vault Storage",
    subtitle: "Architecting lightweight, high-performance digital asset archives",
    excerpt:
      "Discover how modern web technologies, modular SVG graphics, and zero-dependency components form the foundation of ultra-fast digital distribution systems.",
    date: "AUG 22, 2026",
    readTime: "5 MIN READ",
    author: "PIXLape Team",
    authorAvatar: "/img/Icontemp1.svg",
    authorRole: "Core Architecture & Systems",
    image: "/img/article2.svg",
    category: "SYSTEMS",
    likes: 42,
    featured: true,
    leadParagraph:
      "A high-performing digital asset vault demands rigorous storage optimization and minimal runtime overhead. By combining lightweight SVG assets with modular database abstraction layers, we deliver instantaneous page transitions and zero-friction downloads.",
    sections: [
      {
        title: "Structural Architecture & Modular Design",
        paragraphs: [
          "A well-structured design system separates core UI components into predictable, single-responsibility units. By using standardized token themes (such as retro monochrome surfaces, pixelated headers, and high-contrast borders), user interfaces remain clean, consistent, and instantly recognizable.",
          "When organizing digital vault archives, metadata such as bundle sizes, license types, and system requirements must be presented clearly alongside asset downloads to minimize user friction.",
        ],
      },
      {
        title: "Client-Side Caching & Zero-Latency Payloads",
        paragraphs: [
          "Delivering asset packages over HTTP requires intelligent chunking and aggressive cache-control policies. By pre-caching vector schemas and metadata on the edge, initial content loads execute in under 50ms across global distributions.",
        ],
      },
    ],
    quote: {
      text: "Simplicity is not the lack of clutter, that's a consequence of simplicity. Simplicity is somehow almost describing the purpose and essential nature of a tool.",
      author: "Vault Architecture Guidelines",
    },
    checklist: {
      title: "Essential Takeaways & Implementation Rules",
      items: [
        {
          label: "SVG Vector Pre-Scaling",
          desc: "Always define explicit aspect ratios and viewport bounds to avoid layout shifts during dynamic rendering.",
        },
        {
          label: "Absolute Asset Path Resolution",
          desc: "Enforce root-relative resource URLs (/img/...) across nested dynamic route handlers.",
        },
        {
          label: "Responsive Grid Breakdown",
          desc: "Adapt card grids dynamically across standard desktop breakpoint containers for balanced scannability.",
        },
      ],
    },
    codeSnippet: {
      label: "CLI Vault Inspection",
      command: "vault-cli inspect --article=1",
      lang: "BASH",
      code:
        "# Fetching article package metadata...\n" +
        "pixlape-vault get article --id=1 --format=json\n\n" +
        "# Status: 200 OK | Payload: 48.5KB",
    },
    conclusion: {
      title: "Conclusion",
      text:
        "Following modular document standards ensures your web application stays fast, accessible, and easily maintainable as the vault library expands.",
    },
  },
  {
    id: "2",
    title: "Designing Pixel-Perfect High Contrast Interfaces",
    subtitle: "Retro monochrome design principles for modern web applications",
    excerpt:
      "Exploring the aesthetic balance between high contrast borders, pixel fonts, and responsive grid layouts in modern developer tools.",
    date: "AUG 18, 2026",
    readTime: "4 MIN READ",
    author: "Brandon Herera",
    authorAvatar: "/img/Icontemp2.svg",
    authorRole: "Lead Visual & Interface Designer",
    image: "/img/article1.svg",
    category: "DESIGN",
    likes: 29,
    featured: true,
    leadParagraph:
      "Monochrome and high-contrast design is far more than a nostalgic throwback—it is a functional discipline that emphasizes hierarchy, sharp typography, and instantaneous visual comprehension for technical tools.",
    sections: [
      {
        title: "Pixel Grids and Optical Alignment",
        paragraphs: [
          "Sub-pixel anti-aliasing can often blur hard edges on low-density displays. When designing for the pixel aesthetic, aligning icons and stroke boundaries to whole pixel units ensures crisp rendering across all screen resolutions.",
          "Pairing bold monospace typefaces with pixel headers produces an authentic terminal aesthetic without sacrificing legibility during extended reading sessions.",
        ],
      },
      {
        title: "Palette Constraints as Creative Catalysts",
        paragraphs: [
          "Limiting color selections to stark black (#000), muted surface tones, and vibrant cyber accents (such as neon green and magenta) eliminates visual noise and forces information hierarchy to be conveyed through typography and border density.",
        ],
      },
    ],
    quote: {
      text: "Constraints in interface design eliminate ambiguity. When color is scarce, every accent hue carries profound meaning.",
      author: "Brandon Herera — Retro UI Manifesto",
    },
    checklist: {
      title: "Pixel Design Best Practices",
      items: [
        {
          label: "Whole-Number Pixel Dimensions",
          desc: "Never use fractional rem or pixel values for icon containers and border strokes.",
        },
        {
          label: "High-Contrast Interactive States",
          desc: "Employ distinct hover shifts, thick solid borders, and tactile click offsets for buttons.",
        },
        {
          label: "Font Pairing Hierarchy",
          desc: "Reserve Press Start 2P for primary headings and JetBrains Mono for readable body content.",
        },
      ],
    },
    codeSnippet: {
      label: "Pixel Perfect Border Utility",
      command: "tailwind.config.ts",
      lang: "TYPESCRIPT",
      code:
        "// High-contrast pixel border box configuration\n" +
        "boxShadow: {\n" +
        "  'pixel': '2px 2px 0px 0px rgba(0, 0, 0, 1)',\n" +
        "  'pixel-hover': '1px 1px 0px 0px rgba(0, 0, 0, 1)'\n" +
        "}",
    },
    conclusion: {
      title: "Design Summary",
      text:
        "Embracing high contrast retro aesthetics allows developer and creator platforms to stand out while delivering superior usability and visual clarity.",
    },
  },
  {
    id: "3",
    title: "Building Zero-Latency SVG Vector Icon Packs",
    subtitle: "Performance metrics and vector optimization workflows",
    excerpt:
      "Learn how to compress SVG assets without quality degradation using custom build pipelines and inline styling tokens.",
    date: "AUG 14, 2026",
    readTime: "3 MIN READ",
    author: "PIXLape Team",
    authorAvatar: "/img/Icontemp1.svg",
    authorRole: "Asset Engineering",
    image: "/img/article3.svg",
    category: "ASSETS",
    likes: 35,
    leadParagraph:
      "Vector graphics are the backbone of modern responsive interfaces, but unoptimized SVGs can bloat DOM trees and degrade render performance. Here is our end-to-end compression and bundling workflow.",
    sections: [
      {
        title: "Automated Path Normalization and SVGO Pipelines",
        paragraphs: [
          "Raw vectors exported from vector software often contain redundant metadata, invisible layers, and high-precision floating point coordinates. Applying customized SVGO pipelines strips unnecessary payload while preserving path accuracy.",
          "By stripping hardcoded dimensions and utilizing flexible viewBox properties, SVG icons scale effortlessly from tiny 16px badges to full-screen hero graphics.",
        ],
      },
    ],
    quote: {
      text: "An optimized SVG should carry no more bytes than the mathematical coordinates necessary to draw the curve.",
      author: "PIXLape Asset Standard v2",
    },
    checklist: {
      title: "Vector Packaging Protocol",
      items: [
        {
          label: "Coordinate Precision Limiting",
          desc: "Limit float precision to 2 decimal places to shave up to 40% off file sizes.",
        },
        {
          label: "CurrentColor Inheritance",
          desc: "Replace hardcoded hex fills with currentColor for dynamic CSS theme switching.",
        },
      ],
    },
    codeSnippet: {
      label: "SVG Optimization Command",
      command: "svgo --config=svgo.config.js -f ./public/icons",
      lang: "BASH",
      code:
        "# Batch optimizing 450+ SVG assets...\n" +
        "Reduced total asset weight: 1.24 MB -> 312 KB (-74.8%)\n" +
        "✓ All paths validated for 16x16 grid alignment.",
    },
    conclusion: {
      title: "Takeaway",
      text:
        "Investing in automated vector optimization pipelines yields immediate gains in initial page load speed and runtime memory usage.",
    },
  },
  {
    id: "4",
    title: "C++ WebAssembly Bindings for Browser Toolkits",
    subtitle: "Compiling native performance utilities for web runtimes",
    excerpt:
      "A deep dive into compiling native C++ graphics tools to WebAssembly modules for browser-based asset editing.",
    date: "AUG 10, 2026",
    readTime: "6 MIN READ",
    author: "Alex Mercer",
    authorAvatar: "/img/Icontemp2.svg",
    authorRole: "Native & WASM Systems Specialist",
    image: "/img/article1.svg",
    category: "DEV",
    likes: 51,
    leadParagraph:
      "WebAssembly allows computationally demanding image transformations and dithering shaders to run in the client browser at near-native speeds without relying on server-side rendering farms.",
    sections: [
      {
        title: "Emscripten Toolchain and Bindings Architecture",
        paragraphs: [
          "By leveraging Embind and modern C++20 features, native image processing filters (such as Floyd-Steinberg dithering and Bayer matrices) can be directly exposed to JavaScript typed arrays.",
          "Zero-copy memory sharing using WebAssembly.Memory allows large image buffers to be processed in real time at 60 frames per second inside standard browser canvases.",
        ],
      },
    ],
    quote: {
      text: "WebAssembly brings desktop-grade computing power into the humble web browser sandbox.",
      author: "Alex Mercer",
    },
    checklist: {
      title: "WASM Deployment Steps",
      items: [
        {
          label: "SharedArrayBuffer Setup",
          desc: "Ensure appropriate cross-origin isolation headers (COOP/COEP) are configured on your host.",
        },
        {
          label: "Memory Growth Constraints",
          desc: "Pre-allocate initial WASM memory heaps to avoid runtime allocations during heavy filters.",
        },
      ],
    },
    codeSnippet: {
      label: "Emscripten Compilation",
      command: "emcc -O3 -std=c++20 --bind src/filter.cpp -o public/wasm/filter.js",
      lang: "BASH",
      code:
        "# Compiling optimized WASM module...\n" +
        "Generated: filter.wasm (24.2 KB) + filter.js glue code\n" +
        "✓ Ready for direct import in Next.js worker threads.",
    },
    conclusion: {
      title: "Summary",
      text:
        "WebAssembly bridging unlocks powerful desktop-like creative capabilities directly in web applications.",
    },
  },
  {
    id: "5",
    title: "Monochrome Color Palettes & User Experience",
    subtitle: "Reducing visual cognitive load with minimalist retro themes",
    excerpt:
      "Why retro monochrome palettes improve focus and readability for complex technical documentation and asset management.",
    date: "AUG 05, 2026",
    readTime: "4 MIN READ",
    author: "Brandon Herera",
    authorAvatar: "/img/Icontemp1.svg",
    authorRole: "Lead Visual & Interface Designer",
    image: "/img/article2.svg",
    category: "UX",
    likes: 18,
    leadParagraph:
      "In a landscape dominated by hyper-saturated interfaces and visual clutter, monochrome design creates a calm, focused environment where content and usability take center stage.",
    sections: [
      {
        title: "Visual Hierarchy Through Contrast and Weight",
        paragraphs: [
          "When color is removed as the primary differentiator, typography weight, border density, and spatial grouping naturally guide the user's focus through the interface.",
          "Monochrome layouts also offer superior accessibility by default, ensuring effortless legibility across varying lighting conditions and screen types.",
        ],
      },
    ],
    quote: {
      text: "Good design is as little design as possible. Monochrome brings pure function back to the forefront.",
      author: "Dieter Rams Design Principles",
    },
    checklist: {
      title: "Monochrome UX Rules",
      items: [
        {
          label: "Maintain WCAG AAA Ratios",
          desc: "Ensure contrast ratios of at least 7:1 between foreground text and surface backgrounds.",
        },
        {
          label: "Tactile Hover Feedback",
          desc: "Provide distinct inverted background or border color shifts on clickable elements.",
        },
      ],
    },
    codeSnippet: {
      label: "Theme Token Configuration",
      command: "globals.css",
      lang: "CSS",
      code:
        ":root {\n" +
        "  --surface: #e6e6e6;\n" +
        "  --black-primary: #121212;\n" +
        "  --primary: #9df871;\n" +
        "  --border: #cccccc;\n" +
        "}",
    },
    conclusion: {
      title: "Final Thought",
      text:
        "Minimalist retro monochrome styling fosters productivity, decreases cognitive friction, and creates timeless digital tools.",
    },
  },
];

// ────────────────────────────────────────── Synchronous Helpers & Reactive Store ──────────────────────────────────────────

export let memoryArticles: ArticleItem[] = [...ARTICLES];

export type ArticleListener = () => void;
export const articleListeners: Set<ArticleListener> = new Set();

function notifyArticleListeners() {
  articleListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore errors
    }
  });
}

/**
 * Add a new article to in-memory store
 */
export function addArticleToStore(data: Partial<ArticleItem> & { title: string }): ArticleItem {
  const nextId = String(memoryArticles.length + 1);
  const id = data.id && data.id.trim() !== '' ? data.id.trim() : nextId;

  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  const newArticle: ArticleItem = {
    id,
    title: data.title,
    subtitle: data.subtitle || '',
    excerpt: data.excerpt || 'Technical article documentation from the PIXLApe Vault library.',
    date: data.date || dateString,
    readTime: data.readTime || '4 MIN READ',
    author: data.author || 'PIXLape Team',
    authorAvatar: data.authorAvatar || '/img/Icontemp1.svg',
    authorRole: data.authorRole || 'Contributor & Engineer',
    image: data.image || '/img/article1.svg',
    category: data.category || 'DEV',
    likes: data.likes || 0,
    featured: Boolean(data.featured),
    leadParagraph: data.leadParagraph || data.excerpt,
    sections: data.sections || [
      {
        title: 'Overview & Implementation Details',
        paragraphs: [
          data.excerpt || 'Technical overview of the project component and architecture.',
        ],
      },
    ],
    quote: data.quote,
    checklist: data.checklist,
    codeSnippet: data.codeSnippet,
    conclusion: data.conclusion || {
      title: 'Conclusion',
      text: 'Summary of the technical implementation and design decisions.',
    },
  };

  memoryArticles = [newArticle, ...memoryArticles.filter((a) => a.id !== id)];
  notifyArticleListeners();
  return newArticle;
}

/**
 * Update an existing article in the in-memory store
 */
export function updateArticleInStore(id: string, updates: Partial<ArticleItem>): ArticleItem | null {
  const index = memoryArticles.findIndex((a) => a.id === id);

  if (index === -1) {
    return addArticleToStore({
      ...updates,
      id,
      title: updates.title || `Article #${id}`,
    });
  }

  const existing = memoryArticles[index];
  const updated: ArticleItem = {
    ...existing,
    ...updates,
    leadParagraph: updates.leadParagraph || existing.leadParagraph || updates.excerpt || existing.excerpt,
  };

  memoryArticles[index] = updated;
  notifyArticleListeners();
  return updated;
}

/**
 * Delete an article from in-memory store
 */
export function deleteArticleFromStore(id: string): boolean {
  const initialLength = memoryArticles.length;
  memoryArticles = memoryArticles.filter((a) => a.id !== id);
  const removed = memoryArticles.length < initialLength;
  if (removed) {
    notifyArticleListeners();
  }
  return removed;
}

/**
 * Toggle featured state for an article
 */
export function toggleArticleFeatured(id: string): boolean {
  const index = memoryArticles.findIndex((a) => a.id === id);
  if (index === -1) return false;

  memoryArticles[index] = {
    ...memoryArticles[index],
    featured: !memoryArticles[index].featured,
  };
  notifyArticleListeners();
  return Boolean(memoryArticles[index].featured);
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): ArticleItem | undefined {
  if (!id) return memoryArticles[0] || ARTICLES[0];
  return (
    memoryArticles.find((article) => article.id === id) ||
    ARTICLES.find((article) => article.id === id) ||
    memoryArticles[0] ||
    ARTICLES[0]
  );
}

/**
 * Get adjacent articles for prev/next navigation
 */
export function getAdjacentArticles(id: string): {
  prev: ArticleItem | null;
  next: ArticleItem | null;
} {
  const list = memoryArticles.length > 0 ? memoryArticles : ARTICLES;
  const index = list.findIndex((article) => article.id === id);
  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? list[index - 1] : null;
  const next = index < list.length - 1 ? list[index + 1] : null;

  return { prev, next };
}



