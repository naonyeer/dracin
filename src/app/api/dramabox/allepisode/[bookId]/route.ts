import { NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";
import { normalizeDramaBoxEpisodes } from "@/lib/cutad-normalizers";

export async function GET(_: Request, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const { bookId } = await params;
    const response = await fetchCutad<{ data?: any }>("dramabox", "episodes", { id: bookId });
    return encryptedResponse(normalizeDramaBoxEpisodes(bookId, response.data));
  } catch (error) {
    console.error("DramaBox allepisode error:", error);
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
  }
}
