import ArticlePage from "./ArticlePage";
import { getArticleById } from "@/app/data/article";
import { notFound } from "next/navigation";

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
