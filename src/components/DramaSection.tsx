"use client";

import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton"; // Import skeleton
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import type { Drama } from "@/types/drama";

interface DramaSectionProps {
  title: string;
  subtitle?: string;
  dramas?: Drama[];
  isLoading?: boolean;
  error?: boolean;    // New prop
  onRetry?: () => void; // New prop
}

export function DramaSection({ title, subtitle, dramas, isLoading, error, onRetry }: DramaSectionProps) {
  if (error) {
    return (
      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {title}
          </h2>
          {subtitle ? <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p> : null}
        </div>
        <UnifiedErrorDisplay 
          title={`Gagal Memuat ${title}`}
          message="Tidak dapat mengambil data drama."
          onRetry={onRetry}
        />
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="space-y-5">
        {/* Title Skeleton */}
        <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse" />
        
        {/* Grid Skeleton */}
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
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p> : null}
      </div>

      <div className="media-grid">
        {dramas?.slice(0, 16).map((drama, index) => {
          // Normalize badge color: If text is "Terpopuler", force RED to match ReelShort/NetShort
          const isPopular = drama.corner?.name?.toLowerCase().includes("populer");
          const badgeColor = isPopular ? "#E52E2E" : (drama.corner?.color || "#e5a00d");

          return (
            <UnifiedMediaCard 
              key={drama.bookId || `drama-${index}`} 
              index={index}
              title={drama.bookName}
              cover={drama.coverWap || drama.cover || ""}
              link={`/detail/dramabox/${drama.bookId}`}
              episodes={drama.chapterCount}
              views={drama.playCount}
              topLeftBadge={drama.corner ? {
                text: drama.corner.name,
                color: badgeColor
              } : null}
              topRightBadge={drama.rankVo ? {
                text: drama.rankVo.hotCode,
                isTransparent: true
              } : null}
            />
          );
        })}
      </div>
    </section>
  );
}
