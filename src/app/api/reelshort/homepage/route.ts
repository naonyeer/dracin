import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, createCutadErrorResponse } from "@/lib/cutad";
import { normalizeReelShortBook } from "@/lib/cutad-normalizers";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("reelshort", "rank", { page: 1 });
    const sections = Array.isArray(response.data?.sections) ? response.data?.sections : [];
    const tabNames = ["POPULER", "TERBARU", "TRENDING", "UNTUK KAMU"];

    const tab_list = sections.slice(0, 4).map((section, index) => ({
      tab_id: String(index + 1),
      tab_name: tabNames[index] || section?.name || `TAB ${index + 1}`,
    }));

    const lists = sections.slice(0, 4).map((section, index) => ({
      tab_id: String(index + 1),
      title: section?.name || tabNames[index] || `Section ${index + 1}`,
      books: (Array.isArray(section?.items) ? section.items : []).map(normalizeReelShortBook),
    }));

    return encryptedResponse({ tab_list, lists });
  } catch (error) {
    console.error("ReelShort homepage error:", error);
    return createCutadErrorResponse(error, "Failed to fetch ReelShort homepage");
  }
}
