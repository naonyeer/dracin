import { NextRequest, NextResponse } from "next/server";
import { fetchCutad } from "@/lib/cutad";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("bookId")?.trim();
  const chapterId = request.nextUrl.searchParams.get("chapterId")?.trim();

  if (!bookId || !chapterId) {
    return NextResponse.json({ error: "bookId and chapterId are required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: { videoUrl?: string } }>("dramabox", "watch", {
      id: bookId,
      chapterIds: chapterId,
    });

    const videoUrl = response.data?.videoUrl?.trim();
    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL not available" }, { status: 404 });
    }

    return NextResponse.redirect(videoUrl, { status: 307 });
  } catch (error) {
    console.error("DramaBox watch error:", error);
    return NextResponse.json({ error: "Failed to resolve stream" }, { status: 500 });
  }
}
