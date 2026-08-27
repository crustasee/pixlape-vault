import { NextRequest, NextResponse } from "next/server";
import { fetchArticlesFromDb } from "@/lib/db/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const featured =
      searchParams.get("featured") !== null
        ? searchParams.get("featured") === "true"
        : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    const articles = await fetchArticlesFromDb({ category, featured, limit });

    return NextResponse.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch articles";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
