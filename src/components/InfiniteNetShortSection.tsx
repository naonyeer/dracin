"use client";

import { useEffect, useRef } from "react";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { useInfiniteNetShortDramas } from "@/hooks/useNetShort";
import { Loader2 } from "lucide-react";

interface InfiniteNetShortSectionProps {
  title: string;
}

export function InfiniteNetShortSection({ title }: InfiniteNetShortSectionProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteNetShortDramas();

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

  // Flatten pages into a single array of dramas
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
        <div className="mb-4 h-8 w-56 rounded-lg bg-white/10 animate-pulse" />
        <div className="media-grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <UnifiedMediaCardSkeleton key={i} />
          ))}
        </div>
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
            link={`/detail/netshort/${drama.shortPlayId}`}
            episodes={drama.totalEpisodes}
            views={drama.heatScore}
            topLeftBadge={drama.scriptName ? {
              text: drama.scriptName,
              color: "#E52E2E"
            } : null}
            topRightBadge={drama.heatScore ? {
              text: drama.heatScore,
              isTransparent: true
            } : null}
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
