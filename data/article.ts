// ====================================================== Article Data =====================================================

export interface ArticleItem {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  category: string;
  likes: number;
  featured?: boolean;
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
    image: "/img/article2.svg",
    category: "SYSTEMS",
    likes: 42,
    featured: true,
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
    image: "/img/article1.svg",
    category: "DESIGN",
    likes: 29,
    featured: true,
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
    image: "/img/article3.svg",
    category: "ASSETS",
    likes: 35,
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
    image: "/img/article1.svg",
    category: "DEV",
    likes: 51,
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
    image: "/img/article2.svg",
    category: "UX",
    likes: 18,
  },
];

export function getArticleById(id: string): ArticleItem | undefined {
  return ARTICLES.find((article) => article.id === id);
}
