import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogPage } from "@/lib/cutad-catalog";

export async function GET() {
  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("film1", "rank", { page: 1 });
    return encryptedResponse(buildCatalogPage(response.data?.sections, "Pilihan Film1"));
  } catch (error) {
    console.error("Film1 home error:", error);
    return createCutadErrorResponse(error, "Failed to fetch Film1 home");
  }
}
