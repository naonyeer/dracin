import { NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, pickSectionItems, flattenSections } from "@/lib/cutad";
import { normalizeMeloloBook } from "@/lib/cutad-normalizers";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("melolo", "rank", { page: 1 });
    const sections = response.data?.sections || [];
    const items = pickSectionItems(sections, 1).length > 0 ? pickSectionItems(sections, 1) : flattenSections(sections);

    return encryptedResponse({
      algo: "cutad",
      books: items.map(normalizeMeloloBook),
      has_more: false,
      next_offset: 0,
    });
  } catch (error) {
    console.error("Melolo latest error:", error);
    return NextResponse.json({ error: "Failed to fetch Melolo latest" }, { status: 500 });
  }
}
