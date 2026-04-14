import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("bookId")?.trim();

  if (!bookId) {
    return NextResponse.json({ error: "bookId is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: any }>("reelshort", "detail", { id: bookId });
    const detail = response.data;

    return encryptedResponse({
      success: true,
      bookId: String(detail?.id || bookId),
      providerBookId: String(detail?.bookId || ""),
      filteredTitle: String(detail?.filteredTitle || detail?.id || bookId),
      title: String(detail?.title || ""),
      cover: String(detail?.cover || ""),
      description: String(detail?.description || ""),
      totalEpisodes: Number(detail?.totalEpisodes || (Array.isArray(detail?.chapters) ? detail.chapters.length : 0)),
      chapters: Array.isArray(detail?.chapters) ? detail.chapters : [],
    });
  } catch (error) {
    console.error("ReelShort detail error:", error);
    return NextResponse.json({ error: "Failed to fetch ReelShort detail" }, { status: 500 });
  }
}
