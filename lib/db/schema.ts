import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import type {
  ArticleSectionContent,
  ArticleQuote,
  ArticleChecklistItem,
  ArticleCodeSnippet,
  ArticleConclusion,
} from "./article";
import type { TeamMember } from "./team";

// ────────────────────────────────────────── Enums ──────────────────────────────────────────

export const badgeVariantEnum = pgEnum("BadgeVariant", [
  "free",
  "paid",
  "premium",
]);

export const cardCategoryEnum = pgEnum("CardCategory", [
  "APPS",
  "TOOLS",
  "BRUSH",
  "TEMPLATE",
  "ICON",
  "ART FOR SELL",
  "OTHERS",
]);

// ────────────────────────────────────────── Digital Assets (Cards) ──────────────────────────────────────────

export const digitalAssets = pgTable("digital_assets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  banner: text("banner").notNull(),
  icon: text("icon").notNull(),
  badge: badgeVariantEnum("badge").notNull(),
  categories: cardCategoryEnum("categories").array().notNull(),
  description: text("description").notNull(),
  requirements: text("requirements")
    .array()
    .default(sql`ARRAY[]::text[]`),
  downloadUrl: text("downloadUrl").notNull(),
  donateUrl: text("donateUrl"),
  price: doublePrecision("price"),
  version: text("version"),
  fileSize: text("fileSize"),
  fileType: text("fileType"),
  license: text("license"),
  author: text("author"),
  checksum: text("checksum"),
  features: text("features")
    .array()
    .default(sql`ARRAY[]::text[]`),
  specs: jsonb("specs").$type<Record<string, string>>(),
  changelog: text("changelog"),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ────────────────────────────────────────── Articles ──────────────────────────────────────────

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  excerpt: text("excerpt"),
  content: text("content"),
  date: text("date").notNull(),
  readTime: text("readTime"),
  author: text("author").notNull(),
  authorAvatar: text("authorAvatar"),
  authorRole: text("authorRole"),
  image: text("image"),
  category: text("category").notNull(),
  likes: integer("likes").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  leadParagraph: text("leadParagraph"),
  sections: jsonb("sections").$type<ArticleSectionContent[]>(),
  quote: jsonb("quote").$type<ArticleQuote>(),
  checklist: jsonb("checklist").$type<{
    title?: string;
    items: ArticleChecklistItem[];
  }>(),
  codeSnippet: jsonb("codeSnippet").$type<ArticleCodeSnippet>(),
  conclusion: jsonb("conclusion").$type<ArticleConclusion>(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ────────────────────────────────────────── Team Members ──────────────────────────────────────────

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  experienceYears: integer("experienceYears").default(0).notNull(),
  joinedYear: integer("joinedYear").notNull(),
  skills: text("skills")
    .array()
    .default(sql`ARRAY[]::text[]`),
  resume: jsonb("resume").$type<TeamMember["resume"]>(),
  socials: jsonb("socials").$type<TeamMember["socials"]>(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ────────────────────────────────────────── Types ──────────────────────────────────────────

export type DigitalAssetSelect = typeof digitalAssets.$inferSelect;
export type DigitalAssetInsert = typeof digitalAssets.$inferInsert;

export type ArticleSelect = typeof articles.$inferSelect;
export type ArticleInsert = typeof articles.$inferInsert;

export type TeamMemberSelect = typeof teamMembers.$inferSelect;
export type TeamMemberInsert = typeof teamMembers.$inferInsert;
