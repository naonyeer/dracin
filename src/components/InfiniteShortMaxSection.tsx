"use client";

import { useEffect, useRef } from "react";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { useInfiniteShortMaxDramas } from "@/hooks/useShortMax";
import { Loader2 } from "lucide-react";

interface InfiniteShortMaxSectionProps {
  title: string;
}

function formatCollectNum(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function InfiniteShortMaxSection({ title }: InfiniteShortMaxSectionProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteShortMaxDramas();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allDramas = data?.pages.flatMap((page) => page.data) || [];

  if (isError) {
    return (
      <section>
        <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-4">
          {title}
        </h2>
        <UnifiedErrorDisplay
          title={`Gagal Memuat ${title}`}
          message="Tidak dapat mengambil data drama."
          onRetry={() => refetch()}
        />
      </section>
    );
  }
  if (isLoading || !data) {
    return (
      <section className="space-y-5">
        {/* Title Skeleton */}
        <div className="mb-4 h-8 w-56 rounded-lg bg-white/10 animate-pulse" />
        {/* Card Grid Skeleton */}
        <div className="media-grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <UnifiedMediaCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Show error display when data failed to load or returned empty
  if (isError || (!isLoading && data && allDramas.length === 0)) {
    return (
      <section className="space-y-5">
        <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground md:text-3xl">
          {title}
        </h2>
        <UnifiedErrorDisplay
          title={`Gagal Memuat ${title}`}
          message="Tidak dapat mengambil data drama."
          onRetry={() => refetch()}
        />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground md:text-3xl">
        {title}
      </h2>

      <div className="media-grid">
        {allDramas.map((drama, index) => (
          <UnifiedMediaCard
            key={`${drama.shortPlayId}-${index}`}
            index={index}
            title={drama.title}
            cover={drama.cover}
            link={`/detail/shortmax/${drama.shortPlayId}`}
            episodes={drama.totalEpisodes}
          />
        ))}
      </div>

      {/* Loading Indicator & Trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center w-full">
        {isFetchingNextPage ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : hasNextPage ? (
          <div className="h-4" /> // Invisible trigger
        ) : (
          <p className="text-muted-foreground text-sm">Sudah mencapai akhir daftar</p>
        )}
      </div>
    </section>
  );
}
