"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useSearchDramas } from "@/hooks/useDramas";
import { useReelShortSearch } from "@/hooks/useReelShort";
import { useMeloloSearch } from "@/hooks/useMelolo";
import { useFreeReelsSearch } from "@/hooks/useFreeReels";
import { usePlatform } from "@/hooks/usePlatform";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname } from "next/navigation";
import { normalizeUiText } from "@/lib/display-text";

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  const { isDramaBox, isReelShort, isMelolo, isFreeReels, platformInfo } = usePlatform();

  const { data: dramaBoxResults, isLoading: isSearchingDramaBox } = useSearchDramas(isDramaBox ? normalizedQuery : "");
  const { data: reelShortResults, isLoading: isSearchingReelShort } = useReelShortSearch(isReelShort ? normalizedQuery : "");
  const { data: meloloResults, isLoading: isSearchingMelolo } = useMeloloSearch(isMelolo ? normalizedQuery : "");
  const { data: freeReelsResults, isLoading: isSearchingFreeReels } = useFreeReelsSearch(isFreeReels ? normalizedQuery : "");

  const isSearching = isDramaBox
    ? isSearchingDramaBox
    : isReelShort
      ? isSearchingReelShort
      : isMelolo
        ? isSearchingMelolo
        : isSearchingFreeReels;

  const searchResults = isDramaBox
    ? dramaBoxResults || []
    : isReelShort
      ? reelShortResults?.data || []
      : isMelolo
        ? meloloResults?.data?.search_data?.flatMap((item: any) => item.books || []).filter((book: any) => book.thumb_url) || []
        : freeReelsResults || [];

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-background/55 backdrop-blur-2xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="leading-none">
            <h1 className="[font-family:'Bebas_Neue',_'Inter',_'Satoshi',_sans-serif] bg-[linear-gradient(100deg,#C9A227_0%,#F5E6A9_52%,#C9A227_100%)] bg-clip-text text-[clamp(1.9rem,2.8vw,2.6rem)] font-normal uppercase tracking-[0.14em] text-transparent [text-shadow:0_0_12px_rgba(201,162,39,0.28)] [transform:perspective(900px)_rotateX(9deg)]">
              PUSATDRACIN
            </h1>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-2xl border border-white/10 bg-white/5 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {searchOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden bg-[radial-gradient(circle_at_top,hsl(45_63%_52%_/_0.12),transparent_20%),radial-gradient(circle_at_80%_20%,hsl(45_100%_68%_/_0.09),transparent_18%),linear-gradient(180deg,#080B12_0%,#0B0F1A_100%)]">
            <div className="container mx-auto flex h-[100dvh] flex-col px-4 py-6">
              <div className="mb-6 flex flex-shrink-0 items-center gap-4">
                <div className="relative min-w-0 flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={`Cari judul, tag, atau cerita di ${platformInfo.name}...`}
                    className="search-input pl-12"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSearchClose}
                  className="flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Mencari di:</span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary">
                  {platformInfo.name}
                </span>
              </div>

              <div className="flex-1 overflow-x-hidden overflow-y-auto">
                {isSearching && normalizedQuery && (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}

                {isDramaBox && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((drama: any, index: number) => (
                      <Link
                        key={drama.bookId}
                        href={`/detail/dramabox/${drama.bookId}`}
                        onClick={handleSearchClose}
                        className="animate-fade-up overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={drama.cover}
                          alt={normalizeUiText(drama.bookName)}
                          className="h-24 w-16 flex-shrink-0 rounded-xl object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display font-semibold text-foreground">{normalizeUiText(drama.bookName)}</h3>
                          {drama.protagonist && <p className="mt-1 truncate text-sm text-muted-foreground">{normalizeUiText(drama.protagonist)}</p>}
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{normalizeUiText(drama.introduction)}</p>
                          {drama.tagNames && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {drama.tagNames.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="tag-pill text-[10px]">
                                  {normalizeUiText(tag)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {isReelShort && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.book_id}
                        href={`/detail/reelshort/${book.book_id}`}
                        onClick={handleSearchClose}
                        className="animate-fade-up overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={book.book_pic}
                          alt={normalizeUiText(book.book_title)}
                          className="h-24 w-16 flex-shrink-0 rounded-xl object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display font-semibold text-foreground">{normalizeUiText(book.book_title)}</h3>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{normalizeUiText(book.special_desc)}</p>
                          {book.theme && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {book.theme.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="tag-pill text-[10px]">
                                  {normalizeUiText(tag)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {isMelolo && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.book_id}
                        href={`/detail/melolo/${book.book_id}`}
                        onClick={handleSearchClose}
                        className="animate-fade-up overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={book.thumb_url.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` : book.thumb_url}
                          alt={normalizeUiText(book.book_name)}
                          className="h-24 w-16 flex-shrink-0 rounded-xl object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display font-semibold text-foreground">{normalizeUiText(book.book_name)}</h3>
                          {book.abstract && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{normalizeUiText(book.abstract)}</p>}
                          {book.stat_infos?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="tag-pill text-[10px]">{normalizeUiText(book.stat_infos[0])}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {isFreeReels && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.key}
                        href={`/detail/freereels/${book.key}`}
                        onClick={handleSearchClose}
                        className="animate-fade-up overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={book.cover}
                          alt={normalizeUiText(book.title)}
                          className="h-24 w-16 flex-shrink-0 rounded-xl object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display font-semibold text-foreground">{normalizeUiText(book.title)}</h3>
                          {book.desc && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{normalizeUiText(book.desc)}</p>}
                          {book.content_tags?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {book.content_tags.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="tag-pill text-[10px]">
                                  {normalizeUiText(tag)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && normalizedQuery && (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Tidak ada hasil untuk "{normalizedQuery}" di {platformInfo.name}</p>
                  </div>
                )}

                {!normalizedQuery && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Ketik untuk mencari drama di {platformInfo.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
