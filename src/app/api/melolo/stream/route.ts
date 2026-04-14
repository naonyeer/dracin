import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, proxyVideoUrl } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId")?.trim();

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: { videoUrl?: string; quality?: string | number } }>("melolo", "watch", { id: videoId });
    const videoUrl = String(response.data?.videoUrl || "").trim();
    const quality = String(response.data?.quality || "720p");
    const proxiedUrl = videoUrl ? proxyVideoUrl(videoUrl) : "";

    return encryptedResponse({
      code: 0,
      data: {
        main_url: proxiedUrl,
        video_model: JSON.stringify([
          {
            quality,
            main_url: proxiedUrl,
          },
        ]),
      },
    });
  } catch (error) {
    console.error("Melolo stream error:", error);
    return NextResponse.json({ error: "Failed to fetch Melolo stream" }, { status: 500 });
  }
}
