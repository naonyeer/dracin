import { NextRequest } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, flattenSections, paginateArray, createCutadErrorResponse } from "@/lib/cutad";
import { normalizeDramaBoxDrama } from "@/lib/cutad-normalizers";

const PAGE_SIZE = 24;

export async function GET(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get("page") || "1");
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("dramabox", "rank", { page: 1 });
    const items = flattenSections(response.data?.sections || [])
      .map(normalizeDramaBoxDrama)
      .filter((item) => item.bookId);

    return encryptedResponse(paginateArray(items, page, PAGE_SIZE));
  } catch (error) {
    console.error("DramaBox foryou error:", error);
    return createCutadErrorResponse(error, "Failed to fetch for you dramas");
  }
}
