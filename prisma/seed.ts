import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { prisma } from "../lib/db/prisma";
import { CARDS } from "../lib/db/card";
import { ARTICLES } from "../lib/db/article";
import { TEAM_MEMBERS } from "../lib/db/team";
import { BadgeVariant, CardCategory } from "../generated/prisma/client";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed Digital Assets
  console.log("Seeding Digital Assets...");
  for (const card of CARDS) {
    const badgeEnum = card.badge.toUpperCase() as BadgeVariant;
    const categoryEnums = card.categories.map((c) => {
      if (c === "ART FOR SELL") return CardCategory.ART_FOR_SELL;
      return c as CardCategory;
    });

    await prisma.digitalAsset.upsert({
      where: { id: card.id },
      update: {
        title: card.title,
        thumbnail: card.thumbnail,
        banner: card.banner,
        icon: card.icon,
        badge: badgeEnum,
        categories: categoryEnums,
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
        changelog: Array.isArray(card.changelog) ? card.changelog.join("\n") : card.changelog || null,
      },
      create: {
        id: card.id,
        title: card.title,
        thumbnail: card.thumbnail,
        banner: card.banner,
        icon: card.icon,
        badge: badgeEnum,
        categories: categoryEnums,
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
        changelog: Array.isArray(card.changelog) ? card.changelog.join("\n") : card.changelog || null,
      },
    });
  }

  // Seed Articles
  console.log("Seeding Articles...");
  for (const article of ARTICLES) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        subtitle: article.subtitle || null,
        excerpt: article.excerpt || null,
        date: article.date,
        readTime: article.readTime || null,
        author: article.author,
        authorAvatar: article.authorAvatar || null,
        authorRole: article.authorRole || null,
        image: article.image || null,
        category: article.category,
        likes: article.likes,
        featured: article.featured || false,
        leadParagraph: article.leadParagraph || null,
        sections: article.sections ? JSON.parse(JSON.stringify(article.sections)) : undefined,
        quote: article.quote ? JSON.parse(JSON.stringify(article.quote)) : undefined,
        checklist: article.checklist ? JSON.parse(JSON.stringify(article.checklist)) : undefined,
        codeSnippet: article.codeSnippet ? JSON.parse(JSON.stringify(article.codeSnippet)) : undefined,
        conclusion: article.conclusion ? JSON.parse(JSON.stringify(article.conclusion)) : undefined,
      },
      create: {
        id: article.id,
        title: article.title,
        subtitle: article.subtitle || null,
        excerpt: article.excerpt || null,
        date: article.date,
        readTime: article.readTime || null,
        author: article.author,
        authorAvatar: article.authorAvatar || null,
        authorRole: article.authorRole || null,
        image: article.image || null,
        category: article.category,
        likes: article.likes,
        featured: article.featured || false,
        leadParagraph: article.leadParagraph || null,
        sections: article.sections ? JSON.parse(JSON.stringify(article.sections)) : undefined,
        quote: article.quote ? JSON.parse(JSON.stringify(article.quote)) : undefined,
        checklist: article.checklist ? JSON.parse(JSON.stringify(article.checklist)) : undefined,
        codeSnippet: article.codeSnippet ? JSON.parse(JSON.stringify(article.codeSnippet)) : undefined,
        conclusion: article.conclusion ? JSON.parse(JSON.stringify(article.conclusion)) : undefined,
      },
    });
  }

  // Seed Team Members
  console.log("Seeding Team Members...");
  for (const member of TEAM_MEMBERS) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        bio: member.bio,
        experienceYears: member.experienceYears,
        joinedYear: member.joinedYear,
        skills: member.skills,
        resume: member.resume,
        socials: member.socials,
      },
      create: {
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
    await prisma.$disconnect();
  });
