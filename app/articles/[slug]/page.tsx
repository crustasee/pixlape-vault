import type { Metadata } from "next";
import ArticlePage from "./ArticlePage";
import { getArticleById, ARTICLES } from "@/lib/db/article";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleById(slug);

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleById(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
