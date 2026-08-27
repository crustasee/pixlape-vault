import { NextRequest, NextResponse } from "next/server";
import { fetchTeamMembersFromDb } from "@/lib/db/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || undefined;

    const members = await fetchTeamMembersFromDb(role);

    return NextResponse.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch team members";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
