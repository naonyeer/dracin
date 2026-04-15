"use client";

import { useCutadCatalogHome, type CutadCatalogItem, type CutadCatalogModule, type CutadCatalogProvider } from "@/hooks/useCutadCatalog";
import { UnifiedMediaCard } from "@/components/UnifiedMediaCard";
import { UnifiedMediaCardSkeleton } from "@/components/UnifiedMediaCardSkeleton";
import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";
import { getDetailHref } from "@/lib/provider-routes";
import { normalizeUiText } from "@/lib/display-text";
import { InfiniteCutadCatalogSection } from "@/components/catalog/InfiniteCutadCatalogSection";

function getModuleItems(module: CutadCatalogModule): CutadCatalogItem[] {
  if (module.type === "recommend" && module.items && module.items.length > 0) {
    const firstItem = module.items[0];
    if (firstItem.module_card && Array.isArray(firstItem.module_card.items)) {
      return firstItem.module_card.items as CutadCatalogItem[];
    }
  }

  return module.items || [];
}

function SectionLoader({ count = 6, titleWidth = "w-40" }: { count?: number; titleWidth?: string }) {
  return (
    <section className="space-y-4">
      <div className={`h-7 md:h-8 ${titleWidth} animate-pulse rounded-lg bg-white/10`} />
      <div className="media-grid">
        {Array.from({ length: count }).map((_, index) => (
          <UnifiedMediaCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

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

export function CutadCatalogHome({ provider, title }: { provider: CutadCatalogProvider; title: string }) {
  const { data, isLoading, error, refetch } = useCutadCatalogHome(provider);

  if (error) {
    return <UnifiedErrorDisplay title={`Gagal Memuat ${title}`} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8 pb-20">
      {isLoading ? (
        <SectionLoader count={6} titleWidth="w-40" />
      ) : (
        data?.data?.items?.map((module, moduleIndex) => {
          const items = getModuleItems(module);
          const validItems = items.filter((item) => item.title && item.cover);
          if (validItems.length === 0) return null;

          const sectionTitle = module.module_name || title;

          return (
            <section key={`${provider}-module-${moduleIndex}`} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">{normalizeUiText(sectionTitle)}</h2>
              </div>

              <div className="media-grid">
                {validItems.map((item, itemIndex) => (
                  <UnifiedMediaCard
                    key={`${provider}-${item.key}-${moduleIndex}-${itemIndex}`}
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
        })
      )}

      <InfiniteCutadCatalogSection provider={provider} title="Lainnya" />
    </div>
  );
}
