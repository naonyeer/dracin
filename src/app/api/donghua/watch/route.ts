import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogWatchPayload } from "@/lib/cutad-catalog";

export async function GET(request: NextRequest) {
  const episodeId = request.nextUrl.searchParams.get("episodeId")?.trim();

  if (!episodeId) {
    return NextResponse.json({ error: "episodeId is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: any }>("donghua", "watch", { id: episodeId });
    return encryptedResponse(buildCatalogWatchPayload(response.data));
  } catch (error) {
    console.error("Donghua watch error:", error);
    return createCutadErrorResponse(error, "Failed to fetch donghua stream");
  }
}
