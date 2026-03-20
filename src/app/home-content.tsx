"use client";

import { Play } from "lucide-react";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DramaSection } from "@/components/DramaSection";
import { ReelShortSection } from "@/components/ReelShortSection";
import { ShortMaxHome } from "@/components/ShortMaxHome";
import { NetShortHome } from "@/components/NetShortHome";
import { MeloloHome } from "@/components/MeloloHome";
import { FlickReelsHome } from "@/components/FlickReelsHome";
import { FreeReelsHome } from "@/components/FreeReelsHome";
import { useLatestDramas, useTrendingDramas, useDubindoDramas } from "@/hooks/useDramas";
import { usePlatform } from "@/hooks/usePlatform";
import { InfiniteDramaSection } from "@/components/InfiniteDramaSection";

export default function HomeContent() {
  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, currentPlatform, platformInfo } = usePlatform();

  // Fetch data for all DramaBox sections
  // const { data: popularDramas, isLoading: loadingPopular, error: errorPopular, refetch: refetchPopular } = useForYouDramas(); // REMOVED as requested (replaced by infinite scroll)
  const { data: latestDramas, isLoading: loadingLatest, error: errorLatest, refetch: refetchLatest } = useLatestDramas();
  const { data: trendingDramas, isLoading: loadingTrending, error: errorTrending, refetch: refetchTrending } = useTrendingDramas();
  const { data: dubindoDramas, isLoading: loadingDubindo, error: errorDubindo, refetch: refetchDubindo } = useDubindoDramas();

  const platformCopy: Record<string, { title: string; stats: string[] }> = {
    dramabox: {
      title: "DramaBox",
      stats: ["Trending", "Dub Indo", "Rilis Baru"],
    },
    reelshort: {
      title: "ReelShort",
      stats: ["Populer", "Terbaru", "Swipe Mood"],
    },
    shortmax: {
      title: "ShortMax",
      stats: ["Pilihan Cepat", "Curated", "Direct Watch"],
    },
    netshort: {
      title: "NetShort",
      stats: ["Quick Scan", "Fresh Order", "Direct Watch"],
    },
    melolo: {
      title: "Melolo",
      stats: ["Rapi", "Santai", "Direct Watch"],
    },
    flickreels: {
      title: "FlickReels",
      stats: ["Hot Rank", "Fresh Picks", "Direct Watch"],
    },
    freereels: {
      title: "FreeReels",
      stats: ["Open Access", "Anime", "For You"],
    },
  };

  const activeCopy = platformCopy[currentPlatform];

  return (
    <main className="min-h-screen pt-16">
      <section className="container mx-auto px-4 pt-3 md:pt-4">
        <div className="editorial-panel relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-primary/16 blur-3xl" />
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-secondary/16 blur-3xl" />
          </div>
          <div className={`relative flex flex-col px-4 py-4 md:px-6 md:py-4 ${isDramaBox ? "gap-2" : "gap-3 md:flex-row md:items-center md:justify-between"}`}>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-none text-foreground md:text-3xl">
                {activeCopy.title}
              </h1>
            </div>

            {!isDramaBox && (
              <div className="flex flex-wrap gap-2 md:max-w-[560px] md:justify-end">
                <div className="ambient-panel flex min-w-[156px] items-center gap-2 px-3 py-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/14 text-primary">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <p className="surface-label">Sumber aktif</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{platformInfo.name}</p>
                  </div>
                </div>
                {activeCopy.stats.map((stat) => (
                  <span key={stat} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    {stat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-40 mt-3 border-y border-white/10 bg-background/70 backdrop-blur-2xl">
        <div className="container mx-auto">
          <div className="px-4 pt-4">
              <p className="surface-label">
                 Pilih sumber
              </p>
          </div>
          <PlatformSelector />
        </div>
      </div>

      {/* DramaBox Content - Multiple Sections */}
      {isDramaBox && (
        <div className="container mx-auto space-y-8 px-4 py-8">
          <DramaSection
            title="Sedang Meledak"
            dramas={trendingDramas}
            isLoading={loadingTrending}
            error={!!errorTrending}
            onRetry={() => refetchTrending()}
          />
          <DramaSection
            title="Pilihan Dub Indo"
            dramas={dubindoDramas}
            isLoading={loadingDubindo}
            error={!!errorDubindo}
            onRetry={() => refetchDubindo()}
          />
          <DramaSection
            title="Rilis Baru"
            dramas={latestDramas}
            isLoading={loadingLatest}
            error={!!errorLatest}
            onRetry={() => refetchLatest()}
          />

          <InfiniteDramaSection title="Jelajah Tanpa Batas" />
        </div>
      )}

      {/* ReelShort Content - Multiple Sections */}
      {isReelShort && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <ReelShortSection />
        </div>
      )}

      {/* ShortMax Content */}
      {isShortMax && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <ShortMaxHome />
        </div>
      )}

      {/* NetShort Content */}
      {isNetShort && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <NetShortHome />
        </div>
      )}

      {/* Melolo Content */}
      {isMelolo && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <MeloloHome />
        </div>
      )}

      {/* FlickReels Content */}
      {isFlickReels && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <FlickReelsHome />
        </div>
      )}

      {/* FreeReels Content */}
      {isFreeReels && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <FreeReelsHome />
        </div>
      )}
    </main>
  );
}
