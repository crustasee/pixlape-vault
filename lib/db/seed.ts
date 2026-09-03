import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { db, pool } from "./drizzle";
import { digitalAssets, articles, teamMembers } from "./schema";
import { CARDS } from "./card";
import { ARTICLES } from "./article";
import { TEAM_MEMBERS } from "./team";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting database seeding with Drizzle ORM...");

  // 1. Seed Digital Assets
  console.log("Seeding Digital Assets...");
  for (const card of CARDS) {
    const badgeLower = card.badge.toLowerCase() as "free" | "paid" | "premium";
    const categoriesArray = card.categories.map((c) =>
      c === "ART FOR SELL" ? "ART FOR SELL" : c
    ) as (
      | "APPS"
      | "TOOLS"
      | "BRUSH"
      | "TEMPLATE"
      | "ICON"
      | "ART FOR SELL"
      | "OTHERS"
    )[];

    await db
      .insert(digitalAssets)
      .values({
        id: card.id,
        title: card.title,
        thumbnail: card.thumbnail,
        banner: card.banner,
        icon: card.icon,
        badge: badgeLower,
        categories: categoriesArray,
        description: card.description,
        requirements: card.requirements,
        downloadUrl: card.downloadUrl,
        donateUrl: card.donateUrl || null,
        version: card.version || null,
        fileSize: card.fileSize || null,
        fileType: card.fileType || null,
        license: card.license || null,
        author: card.author || null,
        checksum: card.checksum || null,
        features: card.features || [],
        specs: card.specs || undefined,
        changelog: Array.isArray(card.changelog)
          ? card.changelog.join("\n")
          : card.changelog || null,
      })
      .onConflictDoUpdate({
        target: digitalAssets.id,
        set: {
          title: card.title,
          thumbnail: card.thumbnail,
          banner: card.banner,
          icon: card.icon,
          badge: badgeLower,
          categories: categoriesArray,
          description: card.description,
          requirements: card.requirements,
          downloadUrl: card.downloadUrl,
          donateUrl: card.donateUrl || null,
          version: card.version || null,
          fileSize: card.fileSize || null,
          fileType: card.fileType || null,
          license: card.license || null,
          author: card.author || null,
          checksum: card.checksum || null,
          features: card.features || [],
          specs: card.specs || undefined,
          changelog: Array.isArray(card.changelog)
            ? card.changelog.join("\n")
            : card.changelog || null,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
      });
  }

  // 2. Seed Articles
  console.log("Seeding Articles...");
  for (const article of ARTICLES) {
    await db
      .insert(articles)
      .values({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle || null,
        excerpt: article.excerpt || null,
        date: article.date,
        readTime: article.readTime || null,
        author: article.author,
        image: article.image || null,
        category: article.category,
        likes: article.likes,
        featured: article.featured || false,
        externalUrl: article.externalUrl || null,
      })
      .onConflictDoUpdate({
        target: articles.id,
        set: {
          title: article.title,
          subtitle: article.subtitle || null,
          excerpt: article.excerpt || null,
          date: article.date,
          readTime: article.readTime || null,
          author: article.author,
          image: article.image || null,
          category: article.category,
          likes: article.likes,
          featured: article.featured || false,
          externalUrl: article.externalUrl || null,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
      });
  }

  // 3. Seed Team Members
  console.log("Seeding Team Members...");
  for (const member of TEAM_MEMBERS) {
    await db
      .insert(teamMembers)
      .values({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        bio: member.bio,
        experienceYears: member.experienceYears,
        joinedYear: member.joinedYear,
        skills: member.skills,
        resume: member.resume,
        socials: member.socials,
      })
      .onConflictDoUpdate({
        target: teamMembers.id,
        set: {
          name: member.name,
          role: member.role,
          avatar: member.avatar,
          bio: member.bio,
          experienceYears: member.experienceYears,
          joinedYear: member.joinedYear,
          skills: member.skills,
          resume: member.resume,
          socials: member.socials,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
      });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
