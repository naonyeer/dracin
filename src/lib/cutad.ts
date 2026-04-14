import { NextResponse } from "next/server";
import { safeJson } from "@/lib/api-utils";

const CUTAD_BASE_URL = (process.env.CUTAD_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.cutad.web.id").replace(/\/$/, "");
const CUTAD_API_KEY =
  process.env.CUTAD_API_KEY ||
  process.env.NEXT_PUBLIC_CUTAD_API_KEY ||
  process.env.CUTAD_KEY ||
  process.env.API_KEY ||
  "";

export type CutadSection<T> = {
  name?: string;
  items?: T[];
};

export function getCutadApiKey() {
  if (!CUTAD_API_KEY) {
    throw new Error(
      "Missing Cutad API key environment variable. Set CUTAD_API_KEY (preferred), NEXT_PUBLIC_CUTAD_API_KEY, CUTAD_KEY, or API_KEY."
    );
  }

  return CUTAD_API_KEY;
}

export function createCutadErrorResponse(error: unknown, fallbackMessage: string) {
  const message = error instanceof Error ? error.message : fallbackMessage;
  const isConfigError = message.includes("Missing Cutad API key environment variable");

  return NextResponse.json(
    {
      error: isConfigError ? "Cutad API key is not configured on the server" : fallbackMessage,
      details: message,
    },
    { status: isConfigError ? 503 : 500 }
  );
}

export function buildCutadUrl(
  provider: string,
  action: string,
  params?: Record<string, string | number | boolean | undefined | null>
) {
  const url = new URL(`${CUTAD_BASE_URL}/public/api/v1/${provider}/${action}`);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function fetchCutad<T>(
  provider: string,
  action: string,
  params?: Record<string, string | number | boolean | undefined | null>
): Promise<T> {
  const response = await fetch(buildCutadUrl(provider, action, params), {
    cache: "no-store",
    headers: {
      "X-API-Key": getCutadApiKey(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Cutad ${provider}/${action} failed (${response.status}): ${errorText.slice(0, 300)}`
    );
  }

  return safeJson<T>(response);
}

export function flattenSections<T>(sections: CutadSection<T>[] | undefined | null): T[] {
  if (!Array.isArray(sections)) return [];
  return sections.flatMap((section) => (Array.isArray(section.items) ? section.items : []));
}

export function pickSectionItems<T>(
  sections: CutadSection<T>[] | undefined | null,
  sectionIndex: number
): T[] {
  if (!Array.isArray(sections) || sections.length === 0) return [];
  return Array.isArray(sections[sectionIndex]?.items) ? sections[sectionIndex].items : [];
}

export function paginateArray<T>(items: T[], page: number, pageSize: number) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function proxyVideoUrl(url: string) {
  return `/api/proxy/video?url=${encodeURIComponent(url)}`;
}
