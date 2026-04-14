import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad, flattenSections, createCutadErrorResponse } from "@/lib/cutad";
import { normalizeFreeReelsItem, buildFreeReelsModules } from "@/lib/cutad-normalizers";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("freereels", "rank", { page: 1 });
    const items = flattenSections(response.data?.sections || []).map(normalizeFreeReelsItem);

    return encryptedResponse({
      code: 0,
      message: "success",
      data: {
        items: buildFreeReelsModules(items, "Pilihan FreeReels"),
      },
    });
  } catch (error) {
    console.error("FreeReels home error:", error);
    return createCutadErrorResponse(error, "Failed to fetch FreeReels home");
  }
}
