import type { Metadata } from "next";
import ArticlePage from "./ArticlePage";
import { getArticleById } from "@/data/article";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    return {
      title: "Article Not Found | PIXLAPE TROVE",
    };
  }

  return {
    title: `${article.title} | PIXLAPE TROVE`,
    description: article.excerpt.slice(0, 160),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
