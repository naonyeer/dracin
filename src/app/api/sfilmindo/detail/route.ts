import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { buildCatalogDetail } from "@/lib/cutad-catalog";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("id")?.trim();

  if (!bookId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: any }>("sfilmindo", "detail", { id: bookId });
    return encryptedResponse(buildCatalogDetail(bookId, response.data));
  } catch (error) {
    console.error("SFilmIndo detail error:", error);
    return createCutadErrorResponse(error, "Failed to fetch SFilmIndo detail");
  }
}
