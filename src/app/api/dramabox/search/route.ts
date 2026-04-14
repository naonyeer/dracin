import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, flattenSections } from "@/lib/cutad";
import { normalizeDramaBoxSearch, normalizeDramaBoxDrama } from "@/lib/cutad-normalizers";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return encryptedResponse([]);
  }

  try {
    const response = await fetchCutad<{ data?: { records?: any[] } }>("dramabox", "search", { query });
    const directResults = Array.isArray(response.data?.records)
      ? response.data.records.map(normalizeDramaBoxSearch).filter((item) => item.bookId)
      : [];

    if (directResults.length > 0) {
      return encryptedResponse(directResults);
    }

    const rankResponse = await fetchCutad<{ data?: { sections?: any[] } }>("dramabox", "rank", { page: 1 });
    const fallbackResults = flattenSections(rankResponse.data?.sections || [])
      .map(normalizeDramaBoxDrama)
      .filter((item) => item.bookName.toLowerCase().includes(query.toLowerCase()))
      .map(normalizeDramaBoxSearch);

    return encryptedResponse(fallbackResults);
  } catch (error) {
    console.error("DramaBox search error:", error);
    return NextResponse.json({ error: "Failed to search dramas" }, { status: 500 });
  }
}
