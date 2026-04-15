import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogPage } from "@/lib/cutad-catalog";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("anime", "rank", { page: 1 });
    return encryptedResponse(buildCatalogPage(response.data, "Pilihan Anime"));
  } catch (error) {
    console.error("Anime home error:", error);
    return createCutadErrorResponse(error, "Failed to fetch anime home");
  }
}
