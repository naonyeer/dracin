import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("id")?.trim();

  if (!bookId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: any }>("freereels", "detail", { id: bookId });
    const detail = response.data;
    const episodes = Array.isArray(detail?.episodes) ? detail.episodes : [];

    return encryptedResponse({
      data: {
        info: {
          id: String(bookId),
          key: String(bookId),
          name: String(detail?.title || ""),
          title: String(detail?.title || ""),
          cover: String(detail?.coverImgUrl || ""),
          desc: String(detail?.introduce || ""),
          episode_count: episodes.length,
          follow_count: 0,
          content_tags: [],
          episode_list: episodes.map((episode: any, index: number) => ({
            id: String(episode?.id || episode?.videoFakeId || `${bookId}-${index + 1}`),
            name: String(episode?.title || `Episode ${index + 1}`),
            cover: String(episode?.cover || episode?.thumbnail || detail?.coverImgUrl || ""),
            video_fake_id: String(episode?.videoFakeId || episode?.id || ""),
            episode_number: Number(episode?.episodeNumber || index + 1),
            original_audio_language: "",
            subtitle_list: [],
            video_url: "",
            m3u8_url: "",
            external_audio_h264_m3u8: "",
            external_audio_h265_m3u8: "",
          })),
        },
      },
    });
  } catch (error) {
    console.error("FreeReels detail error:", error);
    return NextResponse.json({ error: "Failed to fetch FreeReels detail" }, { status: 500 });
  }
}
