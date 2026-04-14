import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";
import { normalizeFreeReelsItem } from "@/lib/cutad-normalizers";

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") || "0");
    const page = Math.floor(offset / 20) + 1;
    const response = await fetchCutad<{ data?: { sections?: any[]; hasMore?: boolean } }>("freereels", "rank", { page });
    const items = (response.data?.sections || []).flatMap((section: any) => (Array.isArray(section?.items) ? section.items : []));

    return encryptedResponse({
      code: 0,
      message: "success",
      data: {
        items: items.map(normalizeFreeReelsItem),
        page_info: {
          next: String(offset + 20),
          has_more: Boolean(response.data?.hasMore || items.length >= 20),
        },
      },
    });
  } catch (error) {
    console.error("FreeReels foryou error:", error);
    return NextResponse.json({ error: "Failed to fetch FreeReels list" }, { status: 500 });
  }
}
