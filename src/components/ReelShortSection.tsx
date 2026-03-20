"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Play, Flame } from "lucide-react";
import { useReelShortHomepage } from "@/hooks/useReelShort";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { InfiniteReelShortSection } from "./InfiniteReelShortSection";
import type { ReelShortBook } from "@/types/reelshort";

export function ReelShortSection() {
  const { data, isLoading, error, refetch } = useReelShortHomepage();

  // Group content by sections
  const sections = useMemo(() => {
    if (!data?.data?.lists) return { bookGroups: [] };

    const tabs = data.data.tab_list || [];
    const popularTab = tabs.find((t) => t.tab_name === "POPULER") || tabs[0];
    
    if (!popularTab) return { bookGroups: [] };

    const tabLists = data.data.lists.filter((list) => list.tab_id === popularTab.tab_id);
    
    const bookGroups: { title: string; books: ReelShortBook[] }[] = [];
    
    tabLists.forEach((list, index) => {
      if (list.books && list.books.length > 0) {
        const sectionNames = ["Populer", "Terbaru", "Trending", "Untuk Kamu"];
        const title = sectionNames[index] || `Section ${index + 1}`;
        bookGroups.push({ title, books: list.books });
      }
    });

    return { bookGroups };
  }, [data]);

  if (error) {
    return (
      <UnifiedErrorDisplay 
        title="Gagal Memuat ReelShort"
        message="Terjadi kesalahan saat mengambil data dari server."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <SectionSkeleton key={i} />
        ))}
      </div>
    );
  }

  const { bookGroups } = sections;

  return (
    <div className="space-y-10">
      {/* Book Sections - Grid Layout */}
      {bookGroups.map((group, index) => (
        <section key={index}>
          <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {group.title}
          </h2>

          <div className="media-grid">
            {group.books
              .filter((book) => book.book_id && book.book_pic)
              .slice(0, 16)
              .map((book, index) => (
                <UnifiedMediaCard 
                  key={book.book_id} 
                  index={index}
                  title={book.book_title}
                  cover={book.book_pic}
                  link={`/detail/reelshort/${book.book_id}`}
                  episodes={book.chapter_count}
                  topLeftBadge={book.book_mark?.text ? {
                    text: book.book_mark.text,
                    color: book.book_mark.color || "#E52E2E",
                    textColor: book.book_mark.text_color
                  } : null}
                  topRightBadge={book.rank_level ? {
                    text: book.rank_level,
                    isTransparent: true
                  } : null}
                />
              ))}
          </div>
        </section>
      ))}

      {/* Infinite Scroll Section */}
      <InfiniteReelShortSection title="Lainnya" />

    </div>
  );
}

function SectionSkeleton() {
  return (
    <div>
      <div className="mb-4 h-7 w-40 animate-pulse rounded bg-muted/50" />
      <div className="media-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] rounded-lg bg-muted/50 animate-pulse" />
            <div className="mt-1.5 h-3 bg-muted/50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
