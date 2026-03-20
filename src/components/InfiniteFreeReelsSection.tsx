"use client";

import { useEffect, useRef } from "react";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { useInfiniteFreeReelsDramas } from "@/hooks/useFreeReels";
import { Loader2 } from "lucide-react";

interface InfiniteFreeReelsSectionProps {
  title: string;
}

export function InfiniteFreeReelsSection({ title }: InfiniteFreeReelsSectionProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteFreeReelsDramas();

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

  // Flatten pages
  const allDramas = data?.pages.flatMap((page) => 
    (page.data?.items || []).filter(item => 
        item.title && 
        item.cover
    )
  ) || [];

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

  // Show skeleton when loading or no data
  if (isLoading || !data) {
    return (
      <section className="space-y-5">
        <div className="mb-4 h-8 w-56 rounded-lg bg-white/10 animate-pulse" />
        <div className="media-grid">
          {Array.from({ length: 12 }).map((_, i) => (
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
        {allDramas.map((item, index) => (
          <UnifiedMediaCard 
            key={`${item.key}-${index}`} 
            index={index}
            title={item.title}
            cover={item.cover}
            link={`/detail/freereels/${item.key}`}
            episodes={item.episode_count || 0}
            views={item.follow_count ? `${(item.follow_count / 1000).toFixed(1)}k` : undefined}
            topRightBadge={item.follow_count ? { text: `${(item.follow_count / 1000).toFixed(1)}k`, isTransparent: true } : null}
            topLeftBadge={null}
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
