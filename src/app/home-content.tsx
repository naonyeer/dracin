"use client";

import { Compass, Flame, Layers3, Sparkles } from "lucide-react";
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

  const platformCopy: Record<string, { eyebrow: string; title: string; description: string; stats: string[] }> = {
    dramabox: {
      eyebrow: "Lagi rame",
      title: "Biar nyari tontonan nggak muter-muter.",
      description: "Yang ramai saya taruh di depan, lanjut dub indo, lalu rilisan baru. Jadi pas buka beranda rasanya lebih enak dilihat dan nggak kayak daftar asal numpuk.",
      stats: ["Hot right now", "Dub focus", "Infinite browse"],
    },
    reelshort: {
      eyebrow: "Sedang naik",
      title: "Judul yang lagi sering lewat saya taruh di depan dulu.",
      description: "Buka halaman langsung ketemu yang lagi ramai, habis itu baru lanjut scroll yang lain.",
      stats: ["Banner-first", "Fast discovery", "Swipe mood"],
    },
    shortmax: {
      eyebrow: "Pilihan cepat",
      title: "ShortMax tetap nyambung sama suasana desdracin.",
      description: "Walau sumbernya beda, tampilannya tetap dibuat santai dan gampang dipakai.",
      stats: ["Sharper hierarchy", "Curated browse", "Direct watch"],
    },
    netshort: {
      eyebrow: "Cepat pilih",
      title: "NetShort saya bikin buat yang maunya langsung nemu tontonan.",
      description: "Masuk, lihat yang menarik, lalu pindah nonton tanpa banyak ribet.",
      stats: ["Quick scan", "High tempo", "Fresh order"],
    },
    melolo: {
      eyebrow: "Lebih rapi",
      title: "Melolo saya bikin lebih adem dilihat.",
      description: "Tampilannya nggak terlalu ramai, jadi lebih enak buat pilih judul satu-satu.",
      stats: ["Calmer layout", "Unified tone", "Less clutter"],
    },
    flickreels: {
      eyebrow: "Lagi naik",
      title: "FlickReels cocok buat cari cerita yang lagi panas.",
      description: "Susunannya dibuat simpel biar tinggal lihat cover, klik, lalu lanjut nonton.",
      stats: ["Trending cues", "Brand voice", "Refined browse"],
    },
    freereels: {
      eyebrow: "Bisa langsung gas",
      title: "FreeReels saya bikin ringan dan gampang dibuka.",
      description: "Fokusnya biar kamu cepat nemu tontonan tanpa harus ngadepin tampilan yang kaku.",
      stats: ["Open access", "Premium shell", "Distinct identity"],
    },
  };

  const activeCopy = platformCopy[currentPlatform];

  return (
    <main className="min-h-screen pt-16">
      <section className="container mx-auto px-4 pt-6 md:pt-8">
        <div className="editorial-panel relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-12 top-0 h-44 w-44 rounded-full bg-primary/18 blur-3xl" />
            <div className="absolute right-0 top-10 h-36 w-36 rounded-full bg-secondary/18 blur-3xl" />
          </div>
          <div className="relative grid gap-8 px-5 py-6 md:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)] md:px-8 md:py-8">
            <div>
              <div className="section-kicker mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                {activeCopy.eyebrow}
              </div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[0.95] text-foreground md:text-6xl">
                {activeCopy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                {activeCopy.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {activeCopy.stats.map((stat) => (
                  <span key={stat} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    {stat}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              <div className="ambient-panel p-4">
                <Compass className="mb-3 h-5 w-5 text-primary" />
                <p className="surface-label">Tentang</p>
                <p className="mt-2 text-xl font-bold text-foreground">desdracin</p>
                <p className="mt-2 text-sm text-muted-foreground">Tempat buat ngumpulin short drama biar lebih gampang dicari.</p>
              </div>
              <div className="ambient-panel p-4">
                <Flame className="mb-3 h-5 w-5 text-primary" />
                <p className="surface-label">Sumber</p>
                <p className="mt-2 text-xl font-bold text-foreground">{platformInfo.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">Tinggal ganti platform kalau mau lihat katalog yang beda.</p>
              </div>
              <div className="ambient-panel p-4">
                <Layers3 className="mb-3 h-5 w-5 text-primary" />
                <p className="surface-label">Susunan</p>
                <p className="mt-2 text-xl font-bold text-foreground">Lebih enak lihat</p>
                <p className="mt-2 text-sm text-muted-foreground">Urutannya saya bikin ulang biar lebih natural pas dibuka.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-40 mt-6 border-y border-white/10 bg-background/70 backdrop-blur-2xl">
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
          <section className="editorial-panel px-5 py-5 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker">pilihan awal</p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Yang lagi ramai saya taruh paling depan.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Jadi pas buka halaman, kamu bisa langsung lihat yang seru dulu, baru lanjut ke dub indo dan rilisan baru.
              </p>
            </div>
          </section>
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
