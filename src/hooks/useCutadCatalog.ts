"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetcher";

export type CutadCatalogProvider = "anime" | "donghua" | "moviebox" | "film1" | "sfilmindo";

export interface CutadCatalogEpisode {
  id: string;
  videoFakeId: string;
  name: string;
  index: number;
  cover: string;
  episodeNumber: number;
  streamType?: string;
  embedUrl?: string;
  href?: string;
}

export interface CutadCatalogItem {
  key: string;
  cover: string;
  title: string;
  desc: string;
  episode_count: number;
  follow_count: number;
  content_tags?: string[];
  metadata?: string[];
  type?: string;
  rating?: string;
  year?: string;
  episodes?: CutadCatalogEpisode[];
  [key: string]: any;
}

export interface CutadCatalogModule {
  type: string;
  module_name?: string;
  items: CutadCatalogItem[];
  [key: string]: any;
}

export interface CutadCatalogPageResponse {
  code: number;
  message: string;
  data: {
    items: CutadCatalogModule[];
  };
}

export interface CutadCatalogForYouResponse {
  code: number;
  message: string;
  data: {
    items: CutadCatalogItem[];
    page_info?: {
      next: string;
      has_more: boolean;
    };
  };
}

export interface CutadCatalogSearchItem {
  id: string;
  name: string;
  cover: string;
  desc?: string;
  episode_count?: number;
  content_tags?: string[];
  metadata?: string[];
  [key: string]: any;
}

export interface CutadCatalogSearchResponse {
  code: number;
  message: string;
  data: {
    items: CutadCatalogSearchItem[];
  };
}

export interface CutadCatalogEpisodeStreamResponse {
  url: string;
  proxiedUrl: string;
  embedUrl: string;
  type: string;
  quality: string;
  subtitleUrl?: string;
  subtitles?: Array<{
    language?: string;
    url?: string;
    subtitle?: string;
    vtt?: string;
  }>;
  streams?: Array<{
    url?: string;
    quality?: string;
    server?: string;
    embedUrl?: string;
    type?: string;
    platform?: string;
  }>;
}

export function useCutadCatalogHome(provider: CutadCatalogProvider) {
  return useQuery<CutadCatalogPageResponse>({
    queryKey: [provider, "home"],
    queryFn: () => fetchJson<CutadCatalogPageResponse>(`/api/${provider}/home`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInfiniteCutadCatalog(provider: CutadCatalogProvider) {
  return useInfiniteQuery<CutadCatalogForYouResponse>({
    queryKey: [provider, "foryou", "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      fetchJson<CutadCatalogForYouResponse>(`/api/${provider}/foryou?offset=${pageParam}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.page_info?.has_more) {
        const nextOffset = allPages.length * 20;
        if (nextOffset >= 200) return undefined;
        return nextOffset;
      }

      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCutadCatalogDetail(provider: CutadCatalogProvider, bookId: string) {
  return useQuery({
    queryKey: [provider, "detail", bookId],
    queryFn: () => fetchJson<any>(`/api/${provider}/detail?id=${encodeURIComponent(bookId)}`),
    select: (response) => {
      const info = response.data?.info;
      if (!info) return null;

      const episodes = Array.isArray(info.episode_list)
        ? info.episode_list.map((ep: any, index: number) => ({
            id: String(ep.id || ep.video_fake_id || `${bookId}-${index + 1}`),
            videoFakeId: String(ep.video_fake_id || ep.id || ""),
            name: String(ep.name || `Episode ${index + 1}`),
            index,
            cover: String(ep.cover || info.cover || ""),
            episodeNumber: Number(ep.episode_number || index + 1),
            streamType: String(ep.stream_type || "video"),
            embedUrl: String(ep.embed_url || ""),
            href: String(ep.href || ""),
          }))
        : [];

      return {
        data: {
          ...info,
          key: info.id || info.key || bookId,
          title: info.title || info.name,
          desc: info.desc || "",
          cover: info.cover || "",
          content_tags: Array.isArray(info.content_tags) ? info.content_tags : [],
          metadata: Array.isArray(info.metadata) ? info.metadata : [],
          episodes,
          episode_count: Number(info.episode_count || episodes.length),
        } as CutadCatalogItem,
      };
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCutadCatalogEpisodeStream(
  provider: CutadCatalogProvider,
  bookId: string,
  episodeId: string
) {
  return useQuery<CutadCatalogEpisodeStreamResponse>({
    queryKey: [provider, "watch", bookId, episodeId],
    queryFn: () =>
      fetchJson<CutadCatalogEpisodeStreamResponse>(
        `/api/${provider}/watch?bookId=${encodeURIComponent(bookId)}&episodeId=${encodeURIComponent(episodeId)}`
      ),
    enabled: !!bookId && !!episodeId,
    staleTime: 60 * 1000,
  });
}

export function useCutadCatalogSearch(provider: CutadCatalogProvider, query: string) {
  return useQuery({
    queryKey: [provider, "search", query],
    queryFn: () => fetchJson<CutadCatalogSearchResponse>(`/api/${provider}/search?query=${encodeURIComponent(query)}`),
    select: (response) => {
      return (
        response.data?.items?.map((item) => ({
          ...item,
          key: item.id,
          title: item.name,
          desc: item.desc || "",
          follow_count: 0,
          content_tags: Array.isArray(item.content_tags) ? item.content_tags : [],
          metadata: Array.isArray(item.metadata) ? item.metadata : [],
        })) as CutadCatalogItem[]
      ) || [];
    },
    enabled: !!query,
    staleTime: 60 * 1000,
  });
}
