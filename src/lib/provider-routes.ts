import type { Platform } from "@/lib/provider-registry";

export function getDetailHref(platform: Platform, id: string): string {
  return `/detail/${platform}/${id}`;
}

export function getWatchHref(
  platform: Platform,
  params: {
    id: string;
    episode?: number | string;
    videoId?: string;
  }
): string {
  if (
    platform === "dramabox" ||
    platform === "reelshort" ||
    platform === "anime" ||
    platform === "donghua" ||
    platform === "moviebox" ||
    platform === "film1" ||
    platform === "sfilmindo"
  ) {
    return `/watch/${platform}/${params.id}`;
  }

  if (platform === "melolo" || platform === "flickreels") {
    if (params.videoId) {
      return `/watch/${platform}/${params.id}/${params.videoId}`;
    }

    return getDetailHref(platform, params.id);
  }

  if (platform === "freereels") {
    return `/watch/freereels/${params.id}`;
  }

  return getDetailHref(platform, params.id);
}
