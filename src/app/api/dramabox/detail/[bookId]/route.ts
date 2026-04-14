import { NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";
import { normalizeDramaBoxDetail } from "@/lib/cutad-normalizers";

export async function GET(_: Request, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const { bookId } = await params;
    const response = await fetchCutad<{ data?: any }>("dramabox", "detail", { id: bookId });
    return encryptedResponse(normalizeDramaBoxDetail(bookId, response.data));
  } catch (error) {
    console.error("DramaBox detail error:", error);
    return NextResponse.json({ error: "Failed to fetch drama detail" }, { status: 500 });
  }
}
