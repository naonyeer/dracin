"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetcher";

export interface FreeReelsItem {
  key: string;
  cover: string;
  title: string;
  desc: string;
  episode_count: number;
  follow_count: number;
  content_tags?: string[];
  container?: {
    kind: string;
    episode_info?: {
      id: string;
      name: string;
    };
    next_episode?: {
      id: string;
      name: string;
    };
  };
  link?: string;
  [key: string]: any;
}

export interface FreeReelsForYouResponse {
  code: number;
  message: string;
  data: {
    items: FreeReelsItem[];
    page_info?: {
      next: string;
      has_more: boolean;
    };
  };
}

export interface FreeReelsModule {
  type: string;
  module_name?: string;
  items: FreeReelsItem[];
  [key: string]: any;
}

export interface FreeReelsPageResponse {
  code: number;
  message: string;
  data: {
    items: FreeReelsModule[];
  };
}

export interface FreeReelsHomeResponse {
  code: number;
  message: string;
  data: {
    items: FreeReelsItem[];
  };
}

export interface FreeReelsDetailResponse {
  data: FreeReelsItem;
}

export interface FreeReelsEpisodeStreamResponse {
  url: string;
  proxiedUrl: string;
  quality: string;
  subtitleUrl: string;
  subtitles?: Array<{
    language?: string;
    url?: string;
    subtitle?: string;
    vtt?: string;
  }>;
}

export function useFreeReelsForYou() {
  return useQuery<FreeReelsForYouResponse>({
    queryKey: ["freereels", "foryou"],
    queryFn: () => fetchJson<FreeReelsForYouResponse>("/api/freereels/foryou"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInfiniteFreeReelsDramas() {
  return useInfiniteQuery<FreeReelsForYouResponse>({
    queryKey: ["freereels", "foryou", "infinite"],
    queryFn: ({ pageParam = 0 }) => fetchJson<FreeReelsForYouResponse>(`/api/freereels/foryou?offset=${pageParam}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.page_info?.has_more) {
        const nextOffset = allPages.length * 20;
        if (nextOffset >= 100) return undefined;
        return nextOffset;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFreeReelsHome() {
  return useQuery<FreeReelsPageResponse>({
    queryKey: ["freereels", "home"],
    queryFn: () => fetchJson<FreeReelsPageResponse>("/api/freereels/home"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFreeReelsAnime() {
  return useQuery<FreeReelsPageResponse>({
    queryKey: ["freereels", "anime"],
    queryFn: () => fetchJson<FreeReelsPageResponse>("/api/freereels/anime"),
    staleTime: 5 * 60 * 1000,
  });
}

export interface FreeReelsSearchItem {
  id: string;
  name: string;
  cover: string;
  desc?: string;
  episode_count?: number;
  [key: string]: any;
}

export interface FreeReelsSearchResponse {
  code: number;
  message: string;
  data: {
    items: FreeReelsSearchItem[];
  };
}

export function useFreeReelsDetail(bookId: string) {
  return useQuery({
    queryKey: ["freereels", "detail", bookId],
    queryFn: () => fetchJson<any>(`/api/freereels/detail?id=${bookId}`),
    select: (response) => {
      const info = response.data?.info;
      if (!info) return null;

      const episodes = info.episode_list?.map((ep: any, index: number) => ({
        id: ep.id,
        videoFakeId: ep.video_fake_id || ep.id,
        name: ep.name,
        index,
        videoUrl: ep.video_url || "",
        m3u8_url: ep.m3u8_url || "",
        external_audio_h264_m3u8: ep.external_audio_h264_m3u8 || "",
        external_audio_h265_m3u8: ep.external_audio_h265_m3u8 || "",
        cover: ep.cover || info.cover,
        subtitleUrl: "",
        originalAudioLanguage: ep.original_audio_language || "",
      })) || [];

      return {
        data: {
          ...info,
          key: info.id,
          title: info.title || info.name,
          cover: info.cover,
          desc: info.desc || "",
          follow_count: info.follow_count || 0,
          content_tags: info.content_tags || [],
          episode_count: info.episode_count || episodes.length,
          episodes,
        } as FreeReelsItem,
      };
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFreeReelsEpisodeStream(bookId: string, episodeId: string) {
  return useQuery<FreeReelsEpisodeStreamResponse>({
    queryKey: ["freereels", "watch", bookId, episodeId],
    queryFn: () =>
      fetchJson<FreeReelsEpisodeStreamResponse>(
        `/api/freereels/watch?bookId=${encodeURIComponent(bookId)}&episodeId=${encodeURIComponent(episodeId)}`
      ),
    enabled: !!bookId && !!episodeId,
    staleTime: 60 * 1000,
  });
}

export function useFreeReelsSearch(query: string) {
  return useQuery({
    queryKey: ["freereels", "search", query],
    queryFn: () => fetchJson<FreeReelsSearchResponse>(`/api/freereels/search?query=${encodeURIComponent(query)}`),
    select: (response) => {
      return (
        response.data?.items?.map((item) => ({
          ...item,
          key: item.id,
          title: item.name,
          follow_count: item.follow_count || 0,
        })) as FreeReelsItem[]
      ) || [];
    },
    enabled: !!query,
    staleTime: 60 * 1000,
  });
}
