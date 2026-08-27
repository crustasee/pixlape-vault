import { NextRequest, NextResponse } from "next/server";
import { fetchCardByIdFromDb } from "@/lib/db/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await fetchCardByIdFromDb(id);

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          error: `Digital asset with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: card,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch asset detail";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
