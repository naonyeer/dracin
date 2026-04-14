import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";
import { normalizeMeloloDetail } from "@/lib/cutad-normalizers";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("bookId")?.trim();

  if (!bookId) {
    return NextResponse.json({ error: "bookId is required" }, { status: 400 });
  }

  try {
    const response = await fetchCutad<{ data?: any }>("melolo", "detail", { id: bookId });
    return encryptedResponse(normalizeMeloloDetail(response.data));
  } catch (error) {
    console.error("Melolo detail error:", error);
    return NextResponse.json({ error: "Failed to fetch Melolo detail" }, { status: 500 });
  }
}
