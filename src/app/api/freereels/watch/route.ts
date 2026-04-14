import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, proxyVideoUrl } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("bookId")?.trim();
  const episodeId = request.nextUrl.searchParams.get("episodeId")?.trim();

  if (!bookId || !episodeId) {
    return NextResponse.json({ error: "bookId and episodeId are required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: { url?: string; quality?: string; subtitles?: any[] } }>("freereels", "watch", {
      id: `${bookId}::${episodeId}`,
    });

    const rawUrl = String(response.data?.url || "").trim();
    const subtitles = Array.isArray(response.data?.subtitles) ? response.data?.subtitles : [];
    const indoSubtitle = subtitles.find((subtitle: any) => String(subtitle?.language || "").toLowerCase().includes("id"));

    return encryptedResponse({
      url: rawUrl,
      proxiedUrl: rawUrl ? proxyVideoUrl(rawUrl) : "",
      quality: String(response.data?.quality || "auto"),
      subtitles,
      subtitleUrl: indoSubtitle?.url || indoSubtitle?.subtitle || indoSubtitle?.vtt || "",
    });
  } catch (error) {
    console.error("FreeReels watch error:", error);
    return NextResponse.json({ error: "Failed to fetch FreeReels stream" }, { status: 500 });
  }
}
