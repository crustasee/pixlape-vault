import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardGrid from "@/components/CardGrid";
import Link from "next/link";
import { CARDS } from "@/lib/db/card";

export async function generateStaticParams() {
  const categories = [
    "apps",
    "tools",
    "brush",
    "template",
    "icon",
    "art-for-sell",
    "others",
  ];
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category).replace(/-/g, " ").toUpperCase();
  return {
    title: `${decodedCategory} Assets | PIXLAPE TROVE`,
    description: `Browse all ${decodedCategory} digital assets available in the Pixlape vault.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category).replace(/-/g, " ");

  const matchingCategory = (cat: string) => {
    return (
      cat.toLowerCase() === decodedCategory.toLowerCase() ||
      cat.replace(/\s+/g, "-").toLowerCase() === category.toLowerCase()
    );
  };

  const filteredCards = CARDS.filter((card) =>
    card.categories.some((c) => matchingCategory(c))
  );

  return (
    <div className="min-h-screen bg-surface text-text-primary font-mono flex flex-col">
      <Header />

      <main className="mx-12 mt-20 mb-12 flex-1 flex flex-col gap-6">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <Link
            href="/"
            className="text-xs font-mono text-black-secondary hover:text-black-primary transition-colors flex items-center gap-1.5"
          >
            <span>&lt;</span> BACK TO TROVE
          </Link>
          <span className="text-xs font-bold text-black-secondary uppercase">
            CATEGORY: [{decodedCategory.toUpperCase()}]
          </span>
        </div>

        {/* Category Header */}
        <div className="p-6 bg-border border border-black rounded-md flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-pixel text-black-secondary uppercase">
            +++ CATEGORY: {decodedCategory.toUpperCase()} +++
          </h1>
          <p className="text-xs text-text-secondary">
            Displaying {filteredCards.length} assets categorized under {decodedCategory.toUpperCase()}.
          </p>
        </div>

        {/* Card Grid with Filtered Assets */}
        <CardGrid cards={filteredCards} selectedCategory={decodedCategory.toUpperCase()} />
      </main>

      <Footer />
    </div>
  );
}
