import { NextRequest } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { createCutadErrorResponse, fetchCutad } from "@/lib/cutad";
import { buildCatalogForYou } from "@/lib/cutad-catalog";

export async function GET(request: NextRequest) {
  const offset = Number(request.nextUrl.searchParams.get("offset") || "0");

  try {
    const response = await fetchCutad<{ data?: { sections?: any[] } }>("film1", "rank", { page: 1 });
    return encryptedResponse(buildCatalogForYou(response.data?.sections, offset));
  } catch (error) {
    console.error("Film1 foryou error:", error);
    return createCutadErrorResponse(error, "Failed to fetch Film1 catalog");
  }
}
