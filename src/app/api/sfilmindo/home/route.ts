import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogPage } from "@/lib/cutad-catalog";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("sfilmindo", "rank", { page: 1 });
    return encryptedResponse(buildCatalogPage(response.data?.sections, "Pilihan SFilmIndo"));
  } catch (error) {
    console.error("SFilmIndo home error:", error);
    return createCutadErrorResponse(error, "Failed to fetch SFilmIndo home");
  }
}
