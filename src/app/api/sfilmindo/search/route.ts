import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad, flattenSections } from "@/lib/cutad";
import { buildCatalogSearch, normalizeCatalogItem } from "@/lib/cutad-catalog";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    try {
      const searchResponse = await fetchCutad<{ data?: { sections?: any[] } }>("sfilmindo", "search", { query });
      const built = buildCatalogSearch(searchResponse.data?.sections);
      if (built.data.items.length > 0) {
        return encryptedResponse(built);
      }
    } catch {
      // Fall back to rank filtering below.
    }

    const rankResponse = await fetchCutad<{ data?: { sections?: any[] } }>("sfilmindo", "rank", { page: 1 });
    const loweredQuery = query.toLowerCase();
    const items = flattenSections(rankResponse.data?.sections)
      .map(normalizeCatalogItem)
      .filter((item) => {
        const haystack = [item.title, item.desc, ...(item.content_tags || []), ...(item.metadata || [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(loweredQuery);
      })
      .map((item) => ({
        id: item.key,
        name: item.title,
        cover: item.cover,
        desc: item.desc,
        episode_count: item.episode_count,
        content_tags: item.content_tags,
        metadata: item.metadata,
        type: item.type,
        rating: item.rating,
        year: item.year,
      }));

    return encryptedResponse({ code: 0, message: "success", data: { items } });
  } catch (error) {
    console.error("SFilmIndo search error:", error);
    return createCutadErrorResponse(error, "Failed to fetch SFilmIndo search");
  }
}
