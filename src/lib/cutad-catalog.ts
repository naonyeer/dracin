import { flattenSections, paginateArray, proxyVideoUrl, type CutadSection } from "@/lib/cutad";

export type CutadCatalogProvider = "anime" | "donghua" | "moviebox" | "film1" | "sfilmindo";

function toText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function extractRawCatalogItems(source: unknown): any[] {
  if (!source) return [];

  if (Array.isArray(source)) {
    const sectionLike = source.filter((item) => item && typeof item === "object" && Array.isArray((item as any).items));
    if (sectionLike.length > 0 && sectionLike.length === source.length) {
      return flattenSections(sectionLike as CutadSection<any>[]);
    }

    return source.flatMap((item) => {
      if (Array.isArray(item?.rank_list)) return item.rank_list;
      if (Array.isArray(item?.list)) return item.list;
      return item ? [item] : [];
    });
  }

  if (typeof source === "object") {
    const data = source as { sections?: unknown; list?: unknown; items?: unknown };

    if (Array.isArray(data.sections)) {
      return extractRawCatalogItems(data.sections);
    }

    if (Array.isArray(data.list)) {
      return extractRawCatalogItems(data.list);
    }

    if (Array.isArray(data.items)) {
      return extractRawCatalogItems(data.items);
    }
  }

  return [];
}

export function normalizeCatalogItem(item: any) {
  return {
    key: toText(item?.id || item?.book_id || item?.playlet_id || item?.key || item?.fakeId || item?.href),
    title: toText(item?.title || item?.book_title || item?.bookName || item?.name),
    cover: toText(item?.cover || item?.book_pic || item?.thumb_url || item?.poster || item?.coverImgUrl),
    desc: toText(item?.desc || item?.special_desc || item?.abstract || item?.description || item?.introduce || item?.introduction),
    episode_count: toNumber(item?.episode_count || item?.chapter_count || item?.serial_count || item?.episode || item?.totalEpisodes || item?.totalOfEpisodes),
    follow_count: toNumber(item?.follow_count || item?.hot_num || item?.read_count || item?.collect_count),
    content_tags: toStringArray(item?.content_tags || item?.tags || item?.genre || item?.category || item?.theme),
    metadata: [toText(item?.type), toText(item?.rating), toText(item?.year)].filter(Boolean),
    type: toText(item?.type),
    rating: toText(item?.rating),
    year: toText(item?.year),
  };
}

export function buildCatalogModules(items: ReturnType<typeof normalizeCatalogItem>[], moduleName: string) {
  return [
    {
      type: "recommend",
      module_name: moduleName,
      items: items.length
        ? [
            {
              key: `${moduleName}-featured`,
              title: moduleName,
              cover: items[0]?.cover || "",
              module_card: {
                items,
              },
            },
          ]
        : [],
    },
  ];
}

export function buildCatalogPage(source: unknown, moduleName: string) {
  const items = extractRawCatalogItems(source).map(normalizeCatalogItem).filter((item) => item.key && item.title && item.cover);

  return {
    code: 0,
    message: "success",
    data: {
      items: buildCatalogModules(items, moduleName),
    },
  };
}

export function buildCatalogForYou(source: unknown, offset = 0, pageSize = 20) {
  const items = extractRawCatalogItems(source).map(normalizeCatalogItem).filter((item) => item.key && item.title && item.cover);
  const sliced = items.slice(offset, offset + pageSize);

  return {
    code: 0,
    message: "success",
    data: {
      items: sliced,
      page_info: {
        next: String(offset + sliced.length),
        has_more: offset + sliced.length < items.length,
      },
    },
  };
}

export function buildCatalogSearch(source: unknown) {
  const items = extractRawCatalogItems(source)
    .map(normalizeCatalogItem)
    .filter((item) => item.key && item.title && item.cover)
    .map((item) => ({
      id: item.key,
      name: item.title,
      cover: item.cover,
      desc: item.desc,
      episode_count: item.episode_count,
      content_tags: item.content_tags,
      metadata: item.metadata,
      type: item.type,
      rating: item.rating,
      year: item.year,
    }));

  return {
    code: 0,
    message: "success",
    data: {
      items,
    },
  };
}

export function buildCatalogDetail(bookId: string, detail: any) {
  const episodes = Array.isArray(detail?.episodes) ? detail.episodes : [];
  const contentTags = toStringArray(detail?.genre || detail?.category);
  const metadata = [toText(detail?.type), toText(detail?.rating), toText(detail?.year)].filter(Boolean);

  return {
    data: {
      info: {
        id: toText(detail?.fakeId || detail?.id || bookId),
        key: toText(detail?.fakeId || detail?.id || bookId),
        name: toText(detail?.title),
        title: toText(detail?.title),
        cover: toText(detail?.coverImgUrl || detail?.cover || detail?.poster),
        desc: toText(detail?.introduce || detail?.description),
        episode_count: toNumber(detail?.totalOfEpisodes || detail?.totalEpisodes || episodes.length, episodes.length),
        follow_count: 0,
        content_tags: contentTags,
        metadata,
        type: toText(detail?.type),
        rating: toText(detail?.rating),
        year: toText(detail?.year),
        actors: Array.isArray(detail?.actors) ? detail.actors : [],
        episode_list: episodes.map((episode: any, index: number) => ({
          id: toText(episode?.id || episode?.videoFakeId || `${bookId}-${index + 1}`),
          name: toText(episode?.title || `Episode ${index + 1}`),
          cover: toText(episode?.cover || episode?.thumbnail || detail?.coverImgUrl || detail?.cover || detail?.poster),
          video_fake_id: toText(episode?.videoFakeId || episode?.id),
          episode_number: toNumber(episode?.episodeNumber || episode?.number || episode?.episode || index + 1, index + 1),
          stream_type: toText(episode?.type),
          embed_url: toText(episode?.embedUrl),
          href: toText(episode?.href),
        })),
      },
    },
  };
}

function isDirectVideoUrl(url: string) {
  return /(\.m3u8|\.mp4|\.webm|\.mov)(\?|$)/i.test(url) || url.includes(".m3u8") || url.includes(".mp4");
}

export function buildCatalogWatchPayload(data: any) {
  const streams = Array.isArray(data?.streams) ? data.streams : [];
  const rawUrl = toText(data?.videoUrl || data?.url || streams[0]?.url);
  const explicitEmbedUrl = toText(data?.embedUrl || streams.find((stream: any) => stream?.embedUrl)?.embedUrl);
  const fallbackEmbedUrl = !explicitEmbedUrl && rawUrl && !isDirectVideoUrl(rawUrl) ? rawUrl : "";
  const embedUrl = explicitEmbedUrl || fallbackEmbedUrl;
  const type = toText(data?.type || (embedUrl ? "embed" : "video")) || "video";
  const subtitles = Array.isArray(data?.subtitles) ? data.subtitles : [];
  const indoSubtitle = subtitles.find((subtitle: any) => String(subtitle?.language || "").toLowerCase().includes("id"));

  return {
    url: rawUrl,
    proxiedUrl: rawUrl && type !== "embed" && isDirectVideoUrl(rawUrl) ? proxyVideoUrl(rawUrl) : "",
    embedUrl,
    type,
    quality: toText(data?.quality || streams[0]?.quality || "auto"),
    streams,
    subtitles,
    subtitleUrl: toText(indoSubtitle?.url || indoSubtitle?.subtitle || indoSubtitle?.vtt),
  };
}
