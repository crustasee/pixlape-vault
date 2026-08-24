import CardViewPage from "@/app/component/cardview/CardViewPage";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CardViewPage cardId={id} />;
}
