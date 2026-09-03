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
  externalUrl?: string;
}

export const ARTICLES: ArticleItem[] = [
  {
    id: "blog001",
    title: "10 Style UI/UX yang Sedang Trend di Tahun 2026",
    subtitle: "Menganalisis tren terkini dalam desain antarmuka pengguna dan pengalaman pengguna untuk tahun 2026",
    excerpt:
      "Mari kita bedah tren desain UI/UX yang paling berpengaruh di tahun 2026, lengkap dengan analisis visual dan rekomendasi implementasi praktis.",
    date: "AUG 22, 2026",
    readTime: "5 MIN READ",
    author: "PIXLape Team",
    image: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788326616/retrobanner0094.jpg",
    category: "SYSTEMS",
    likes: 42,
    featured: true,
    externalUrl: "https://pixlblog-page.pixlape.workers.dev/styleuiux/",
  },
  {
    id: "blog002",
    title: "Gaya Estetika Bootleg & Niche Internet Culture",
    subtitle: "Mendalami nuansa visualculture internet yang unik dan terkurasi",
    excerpt:
      "Mengupas tren desain 'bootleg' dan estetika niche yang berkembang di ranah internet, menawarkan perspektif visual yang autentik dan terkurasi.",
    date: "AUG 18, 2026",
    readTime: "4 MIN READ",
    author: "PIXLape Team",
    image: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788327327/Pixel_Art_8Bit_GIF_by_pixel_jeff.gif",
    category: "DESIGN",
    likes: 29,
    featured: true,
    externalUrl: "https://pixlblog-page.pixlape.workers.dev/estetikabootleg/",
  },
  {
    id: "blog003",
    title: "IntelliJ IDEA vs VS Code",
    subtitle: "Membahas perbedaan antara IntelliJ IDEA dan VS Code",
    excerpt:
      "Menganalisis kelebihan dan kekurangan IntelliJ IDEA dan VS Code untuk membantu kamu memilih editor kode yang tepat untuk kebutuhanmu.",
    date: "AUG 14, 2026",
    readTime: "3 MIN READ",
    author: "PIXLape Team",
    image: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788274873/5gagooue95h91.png",
    category: "ASSETS",
    likes: 35,
    externalUrl: "https://pixlblog-page.pixlape.workers.dev/intellijideavscode/",
  },
  {
    id: "blog004",
    title: "Sekilas tentang framework React, Next.js, dan Nuxt.js",
    subtitle: "Membandingkan fitur, performa, dan ekosistem untuk membantu kamu memilih yang tepat",
    excerpt:
      "Pelajari kelebihan, kekurangan, dan kasus penggunaan ideal dari React, Next.js, dan Nuxt.js dalam pengembangan aplikasi web modern.",
    date: "AUG 10, 2026",
    readTime: "6 MIN READ",
    author: "PIXLape Team",
    image: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788326611/progammingwall.jpg",
    category: "DEV",
    likes: 51,
    externalUrl: "https://pixlblog-page.pixlape.workers.dev/nextjs/",
  },
  {
    id: "blog005",
    title: "PATREON ? Apa itu & Bagaimana cara menghasilkan uang ",
    subtitle: "mengenal platform patreon dan bagaimana menghasilkan uang dari sana",
    excerpt:
      "mengenal platform patreon dan bagaimana menghasilkan uang dari sana",
    date: "AUG 05, 2026",
    readTime: "4 MIN READ",
    author: "Pikun-san",
    image: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788452555/patreon.webp",
    category: "UX",
    likes: 18,
    externalUrl: "https://pixlblog-page.pixlape.workers.dev/patreon/",
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
    image: data.image || '/img/article1.svg',
    category: data.category || 'DEV',
    likes: data.likes || 0,
    featured: Boolean(data.featured),
    externalUrl: data.externalUrl || 'https://pixlblog-page.pixlape.workers.dev/',
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
