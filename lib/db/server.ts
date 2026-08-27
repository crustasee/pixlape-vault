import "server-only";
import { prisma, isDatabaseConfigured } from "./prisma";
import { CARDS, CardDetail, CardCategory, BadgeVariant } from "./card";
import {
  ARTICLES,
  ArticleItem,
  ArticleSectionContent,
  ArticleQuote,
  ArticleChecklistItem,
  ArticleCodeSnippet,
  ArticleConclusion,
} from "./article";
import { TEAM_MEMBERS, TeamMember } from "./team";
import type {
  DigitalAsset,
  Article,
  TeamMember as PrismaTeamMember,
  BadgeVariant as PrismaBadgeVariant,
  CardCategory as PrismaCardCategory,
  Prisma,
} from "@/generated/prisma/client";

// ────────────────────────────────────────── Digital Assets Server Service ──────────────────────────────────────────

/**
 * Maps a Prisma DigitalAsset record to a frontend CardDetail object
 */
export function mapPrismaAssetToCardDetail(
  asset: DigitalAsset | (Omit<DigitalAsset, "createdAt" | "updatedAt"> & {
    createdAt?: Date | string;
    updatedAt?: Date | string;
  })
): CardDetail {
  return {
    id: asset.id,
    title: asset.title,
    thumbnail: asset.thumbnail,
    banner: asset.banner,
    icon: asset.icon,
    badge: (typeof asset.badge === "string" ? asset.badge.toLowerCase() : "free") as BadgeVariant,
    categories: (asset.categories || []).map((cat: string) => {
      if (cat === "ART_FOR_SELL") return "ART FOR SELL";
      return cat as CardCategory;
    }),
    description: asset.description,
    requirements: asset.requirements || [],
    downloadUrl: asset.downloadUrl,
    donateUrl: asset.donateUrl || undefined,
    version: asset.version || undefined,
    fileSize: asset.fileSize || undefined,
    fileType: asset.fileType || undefined,
    license: asset.license || undefined,
    author: asset.author || undefined,
    checksum: asset.checksum || undefined,
    features: asset.features || [],
    specs: (asset.specs as Record<string, string>) || undefined,
    changelog: asset.changelog || undefined,
    updatedAt: asset.updatedAt ? new Date(asset.updatedAt).toISOString().split("T")[0] : undefined,
  };
}

/**
 * Fetches all digital assets from the database with in-memory fallback
 */
export async function fetchCardsFromDb(options?: {
  category?: string;
  badge?: BadgeVariant;
  limit?: number;
}): Promise<CardDetail[]> {
  try {
    if (!isDatabaseConfigured()) {
      return filterStaticCards(options);
    }

    const whereClause: Prisma.DigitalAssetWhereInput = {};

    if (options?.badge) {
      whereClause.badge = options.badge.toUpperCase() as PrismaBadgeVariant;
    }

    if (options?.category && options.category !== "ALL" && options.category !== "ALL ASSETS") {
      const normalizedCat = (
        options.category === "ART FOR SELL"
          ? "ART_FOR_SELL"
          : options.category.toUpperCase().replace(/\s+/g, "_")
      ) as PrismaCardCategory;
      whereClause.categories = {
        has: normalizedCat,
      };
    }

    const assets = await prisma.digitalAsset.findMany({
      where: whereClause,
      take: options?.limit,
      orderBy: { createdAt: "desc" },
    });

    if (!assets || assets.length === 0) {
      return filterStaticCards(options);
    }

    return assets.map(mapPrismaAssetToCardDetail);
  } catch (error) {
    console.warn("⚠️ Database query failed in fetchCardsFromDb, falling back to static CARDS:", error);
    return filterStaticCards(options);
  }
}

/**
 * Fetches a single digital asset by ID with fallback
 */
export async function fetchCardByIdFromDb(id: string): Promise<CardDetail | undefined> {
  try {
    if (!isDatabaseConfigured() || !id) {
      return getCardById(id);
    }

    const normalizedId = id.toLowerCase().startsWith("card-") ? id : `card-${id}`;
    const asset = await prisma.digitalAsset.findFirst({
      where: {
        OR: [{ id: id }, { id: normalizedId }],
      },
    });

    if (!asset) {
      return getCardById(id);
    }

    return mapPrismaAssetToCardDetail(asset);
  } catch (error) {
    console.warn(`⚠️ Database query failed for asset ID ${id}, falling back to static CARDS:`, error);
    return getCardById(id);
  }
}

function filterStaticCards(options?: {
  category?: string;
  badge?: BadgeVariant;
  limit?: number;
}): CardDetail[] {
  let result = [...CARDS];

  if (options?.badge) {
    result = result.filter((c) => c.badge === options.badge);
  }

  if (options?.category && options.category !== "ALL" && options.category !== "ALL ASSETS") {
    result = result.filter((c) =>
      c.categories.some(
        (cat) =>
          cat.toUpperCase() === options.category?.toUpperCase() ||
          cat.toUpperCase().replace(/\s+/g, "_") ===
            options.category?.toUpperCase().replace(/\s+/g, "_")
      )
    );
  }

  if (options?.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
}

function getCardById(id: string): CardDetail | undefined {
  if (!id) return CARDS[0];
  const normalizedId = id.toLowerCase().startsWith("card-") ? id : `card-${id}`;
  return (
    CARDS.find((c) => c.id === id || c.id === normalizedId) ||
    CARDS.find((c) => c.id.endsWith(id)) ||
    CARDS[0]
  );
}

// ────────────────────────────────────────── Articles Server Service ──────────────────────────────────────────

/**
 * Maps a Prisma Article record to a frontend ArticleItem object
 */
export function mapPrismaArticleToItem(
  article: Article | (Omit<Article, "createdAt" | "updatedAt"> & {
    createdAt?: Date | string;
    updatedAt?: Date | string;
  })
): ArticleItem {
  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle || "",
    excerpt: article.excerpt || "",
    date: article.date,
    readTime: article.readTime || "5 MIN READ",
    author: article.author,
    authorAvatar: article.authorAvatar || undefined,
    authorRole: article.authorRole || undefined,
    image: article.image || "/img/article2.svg",
    category: article.category,
    likes: article.likes || 0,
    featured: article.featured || false,
    leadParagraph: article.leadParagraph || undefined,
    sections: (article.sections as unknown as ArticleSectionContent[]) || undefined,
    quote: (article.quote as unknown as ArticleQuote) || undefined,
    checklist: (article.checklist as unknown as { title?: string; items: ArticleChecklistItem[] }) || undefined,
    codeSnippet: (article.codeSnippet as unknown as ArticleCodeSnippet) || undefined,
    conclusion: (article.conclusion as unknown as ArticleConclusion) || undefined,
  };
}

/**
 * Fetches articles from the database with in-memory fallback
 */
export async function fetchArticlesFromDb(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<ArticleItem[]> {
  try {
    if (!isDatabaseConfigured()) {
      return filterStaticArticles(options);
    }

    const whereClause: Prisma.ArticleWhereInput = {};
    if (typeof options?.featured === "boolean") {
      whereClause.featured = options.featured;
    }
    if (options?.category && options.category !== "ALL") {
      whereClause.category = { equals: options.category, mode: "insensitive" };
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      take: options?.limit,
      orderBy: { createdAt: "desc" },
    });

    if (!articles || articles.length === 0) {
      return filterStaticArticles(options);
    }

    return articles.map(mapPrismaArticleToItem);
  } catch (error) {
    console.warn("⚠️ Database query failed in fetchArticlesFromDb, falling back to static ARTICLES:", error);
    return filterStaticArticles(options);
  }
}

/**
 * Fetches an article by ID from the database with fallback
 */
export async function fetchArticleByIdFromDb(id: string): Promise<ArticleItem | undefined> {
  try {
    if (!isDatabaseConfigured() || !id) {
      return ARTICLES.find((article) => article.id === id) || ARTICLES[0];
    }

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return ARTICLES.find((item) => item.id === id) || ARTICLES[0];
    }

    return mapPrismaArticleToItem(article);
  } catch (error) {
    console.warn(`⚠️ Database query failed for article ID ${id}, falling back to static ARTICLES:`, error);
    return ARTICLES.find((item) => item.id === id) || ARTICLES[0];
  }
}

/**
 * Atomically increments the like count for an article in the database
 */
export async function incrementArticleLikesInDb(id: string): Promise<number | null> {
  try {
    if (!isDatabaseConfigured() || !id) {
      const staticArt = ARTICLES.find((a) => a.id === id);
      if (staticArt) {
        staticArt.likes += 1;
        return staticArt.likes;
      }
      return null;
    }

    const updated = await prisma.article.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });

    return updated.likes;
  } catch (error) {
    console.warn(`⚠️ Failed to increment likes for article ${id} in DB:`, error);
    return null;
  }
}

function filterStaticArticles(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): ArticleItem[] {
  let result = [...ARTICLES];

  if (typeof options?.featured === "boolean") {
    result = result.filter((a) => Boolean(a.featured) === options.featured);
  }

  if (options?.category && options.category !== "ALL") {
    result = result.filter(
      (a) => a.category.toUpperCase() === options.category?.toUpperCase()
    );
  }

  if (options?.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
}

// ────────────────────────────────────────── Team Members Server Service ──────────────────────────────────────────

/**
 * Maps a Prisma TeamMember record to a frontend TeamMember object
 */
export function mapPrismaTeamMember(
  member: PrismaTeamMember | (Omit<PrismaTeamMember, "createdAt" | "updatedAt"> & {
    createdAt?: Date | string;
    updatedAt?: Date | string;
  })
): TeamMember {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    avatar: member.avatar || "/img/Icontemp1.svg",
    bio: member.bio || "",
    experienceYears: member.experienceYears || 0,
    joinedYear: member.joinedYear || 2026,
    skills: member.skills || [],
    resume: (member.resume as unknown as TeamMember["resume"]) || {
      education: "",
      specialty: "",
      projectsCount: 0,
      highlights: [],
    },
    socials: (member.socials as unknown as TeamMember["socials"]) || {},
  };
}

/**
 * Fetches all team members from the database with in-memory fallback
 */
export async function fetchTeamMembersFromDb(roleFilter?: string): Promise<TeamMember[]> {
  try {
    if (!isDatabaseConfigured()) {
      return filterStaticTeam(roleFilter);
    }

    const whereClause: Prisma.TeamMemberWhereInput = {};
    if (roleFilter && roleFilter !== "ALL") {
      whereClause.role = {
        contains: roleFilter,
        mode: "insensitive",
      };
    }

    const members = await prisma.teamMember.findMany({
      where: whereClause,
      orderBy: { joinedYear: "asc" },
    });

    if (!members || members.length === 0) {
      return filterStaticTeam(roleFilter);
    }

    return members.map(mapPrismaTeamMember);
  } catch (error) {
    console.warn("⚠️ Database query failed in fetchTeamMembersFromDb, falling back to static TEAM_MEMBERS:", error);
    return filterStaticTeam(roleFilter);
  }
}

function filterStaticTeam(roleFilter?: string): TeamMember[] {
  if (!roleFilter || roleFilter === "ALL") {
    return TEAM_MEMBERS;
  }
  return TEAM_MEMBERS.filter((m) =>
    m.role.toUpperCase().includes(roleFilter.toUpperCase())
  );
}
