import "server-only";
import { eq, or, desc, asc, ilike, sql, and, SQL } from "drizzle-orm";
import { db, isDatabaseConfigured } from "./drizzle";
import {
  digitalAssets,
  articles,
  teamMembers,
  type DigitalAssetSelect,
  type ArticleSelect,
  type TeamMemberSelect,
} from "./schema";
import { CARDS, CardDetail, CardCategory, BadgeVariant, mapAssetToCardDetail } from "./card";
import {
  ARTICLES,
  ArticleItem,
} from "./article";
import { TEAM_MEMBERS, TeamMember } from "./team";

// ────────────────────────────────────────── Digital Assets Server Service ──────────────────────────────────────────

export { mapAssetToCardDetail };

// Backward compatibility alias
export const mapPrismaAssetToCardDetail = mapAssetToCardDetail;

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

    const conditions: (SQL | undefined)[] = [];

    if (options?.badge) {
      const badgeLower = options.badge.toLowerCase() as "free" | "paid" | "premium";
      conditions.push(eq(digitalAssets.badge, badgeLower));
    }

    if (options?.category && options.category !== "ALL" && options.category !== "ALL ASSETS") {
      const normalizedCat =
        options.category === "ART FOR SELL"
          ? "ART FOR SELL"
          : options.category.toUpperCase().replace(/\s+/g, "_");
      conditions.push(sql`${normalizedCat} = ANY(${digitalAssets.categories})`);
    }

    const rows = await db.query.digitalAssets.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit: options?.limit,
      orderBy: [desc(digitalAssets.createdAt)],
    });

    if (!rows || rows.length === 0) {
      return filterStaticCards(options);
    }

    return rows.map(mapAssetToCardDetail);
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
    const asset = await db.query.digitalAssets.findFirst({
      where: or(eq(digitalAssets.id, id), eq(digitalAssets.id, normalizedId)),
    });

    if (!asset) {
      return getCardById(id);
    }

    return mapAssetToCardDetail(asset);
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
 * Maps a Drizzle Article record to a frontend ArticleItem object
 */
export function mapArticleToItem(
  article: ArticleSelect | (Omit<ArticleSelect, "createdAt" | "updatedAt"> & {
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
    image: article.image || "/img/article2.svg",
    category: article.category,
    likes: article.likes || 0,
    featured: article.featured || false,
    externalUrl: article.externalUrl || undefined,
  };
}

// Backward compatibility alias
export const mapPrismaArticleToItem = mapArticleToItem;

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

    const conditions: (SQL | undefined)[] = [];

    if (typeof options?.featured === "boolean") {
      conditions.push(eq(articles.featured, options.featured));
    }
    if (options?.category && options.category !== "ALL") {
      conditions.push(ilike(articles.category, options.category));
    }

    const rows = await db.query.articles.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit: options?.limit,
      orderBy: [desc(articles.createdAt)],
    });

    if (!rows || rows.length === 0) {
      return filterStaticArticles(options);
    }

    return rows.map(mapArticleToItem);
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

    const article = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });

    if (!article) {
      return ARTICLES.find((item) => item.id === id) || ARTICLES[0];
    }

    return mapArticleToItem(article);
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

    const updated = await db
      .update(articles)
      .set({ likes: sql`${articles.likes} + 1` })
      .where(eq(articles.id, id))
      .returning({ likes: articles.likes });

    return updated[0]?.likes ?? null;
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
 * Maps a Drizzle TeamMember record to a frontend TeamMember object
 */
export function mapTeamMember(
  member: TeamMemberSelect | (Omit<TeamMemberSelect, "createdAt" | "updatedAt"> & {
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

// Backward compatibility alias
export const mapPrismaTeamMember = mapTeamMember;

/**
 * Fetches all team members from the database with in-memory fallback
 */
export async function fetchTeamMembersFromDb(roleFilter?: string): Promise<TeamMember[]> {
  try {
    if (!isDatabaseConfigured()) {
      return filterStaticTeam(roleFilter);
    }

    const whereClause =
      roleFilter && roleFilter !== "ALL"
        ? ilike(teamMembers.role, `%${roleFilter}%`)
        : undefined;

    const members = await db.query.teamMembers.findMany({
      where: whereClause,
      orderBy: [asc(teamMembers.joinedYear)],
    });

    if (!members || members.length === 0) {
      return filterStaticTeam(roleFilter);
    }

    return members.map(mapTeamMember);
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
