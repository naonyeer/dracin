"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PROMO_INTERVAL_MS = 5 * 60 * 1000;
const INITIAL_PROMO_DELAY_MS = 30 * 1000;
const AFFILIATE_URL = "https://s.shopee.co.id/5VQg7O1GuO";

export function AffiliatePromoPopup() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedulePopup = (delay: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, delay);
    };

    schedulePopup(INITIAL_PROMO_DELAY_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, PROMO_INTERVAL_MS);
    }
  };

  const handleAffiliateClick = () => {
    window.open(AFFILIATE_URL, "_blank", "noopener,noreferrer");
    handleOpenChange(false);
  };

  const handlePromoKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAffiliateClick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,hsl(14_93%_67%_/_0.16),transparent_32%),radial-gradient(circle_at_85%_18%,hsl(184_74%_62%_/_0.14),transparent_24%),linear-gradient(180deg,hsl(228_46%_8%)_0%,hsl(var(--background))_100%)] p-0 text-left shadow-2xl shadow-black/40 sm:max-w-[440px] sm:rounded-[28px] [&>button]:right-3 [&>button]:top-3 [&>button]:h-7 [&>button]:w-7 [&>button]:rounded-full [&>button]:border [&>button]:border-white/5 [&>button]:bg-black/10 [&>button]:p-0 [&>button]:text-white/35 [&>button]:opacity-40 [&>button]:ring-0 [&>button]:ring-offset-0 hover:[&>button]:opacity-65 hover:[&>button]:bg-black/20 hover:[&>button]:text-white/55 [&>button>svg]:h-3 [&>button>svg]:w-3">
        <div
          className="relative cursor-pointer px-6 pb-6 pt-7 transition-transform duration-300 hover:scale-[1.01] sm:px-7 sm:pb-7 sm:pt-8"
          role="button"
          tabIndex={0}
          onClick={handleAffiliateClick}
          onKeyDown={handlePromoKeyDown}
          aria-label="Lihat penawaran partner sekarang"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/8 to-transparent" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Partner Picks
            </div>

            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className="font-display text-2xl leading-tight text-foreground sm:text-[30px]">
                Tingkatkan Quality Effect
              </DialogTitle>
              <DialogDescription className="max-w-sm text-sm leading-6 text-muted-foreground">
                Cek penawaran partner pilihan kami untuk fitur, tools, dan resource yang mendukung hasil lebih maksimal.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/65">
                Sponsored offer
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Promo partner ditampilkan berkala agar tetap mudah ditemukan tanpa menutup akses browsing utama.
              </p>
            </div>

            <DialogFooter className="mt-6 flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-0">
              <Button
                type="button"
                className="rounded-2xl bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAffiliateClick();
                }}
              >
                Lihat Sekarang
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
