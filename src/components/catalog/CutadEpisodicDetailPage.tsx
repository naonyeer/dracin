"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Play } from "lucide-react";
import { normalizeUiText } from "@/lib/display-text";
import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlatformInfo, type Platform } from "@/lib/provider-registry";
import { getWatchHref } from "@/lib/provider-routes";
import { useCutadCatalogDetail, type CutadCatalogProvider } from "@/hooks/useCutadCatalog";

export function CutadEpisodicDetailPage({ provider }: { provider: CutadCatalogProvider }) {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const { data, isLoading, error, refetch } = useCutadCatalogDetail(provider, bookId);
  const platformInfo = getPlatformInfo(provider as Platform);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !data || !data.data) {
    return (
      <div className="min-h-screen px-4 pt-24">
        <UnifiedErrorDisplay
          title={`Gagal Memuat ${platformInfo.name}`}
          message="Konten tidak ditemukan atau terjadi kesalahan server."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const drama = data.data;
  const normalizedTitle = normalizeUiText(drama.title);
  const normalizedDescription = normalizeUiText(drama.desc || "Tidak ada deskripsi.");
  const normalizedTags = [...(drama.content_tags || []), ...(drama.metadata || [])].map((tag) => normalizeUiText(tag));
  const watchHref = drama.episode_count > 0 ? `${getWatchHref(provider, { id: bookId })}?ep=1` : getWatchHref(provider, { id: bookId });
  const mediaLabel = drama.episode_count > 0 ? `${drama.episode_count} Episode` : platformInfo.shell === "movie" ? "Film / Series" : "Tayangan";

  return (
    <main className="min-h-screen pt-20">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img src={drama.cover} alt="" className="h-full w-full scale-110 object-cover opacity-20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Kembali</span>
          </button>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            <div className="relative group">
              <img src={drama.cover} alt={normalizedTitle} className="mx-auto w-full max-w-[300px] rounded-2xl shadow-2xl" />
              <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-gradient-to-t from-background/80 to-transparent pb-6 opacity-0 transition-opacity group-hover:opacity-100">
                <Link href={watchHref} className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105">
                  <Play className="h-5 w-5 fill-current" />
                  Tonton Sekarang
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="gradient-text mb-4 font-display text-3xl font-bold text-white md:text-4xl">{normalizedTitle}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Play className="h-4 w-4" />
                    <span>{mediaLabel}</span>
                  </div>
                </div>

                {normalizedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {normalizedTags.map((tag, index) => (
                      <span key={`${tag}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass rounded-xl p-4">
                <h3 className="mb-2 font-semibold text-foreground">Sinopsis</h3>
                <p className="leading-relaxed text-muted-foreground">{normalizedDescription}</p>
              </div>

              <Link href={watchHref} className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105" style={{ background: "var(--gradient-primary)" }}>
                <Play className="h-5 w-5 fill-current" />
                Mulai Menonton
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
          <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[300px] rounded-2xl md:mx-0" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
