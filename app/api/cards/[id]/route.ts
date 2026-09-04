import { NextRequest, NextResponse } from "next/server";
import { fetchCardByIdFromDb } from "@/lib/db/server";
import { updateAssetAction, deleteAssetAction } from "@/app/actions/product-actions";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateAssetAction(id, body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || `Failed to update asset '${id}'`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.asset,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update asset";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteAssetAction(id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || `Failed to delete asset '${id}'`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Asset '${id}' deleted successfully from database`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete asset";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

