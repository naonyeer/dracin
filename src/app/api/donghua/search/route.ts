import { NextRequest } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogSearch } from "@/lib/cutad-catalog";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return encryptedResponse({ code: 0, message: "success", data: { items: [] } });
  }

  try {
    try {
      const response = await fetchCutad<{ data?: { sections?: any[] } }>("donghua", "search", { query });
      const payload = buildCatalogSearch(response.data);
      if ((payload.data.items || []).length > 0) {
        return encryptedResponse(payload);
      }
    } catch {
      // Fallback to rank filtering below.
    }

    const fallback = await fetchCutad<{ data?: { sections?: any[] } }>("donghua", "rank", { page: 1 });
    const payload = buildCatalogSearch(fallback.data);
    payload.data.items = payload.data.items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    return encryptedResponse(payload);
  } catch (error) {
    console.error("Donghua search error:", error);
    return createCutadErrorResponse(error, "Failed to fetch donghua search results");
  }
}
