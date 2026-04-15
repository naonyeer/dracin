import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { buildCatalogWatchPayload } from "@/lib/cutad-catalog";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const episodeId = request.nextUrl.searchParams.get("episodeId")?.trim();
  const bookId = request.nextUrl.searchParams.get("bookId")?.trim();
  const targetId = episodeId || bookId;

  if (!targetId) {
    return NextResponse.json({ error: "episodeId or bookId is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: any }>("moviebox", "watch", { id: targetId });
    return encryptedResponse(buildCatalogWatchPayload(response.data));
  } catch (error) {
    console.error("MovieBox watch error:", error);
    return createCutadErrorResponse(error, "Failed to fetch MovieBox stream");
  }
}
