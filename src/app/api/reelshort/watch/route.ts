import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("bookId")?.trim();
  const episodeNumber = Number(request.nextUrl.searchParams.get("episodeNumber") || "1");

  if (!bookId) {
    return NextResponse.json({ error: "bookId is required" }, { status: 400 });
  }

  try {
    const detailResponse = await fetchCutad<{ data?: any }>("reelshort", "detail", { id: bookId });
    const detail = detailResponse.data;
    const chapters = Array.isArray(detail?.chapters) ? detail.chapters : [];
    const targetEpisode = chapters.find((chapter: any) => Number(chapter?.episode) === episodeNumber) || chapters[episodeNumber - 1];

    if (!targetEpisode) {
      return encryptedResponse({ success: false, isLocked: true, videoList: [] });
    }

    const watchResponse = await fetchCutad<{ data?: any }>("reelshort", "watch", {
      bookId: detail?.bookId,
      chapterId: targetEpisode?.chapter_id,
      episode: targetEpisode?.episode || episodeNumber,
      filteredTitle: detail?.filteredTitle || detail?.id || bookId,
    });

    const rawUrl = String(watchResponse.data?.url || watchResponse.data?.videoUrl || "").trim();
    const quality = String(watchResponse.data?.quality || "auto");

    return encryptedResponse({
      success: Boolean(rawUrl),
      isLocked: !rawUrl,
      videoList: rawUrl
        ? [
            {
              url: rawUrl,
              encode: quality.toLowerCase().includes("h265") ? "H265" : "H264",
              quality,
              bitrate: 0,
            },
          ]
        : [],
    });
  } catch (error) {
    console.error("ReelShort watch error:", error);
    return NextResponse.json({ error: "Failed to fetch ReelShort stream" }, { status: 500 });
  }
}
