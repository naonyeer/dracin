import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, flattenSections } from "@/lib/cutad";
import { normalizeFreeReelsItem } from "@/lib/cutad-normalizers";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return encryptedResponse({ code: 0, message: "success", data: { items: [] } });
  }

  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("freereels", "search", { query });
    const items = flattenSections(response.data?.sections || []).map(normalizeFreeReelsItem);

    return encryptedResponse({
      code: 0,
      message: "success",
      data: {
        items: items.map((item) => ({
          id: item.key,
          name: item.title,
          cover: item.cover,
          desc: item.desc,
          episode_count: item.episode_count,
          follow_count: item.follow_count,
          content_tags: item.content_tags,
        })),
      },
    });
  } catch (error) {
    console.error("FreeReels search error:", error);
    return NextResponse.json({ error: "Failed to search FreeReels" }, { status: 500 });
  }
}
