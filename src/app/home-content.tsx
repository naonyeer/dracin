"use client";

import { useMemo } from "react";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DramaSection } from "@/components/DramaSection";
import { ReelShortSection } from "@/components/ReelShortSection";
import { MeloloHome } from "@/components/MeloloHome";
import { FreeReelsHome } from "@/components/FreeReelsHome";
import { useLatestDramas, useTrendingDramas, useDubindoDramas } from "@/hooks/useDramas";
import { usePlatform } from "@/hooks/usePlatform";
import { InfiniteDramaSection } from "@/components/InfiniteDramaSection";
import { SpotlightHero } from "@/components/HomeHeroBanner";
import { useReelShortHomepage } from "@/hooks/useReelShort";
import { useMeloloLatest, useMeloloTrending } from "@/hooks/useMelolo";
import { useFreeReelsHome } from "@/hooks/useFreeReels";

type HeroSpotlight = {
  id: string;
  title: string;
  description: string;
  backdrop?: string;
  poster: string;
  episodes?: number;
  viewsValue?: number;
  detailHref: string;
  watchHref: string;
  isFeatured?: boolean;
};

const HERO_VIEW_THRESHOLD = 100000;
const REELSHORT_PREFERRED_SPOTLIGHT = "kutebas takdir dengan darah";

function parseViewCount(value: string | number | undefined | null): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;

  const normalized = String(value).trim().toLowerCase().replace(/,/g, "");
  const matched = normalized.match(/(\d+(?:\.\d+)?)([km]?)/i);
  if (!matched) return 0;

  const base = Number(matched[1]);
  if (Number.isNaN(base)) return 0;

  if (matched[2] === "m") return Math.round(base * 1000000);
  if (matched[2] === "k") return Math.round(base * 1000);
  return Math.round(base);
}

function formatViewCount(value?: number): string | undefined {
  if (!value || value <= 0) return undefined;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

function normalizeDescription(description: string | undefined, episodes?: number): string {
  const text = description?.trim();
  if (text) return text;
  if (episodes && episodes > 0) return `${episodes} episode siap ditonton sekarang.`;
  return "";
}

function toUnique(items: HeroSpotlight[]): HeroSpotlight[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return Boolean(item.title && item.poster);
  });
}

function selectSpotlight(items: HeroSpotlight[]): HeroSpotlight | null {
  if (items.length === 0) return null;

  const featured = items.find((item) => item.isFeatured === true);
  if (featured) return featured;

  const highViews = items
    .filter((item) => (item.viewsValue ?? 0) >= HERO_VIEW_THRESHOLD)
    .sort((a, b) => (b.viewsValue ?? 0) - (a.viewsValue ?? 0));

  if (highViews.length > 0) return highViews[0];
  return items[0];
}

export default function HomeContent() {
  const { isDramaBox, isReelShort, isMelolo, isFreeReels, currentPlatform, platformInfo } = usePlatform();

  const { data: latestDramas, isLoading: loadingLatest, error: errorLatest, refetch: refetchLatest } = useLatestDramas();
  const { data: trendingDramas, isLoading: loadingTrending, error: errorTrending, refetch: refetchTrending } = useTrendingDramas();
  const { data: dubindoDramas, isLoading: loadingDubindo, error: errorDubindo, refetch: refetchDubindo } = useDubindoDramas();
  const { data: reelShortHome } = useReelShortHomepage();
  const { data: meloloTrending } = useMeloloTrending();
  const { data: meloloLatest } = useMeloloLatest();
  const { data: freeReelsHome } = useFreeReelsHome();

  const heroSpotlight = useMemo(() => {
    const dramaBoxCandidates = toUnique(
      [...(trendingDramas || []), ...(latestDramas || []), ...(dubindoDramas || [])].map((movie) => ({
        id: `dramabox-${movie.bookId}`,
        title: movie.bookName,
        description: normalizeDescription(movie.introduction, movie.chapterCount),
        backdrop: movie.coverWap || movie.cover || "",
        poster: movie.coverWap || movie.cover || "",
        episodes: movie.chapterCount,
        viewsValue: parseViewCount(movie.playCount),
        detailHref: `/detail/dramabox/${movie.bookId}`,
        watchHref: `/watch/dramabox/${movie.bookId}`,
        isFeatured: Boolean(movie.corner || movie.rankVo),
      }))
    );

    const reelShortBooks = reelShortHome?.data?.lists?.flatMap((list) => list.books || []) || [];
    const reelShortSeedCandidates = toUnique(
      reelShortBooks.map((movie) => ({
        id: `reelshort-${movie.book_id}`,
        title: movie.book_title,
        description: normalizeDescription(movie.special_desc, movie.chapter_count),
        backdrop: movie.book_pic || "",
        poster: movie.book_pic || "",
        episodes: movie.chapter_count,
        viewsValue: parseViewCount(movie.read_count || movie.collect_count),
        detailHref: `/detail/reelshort/${movie.book_id}`,
        watchHref: `/watch/reelshort/${movie.book_id}`,
        isFeatured: movie.book_mark?.text?.toLowerCase().includes("featured") || false,
      }))
    );

    const reelShortCandidates = reelShortSeedCandidates.map((movie, index) => {
      const normalizedTitle = movie.title.toLowerCase();
      const isPreferredSpotlight = normalizedTitle.includes(REELSHORT_PREFERRED_SPOTLIGHT);

      return {
        ...movie,
        isFeatured: isPreferredSpotlight || (reelShortSeedCandidates.length > 1 ? index === 1 : index === 0),
      };
    });

    const meloloSeedCandidates = toUnique(
      [...(meloloTrending?.books || []), ...(meloloLatest?.books || [])].map((movie) => ({
        id: `melolo-${movie.book_id}`,
        title: movie.book_name,
        description: normalizeDescription(movie.abstract, movie.serial_count),
        backdrop: movie.backdrop || movie.poster || movie.thumb_url || "",
        poster: movie.poster || movie.backdrop || movie.thumb_url || "",
        episodes: movie.serial_count,
        viewsValue: parseViewCount(movie.popularity),
        detailHref: `/detail/melolo/${movie.book_id}`,
        watchHref: `/detail/melolo/${movie.book_id}`,
        isFeatured: false,
      }))
    );

    const meloloCandidates = meloloSeedCandidates.map((movie, index) => ({
      ...movie,
      isFeatured: meloloSeedCandidates.length > 1 ? index === 1 : index === 0,
    }));

    const freeReelsModules = freeReelsHome?.data?.items || [];
    const freeReelsItems = freeReelsModules.flatMap((module) => {
      if (module.type === "recommend" && module.items?.[0]?.module_card?.items) {
        return module.items[0].module_card.items;
      }
      return module.items || [];
    });

    const freeReelsCandidates = toUnique(
      freeReelsItems.map((movie) => ({
        id: `freereels-${movie.key}`,
        title: movie.title,
        description: normalizeDescription(movie.desc, movie.episode_count),
        backdrop: movie.cover || "",
        poster: movie.cover || "",
        episodes: movie.episode_count,
        viewsValue: parseViewCount(movie.follow_count),
        detailHref: `/detail/freereels/${movie.key}`,
        watchHref: `/watch/freereels/${movie.key}`,
        isFeatured: (Array.isArray(movie.content_tags) ? movie.content_tags : []).some((tag: string) => tag.toLowerCase().includes("featured")),
      }))
    );

    const activeCandidates =
      currentPlatform === "dramabox"
        ? dramaBoxCandidates
        : currentPlatform === "reelshort"
          ? reelShortCandidates
          : currentPlatform === "melolo"
            ? meloloCandidates
            : freeReelsCandidates;

    return selectSpotlight(activeCandidates);
  }, [currentPlatform, trendingDramas, latestDramas, dubindoDramas, reelShortHome, meloloTrending, meloloLatest, freeReelsHome]);

  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto space-y-6 px-4 pt-5 md:space-y-8 md:px-10 md:pt-7 lg:px-12">
        {heroSpotlight ? (
          <SpotlightHero
            platformName={platformInfo.name}
            title={heroSpotlight.title}
            description={heroSpotlight.description}
            backdrop={heroSpotlight.backdrop}
            poster={heroSpotlight.poster}
            episodes={heroSpotlight.episodes}
            plays={formatViewCount(heroSpotlight.viewsValue)}
            watchHref={heroSpotlight.watchHref}
            detailHref={heroSpotlight.detailHref}
          />
        ) : (
          <section className="h-[320px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
        )}

        <section className="relative z-[90] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,35,0.78)_0%,rgba(9,13,24,0.88)_100%)] backdrop-blur-xl">
          <PlatformSelector />
        </section>
      </div>

      {isDramaBox && (
        <div id="content-start" className="container mx-auto space-y-10 px-4 py-8 md:space-y-12 md:px-10 md:py-10 lg:px-12">
          <DramaSection
            title="Sedang Trending"
            subtitle="Judul yang sedang ramai diputar minggu ini"
            dramas={trendingDramas}
            isLoading={loadingTrending}
            error={!!errorTrending}
            onRetry={() => refetchTrending()}
          />
          <DramaSection
            title="Rekomendasi Untukmu"
            subtitle="Kompilasi cerita cepat dengan engagement tinggi"
            dramas={dubindoDramas}
            isLoading={loadingDubindo}
            error={!!errorDubindo}
            onRetry={() => refetchDubindo()}
          />
          <DramaSection
            title="Dub Indo Populer"
            subtitle="Koleksi episode baru yang nyaman ditonton"
            dramas={latestDramas}
            isLoading={loadingLatest}
            error={!!errorLatest}
            onRetry={() => refetchLatest()}
          />

          <InfiniteDramaSection title="Jelajah Tanpa Batas" />
        </div>
      )}

      {isReelShort && (
        <div id="content-start" className="container mx-auto space-y-10 px-4 py-8 md:space-y-12 md:px-10 md:py-10 lg:px-12">
          <ReelShortSection />
        </div>
      )}

      {isMelolo && (
        <div id="content-start" className="container mx-auto space-y-10 px-4 py-8 md:space-y-12 md:px-10 md:py-10 lg:px-12">
          <MeloloHome />
        </div>
      )}

      {isFreeReels && (
        <div id="content-start" className="container mx-auto space-y-10 px-4 py-8 md:space-y-12 md:px-10 md:py-10 lg:px-12">
          <FreeReelsHome />
        </div>
      )}
    </main>
  );
}
