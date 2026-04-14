import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, flattenSections, paginateArray } from "@/lib/cutad";

const PAGE_SIZE = 24;

function mapToDrama(item: any) {
  return {
    bookId: String(item?.id || item?.filteredTitle || ""),
    bookName: String(item?.title || ""),
    coverWap: String(item?.cover || ""),
    cover: String(item?.cover || ""),
    chapterCount: Number(item?.episode || 0),
    introduction: String(item?.description || ""),
    corner: item?.type ? String(item.type) : undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get("page") || "1");
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("reelshort", "rank", { page: 1 });
    const items = flattenSections(response.data?.sections || []).map(mapToDrama).filter((item) => item.bookId);
    return encryptedResponse(paginateArray(items, page, PAGE_SIZE));
  } catch (error) {
    console.error("ReelShort foryou error:", error);
    return NextResponse.json({ error: "Failed to fetch ReelShort list" }, { status: 500 });
  }
}
