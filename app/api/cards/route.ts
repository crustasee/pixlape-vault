import { NextRequest, NextResponse } from "next/server";
import { fetchCardsFromDb } from "@/lib/db/server";
import { BadgeVariant } from "@/lib/db/card";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const badge = (searchParams.get("badge") as BadgeVariant) || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    const cards = await fetchCardsFromDb({ category, badge, limit });

    return NextResponse.json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch digital assets";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
