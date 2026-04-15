"use client";

import { useFlickReelsLatest, useFlickReelsHotRank } from "@/hooks/useFlickReels";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";
import { AlertCircle } from "lucide-react";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { InfiniteFlickReelsSection } from "./InfiniteFlickReelsSection";

// Helper Component for Section Skeleton
function SectionLoader({ count = 6, titleWidth = "w-48" }: { count?: number, titleWidth?: string }) {
  return (
    <section className="space-y-4">
      {/* Title Skeleton */}
      <div className={`h-7 md:h-8 ${titleWidth} bg-white/10 rounded-lg animate-pulse`} />
      
      {/* Grid Skeleton - Matches main grid exactly */}
      <div className="media-grid">
        {Array.from({ length: count }).map((_, i) => (
          <UnifiedMediaCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function FlickReelsHome() {


  const { 
    data: latestData, 
    isLoading: loadingLatest, 
    error: errorLatest, 
    refetch: refetchLatest 
  } = useFlickReelsLatest();

  const { 
    data: hotRankData, 
    isLoading: loadingHotRank, 
    error: errorHotRank, 
    refetch: refetchHotRank 
  } = useFlickReelsHotRank();

  if (errorLatest || errorHotRank) {
    return (
      <UnifiedErrorDisplay 
        onRetry={() => {
          if (errorLatest) refetchLatest();
          if (errorHotRank) refetchHotRank();
        }} 
      />
    );
  }

  const hotRankItems = (hotRankData?.data || []).flatMap((section) => section.data || []).filter((item) => item.title && item.cover);
  const latestItems = (latestData?.data || []).flatMap((section) => section.list || []).filter((item) => item.title && item.cover);
  const hasRenderableItems = hotRankItems.length > 0 || latestItems.length > 0;

  if (!loadingLatest && !loadingHotRank && !hasRenderableItems) {
    return (
      <UnifiedErrorDisplay
        title="FlickReels Sedang Offline"
        message="Sumber FlickReels sedang tidak tersedia untuk sementara waktu. Silakan coba platform lain dulu."
        onRetry={() => {
          refetchLatest();
          refetchHotRank();
        }}
      />
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* SECTION: Hot Rank / Peringkat Populer */}
      {loadingHotRank ? (
         <SectionLoader count={6} titleWidth="w-40" />
      ) : (
        hotRankData?.data?.map((section, sIdx) => (
          <section key={section.name || sIdx} className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
                 {section.name}
               </h2>
             </div>
            
            <div className="media-grid">
              {section.data?.filter(item => item.title && item.cover).map((item, idx) => (
                <div key={`${item.playlet_id}-${idx}`} className="relative">
                   <UnifiedMediaCard
                    title={item.title}
                    cover={item.cover}
                    link={`/detail/flickreels/${item.playlet_id}`}
                    episodes={item.upload_num ? parseInt(item.upload_num) : 0}
                    views={item.hot_num}
                    topRightBadge={item.hot_num ? { text: item.hot_num, isTransparent: true } : null}
                  />
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* SECTION: Latest / Terbaru */}
      {loadingLatest ? (
         <SectionLoader count={12} titleWidth="w-48" />
      ) : (
        latestData?.data?.map((section, idx) => (
          <section key={idx} className="space-y-4">
             {section.title && (
               <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                  {section.title}
                </h2>
              </div>
             )}
             
             <div className="media-grid">
               {section.list?.filter(item => item.title && item.cover).map((item, i) => (
                 <UnifiedMediaCard
                    key={`${item.playlet_id}-${i}`}
                    title={item.title}
                    cover={item.cover}
                    link={`/detail/flickreels/${item.playlet_id}`}
                    episodes={item.upload_num ? parseInt(item.upload_num) : 0}
                    views={item.hot_num}
                    topRightBadge={null}
                  />
               ))}
             </div>
          </section>
        ))
      )}

      {/* SECTION: Infinite Scroll / Lainnya */}
      <InfiniteFlickReelsSection title="Lainnya" />

    </div>
  );
}
