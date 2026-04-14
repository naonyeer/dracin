import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";
import { normalizeMeloloBook } from "@/lib/cutad-normalizers";

const PAGE_SIZE = 24;

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") || "0");
    const page = Math.floor(offset / PAGE_SIZE) + 1;
    const response = await fetchCutad<{ data?: { sections?: any[]; hasMore?: boolean } }>("melolo", "rank", { page });
    const items = (response.data?.sections || []).flatMap((section: any) => (Array.isArray(section?.items) ? section.items : []));
    const books = items.map(normalizeMeloloBook);

    return encryptedResponse({
      algo: "cutad",
      books,
      has_more: Boolean(response.data?.hasMore || books.length === PAGE_SIZE),
      next_offset: offset + books.length,
    });
  } catch (error) {
    console.error("Melolo foryou error:", error);
    return NextResponse.json({ error: "Failed to fetch Melolo list" }, { status: 500 });
  }
}
