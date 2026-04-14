import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, flattenSections } from "@/lib/cutad";
import { normalizeReelShortBook } from "@/lib/cutad-normalizers";

function matchesQuery(item: any, query: string) {
  const haystack = [item?.title, item?.description, item?.filteredTitle].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return encryptedResponse({ success: true, data: [] });
  }

  try {
    let items: any[] = [];

    try {
      const searchResponse = await fetchCutad<{ data?: { sections?: any[] } }>("reelshort", "search", { query });
      items = flattenSections(searchResponse.data?.sections || []);
    } catch {
      items = [];
    }

    if (items.length === 0) {
      const rankResponse = await fetchCutad<{ data?: { sections?: any[] } }>("reelshort", "rank", { page: 1 });
      items = flattenSections(rankResponse.data?.sections || []).filter((item) => matchesQuery(item, query));
    }

    return encryptedResponse({ success: true, data: items.map(normalizeReelShortBook) });
  } catch (error) {
    console.error("ReelShort search error:", error);
    return NextResponse.json({ error: "Failed to search ReelShort" }, { status: 500 });
  }
}
