import { NextRequest, NextResponse } from "next/server";
import { incrementArticleLikesInDb } from "@/lib/db/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const likes = await incrementArticleLikesInDb(id);

    if (likes === null) {
      return NextResponse.json(
        {
          success: false,
          error: `Article with ID '${id}' not found or could not be updated`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      likes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update article likes";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
