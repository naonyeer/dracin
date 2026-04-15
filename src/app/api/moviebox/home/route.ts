import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogPage } from "@/lib/cutad-catalog";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("moviebox", "rank", { page: 1 });
    return encryptedResponse(buildCatalogPage(response.data, "Pilihan MovieBox"));
  } catch (error) {
    console.error("MovieBox home error:", error);
    return createCutadErrorResponse(error, "Failed to fetch MovieBox home");
  }
}
