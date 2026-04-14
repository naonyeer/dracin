import { NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, pickSectionItems, flattenSections } from "@/lib/cutad";
import { normalizeDramaBoxDrama } from "@/lib/cutad-normalizers";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("dramabox", "rank", { page: 1 });
    const sections = response.data?.sections || [];
    const items = pickSectionItems(sections, 2).length > 0 ? pickSectionItems(sections, 2) : flattenSections(sections).slice(0, 24);
    return encryptedResponse(items.map(normalizeDramaBoxDrama).filter((item) => item.bookId));
  } catch (error) {
    console.error("DramaBox dubindo error:", error);
    return NextResponse.json({ error: "Failed to fetch dubindo dramas" }, { status: 500 });
  }
}
