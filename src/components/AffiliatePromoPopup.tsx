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
const PREMIUM_FEATURES = [
  "visual ultra hd / 4k",
  "tanpa gangguan iklan",
  "audio spasial imersif",
  "konten eksklusif",
];

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
      <DialogContent className="overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top,hsl(42_90%_70%_/_0.16),transparent_30%),radial-gradient(circle_at_85%_18%,hsl(184_74%_62%_/_0.12),transparent_24%),linear-gradient(145deg,hsl(222_38%_8%)_0%,hsl(228_46%_6%)_45%,hsl(222_52%_10%)_100%)] p-0 text-left shadow-2xl shadow-black/50 max-sm:top-auto max-sm:translate-y-0 max-sm:bottom-0 max-sm:w-[calc(100%-16px)] max-sm:translate-x-[-50%] max-sm:rounded-b-none max-sm:rounded-t-[32px] sm:max-w-[470px] sm:rounded-[30px] [&>button]:right-3 [&>button]:top-3 [&>button]:h-7 [&>button]:w-7 [&>button]:rounded-full [&>button]:border [&>button]:border-white/5 [&>button]:bg-black/10 [&>button]:p-0 [&>button]:text-white/35 [&>button]:opacity-40 [&>button]:ring-0 [&>button]:ring-offset-0 hover:[&>button]:opacity-65 hover:[&>button]:bg-black/20 hover:[&>button]:text-white/55 [&>button>svg]:h-3 [&>button>svg]:w-3">
        <div
          className="relative cursor-pointer px-5 pb-5 pt-6 transition-transform duration-300 hover:scale-[1.01] sm:px-7 sm:pb-7 sm:pt-8"
          role="button"
          tabIndex={0}
          onClick={handleAffiliateClick}
          onKeyDown={handlePromoKeyDown}
          aria-label="Lihat penawaran partner sekarang"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 via-white/4 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-2 h-1 w-14 -translate-x-1/2 rounded-full bg-white/15 sm:hidden" />
          <div className="pointer-events-none absolute -left-8 top-10 h-28 w-28 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/80 backdrop-blur-sm sm:mb-5 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              premium viewing
            </div>

            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className="max-w-md font-display text-[30px] leading-[0.9] text-white sm:text-[40px]">
                rasakan kualitas bioskop!
              </DialogTitle>
              <DialogDescription className="max-w-md text-[14px] leading-6 text-slate-200/82 sm:text-[15px] sm:leading-7">
                jangan batasi pengalaman tontonan anda. transformasikan layarmu dan nikmati setiap detail dalam pro & ultra hd.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2">
              {PREMIUM_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-[13px] font-medium text-white/88 backdrop-blur-sm sm:rounded-[20px] sm:text-sm"
                >
                  <span className="mr-2 text-amber-300">+</span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm sm:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/75">pro preview</p>
              <p className="mt-1 text-sm leading-6 text-white/76">masuk ke mode nonton yang terasa lebih tajam, bersih, dan imersif.</p>
            </div>

            <DialogFooter className="mt-6 flex-col-reverse gap-2 sm:mt-7 sm:flex-row sm:justify-end sm:space-x-0">
              <Button
                type="button"
                className="min-h-12 w-full rounded-[20px] bg-gradient-to-r from-amber-300 via-primary to-orange-400 px-6 text-base font-bold text-slate-950 shadow-[0_18px_40px_rgba(244,174,78,0.35)] transition-all duration-300 hover:scale-[1.02] hover:from-amber-200 hover:via-primary hover:to-orange-300 sm:w-auto sm:rounded-2xl"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAffiliateClick();
                }}
              >
                coba pro & rasakan bedanya.
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
