"use client";

import { UnifiedMediaCard } from "@/components/UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "@/components/UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";
import { getDetailHref } from "@/lib/provider-routes";
import { normalizeUiText } from "@/lib/display-text";
import { useCutadCatalogDetail, useInfiniteCutadCatalog, type CutadCatalogItem, type CutadCatalogProvider } from "@/hooks/useCutadCatalog";

function getTopLeftBadge(item: CutadCatalogItem) {
  const firstTag = Array.isArray(item.content_tags) ? item.content_tags[0] : undefined;
  if (!firstTag) return null;

  return {
    text: normalizeUiText(firstTag),
    color: "#E52E2E",
  };
}

function getTopRightBadge(item: CutadCatalogItem) {
  const firstMeta = Array.isArray(item.metadata) ? item.metadata[0] : undefined;
  if (!firstMeta) return null;

  return {
    text: normalizeUiText(firstMeta),
    isTransparent: true,
  };
}

export function InfiniteCutadCatalogSection({ provider, title }: { provider: CutadCatalogProvider; title: string }) {
  const { data, isLoading, error, refetch } = useInfiniteCutadCatalog(provider);

  const items =
    data?.pages.flatMap((page) => page.data?.items || []).filter((item) => item.title && item.cover) || [];

  if (error) {
    return (
      <UnifiedErrorDisplay
        title={`Gagal Memuat ${title}`}
        message="Tidak dapat mengambil data katalog."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">{title}</h2>
        <div className="media-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <UnifiedMediaCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">{title}</h2>
      <div className="media-grid">
        {items.map((item, index) => (
          <UnifiedMediaCard
            key={`${provider}-${item.key}-${index}`}
            title={item.title}
            cover={item.cover}
            link={getDetailHref(provider, item.key)}
            episodes={item.episode_count || 0}
            topLeftBadge={getTopLeftBadge(item)}
            topRightBadge={getTopRightBadge(item)}
          />
        ))}
      </div>
    </section>
  );
}
