import type { Metadata } from "next";
import CardViewPage from "@/components/cardview/CardViewPage";
import { getCardById } from "@/data/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = getCardById(id);

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CardViewPage cardId={id} />;
}
