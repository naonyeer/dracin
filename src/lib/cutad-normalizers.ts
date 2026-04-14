import type { Drama, Episode, SearchResult } from "@/types/drama";

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

export function normalizeDramaBoxDrama(item: any): Drama {
  return {
    bookId: toText(item?.bookId || item?.id),
    bookName: toText(item?.bookName || item?.title),
    coverWap: toText(item?.cover || item?.coverWap),
    cover: toText(item?.cover || item?.coverWap),
    chapterCount: toNumber(item?.chapterCount),
    introduction: toText(item?.introduction || item?.description),
    playCount: item?.playCount ? String(item.playCount) : undefined,
    corner: item?.corner,
    rankVo: item?.rankVo,
    tagNames: Array.isArray(item?.tagNames) ? item.tagNames : [],
    inLibrary: false,
  };
}

export function normalizeDramaBoxSearch(item: any): SearchResult {
  return {
    bookId: toText(item?.bookId || item?.id),
    bookName: toText(item?.bookName || item?.title),
    introduction: toText(item?.introduction || item?.description),
    author: toText(item?.author),
    cover: toText(item?.cover || item?.coverWap),
    protagonist: toText(item?.protagonist),
    tagNames: Array.isArray(item?.tagNames)
      ? item.tagNames
      : Array.isArray(item?.tags)
        ? item.tags.map((tag: any) => String(tag))
        : [],
    inLibrary: false,
  };
}

export function normalizeDramaBoxDetail(bookId: string, detail: any) {
  return {
    bookId,
    bookName: toText(detail?.bookName),
    coverWap: toText(detail?.cover),
    chapterCount: toNumber(detail?.chapterCount ?? detail?.chapters?.length),
    introduction: toText(detail?.introduction),
    tags: [],
    tagV3s: [],
    inLibrary: false,
  };
}

export function normalizeDramaBoxEpisodes(bookId: string, detail: any): Episode[] {
  const cover = toText(detail?.cover);
  const chapters = Array.isArray(detail?.chapters) ? detail.chapters : [];

  return chapters.map((chapter: any, index: number) => {
    const chapterId = toText(chapter?.id);
    const chapterIndex = toNumber(chapter?.index, index + 1);
    const chapterName = toText(chapter?.chapterName || chapter?.name || `Episode ${chapterIndex}`);
    const streamUrl = `/api/dramabox/watch?bookId=${encodeURIComponent(bookId)}&chapterId=${encodeURIComponent(chapterId)}`;

    return {
      chapterId,
      chapterIndex,
      isCharge: 0,
      chapterName,
      chapterImg: cover,
      chargeChapter: false,
      useMultiSubtitle: 0,
      subLanguageVoList: [],
      cdnList: [
        {
          cdnDomain: "local",
          isDefault: 1,
          videoPathList: [
            {
              quality: 720,
              videoPath: streamUrl,
              isDefault: 1,
              isVipEquity: 0,
            },
          ],
        },
      ],
    } satisfies Episode;
  });
}

export function normalizeReelShortBook(item: any) {
  const slug = toText(item?.id || item?.filteredTitle || item?.bookId);

  return {
    book_id: slug,
    book_type: 1,
    book_title: toText(item?.title),
    book_pic: toText(item?.cover),
    special_desc: toText(item?.description),
    chapter_count: toNumber(item?.episode || item?.totalEpisodes),
    theme: Array.isArray(item?.tags) ? item.tags : [],
    filtered_title: toText(item?.filteredTitle || item?.id),
  };
}

export function normalizeMeloloBook(item: any) {
  return {
    book_id: toText(item?.id),
    book_name: toText(item?.title),
    thumb_url: toText(item?.cover),
    abstract: toText(item?.description),
    serial_count: toNumber(item?.totalEpisodes),
    popularity: item?.popularity ? String(item.popularity) : undefined,
  };
}

export function normalizeMeloloDetail(detail: any) {
  const episodes = Array.isArray(detail?.episodes) ? detail.episodes : [];

  return {
    code: 0,
    data: {
      video_data: {
        series_id_str: toText(detail?.fakeId || detail?.id),
        series_title: toText(detail?.title),
        series_cover: toText(detail?.coverImgUrl),
        series_intro: toText(detail?.introduce),
        episode_cnt: toNumber(detail?.episodeCount ?? episodes.length, episodes.length),
        video_list: episodes.map((episode: any, index: number) => ({
          vid: toText(episode?.videoFakeId || episode?.id),
          vid_index: toNumber(episode?.episodeNumber, index + 1),
          title: toText(episode?.title || `Episode ${index + 1}`),
          cover: toText(episode?.cover || episode?.thumbnail || detail?.coverImgUrl),
          episode_cover: toText(episode?.thumbnail || episode?.cover || detail?.coverImgUrl),
          duration: toNumber(episode?.duration),
          digged_count: 0,
          comment_count: 0,
        })),
      },
    },
  };
}

export function normalizeFreeReelsItem(item: any) {
  return {
    key: toText(item?.key || item?.id),
    title: toText(item?.title),
    cover: toText(item?.cover),
    desc: toText(item?.desc || item?.description),
    episode_count: toNumber(item?.episodeCount),
    follow_count: 0,
    content_tags: Array.isArray(item?.tags) ? item.tags : [],
  };
}

export function buildFreeReelsModules(items: any[], moduleName: string) {
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

export function normalizeFreeReelsDetail(detail: any) {
  const episodes = Array.isArray(detail?.episodes) ? detail.episodes : [];

  return {
    data: {
      info: {
        id: toText(detail?.fakeId || detail?.id),
        key: toText(detail?.fakeId || detail?.id),
        name: toText(detail?.title),
        title: toText(detail?.title),
        cover: toText(detail?.coverImgUrl),
        follow_count: 0,
        episode_list: episodes.map((episode: any, index: number) => ({
          id: toText(episode?.id || episode?.videoFakeId),
          name: toText(episode?.title || `Episode ${index + 1}`),
          video_fake_id: toText(episode?.videoFakeId || episode?.id),
          episode_number: toNumber(episode?.episodeNumber, index + 1),
          cover: toText(episode?.cover || episode?.thumbnail || detail?.coverImgUrl),
          original_audio_language: "",
          subtitle_list: [],
          video_url: "",
          m3u8_url: "",
          external_audio_h264_m3u8: "",
          external_audio_h265_m3u8: "",
        })),
      },
    },
  };
}
