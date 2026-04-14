import { NextRequest, NextResponse } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { fetchCutad } from "@/lib/cutad";
import { normalizeMeloloBook } from "@/lib/cutad-normalizers";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return encryptedResponse({ code: 0, data: { search_data: [{ books: [] }] } });
  }

  try {
    const response = await fetchCutad<{ data?: any[] }>("melolo", "search", { query });
    const books = (Array.isArray(response.data) ? response.data : []).map(normalizeMeloloBook);

    return encryptedResponse({
      code: 0,
      data: {
        search_data: [
          {
            books,
          },
        ],
      },
    });
  } catch (error) {
    console.error("Melolo search error:", error);
    return NextResponse.json({ error: "Failed to search Melolo" }, { status: 500 });
  }
}
