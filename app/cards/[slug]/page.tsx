import type { Metadata } from "next";
import CardViewPage from "@/components/cardview/CardViewPage";
import { getCardById, CARDS } from "@/lib/db/card";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return CARDS.map((card) => ({
    slug: card.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardById(slug);

  if (!card) {
    return {
      title: "Asset Not Found | PIXLAPE TROVE",
    };
  }

  return {
    title: `${card.title} | PIXLAPE TROVE`,
    description: card.description.slice(0, 160),
  };
}

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardById(slug);

  if (!card) {
    notFound();
  }

  return <CardViewPage cardId={card.id} initialCard={card} />;
}
