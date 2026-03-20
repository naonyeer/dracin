"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const AFFILIATE_URL = "https://s.shopee.co.id/5VQg7O1GuO";
const REDIRECT_COOLDOWN_MS = 30 * 60 * 1000;

function canShowPopup() {
  const lastRedirect = localStorage.getItem("lastRedirect");

  if (!lastRedirect) {
    return true;
  }

  const lastRedirectAt = Number(lastRedirect);

  if (Number.isNaN(lastRedirectAt)) {
    return true;
  }

  return Date.now() - lastRedirectAt > REDIRECT_COOLDOWN_MS;
}

export function AffiliatePromoPopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("lastRedirect:", localStorage.getItem("lastRedirect"));
    setOpen(canShowPopup());
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const handlePopupClick = () => {
    if (canShowPopup()) {
      window.open(AFFILIATE_URL, "_blank", "noopener,noreferrer");
      localStorage.setItem("lastRedirect", Date.now().toString());
    }

    setOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top,hsl(206_88%_62%_/_0.18),transparent_34%),linear-gradient(180deg,hsl(224_42%_15%)_0%,hsl(226_41%_11%)_100%)] p-0 text-left shadow-2xl shadow-slate-950/45 max-sm:w-[calc(100%-24px)] max-sm:rounded-[28px] sm:max-w-[380px] sm:rounded-[30px] [&>button]:hidden"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <div className="relative cursor-pointer p-5 sm:p-6" onClick={handlePopupClick}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />

          <div className="relative flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/7 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200/78">
              Ad
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-300/60">Sponsored</span>
              <button
                type="button"
                aria-label="Tutup iklan"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/65 transition-colors hover:bg-white/12 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative mt-5 rounded-[24px] border border-white/10 bg-white/[0.05] px-5 py-6 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/12 bg-white shadow-lg shadow-black/15">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#f8fafc_0%,#dbeafe_100%)]">
                <Image
                  src="/pusatdracin-tab.svg"
                  alt="Ikon aplikasi sponsor"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-[24px] font-semibold leading-tight text-white sm:text-[26px]">
                Aplikasi Gratis untuk Harian Kamu
              </h3>
              <p className="mx-auto max-w-[260px] text-sm leading-6 text-slate-200/76">
                Download gratis di App Store &amp; Play Store.
              </p>
            </div>

            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs text-slate-200/78">
              <Download className="h-3.5 w-3.5 text-sky-300" />
              Coba sekarang tanpa biaya
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-black/10 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/58">
                Sponsored
              </p>
              <p className="mt-1 text-sm text-slate-100/78">
                Penawaran partner pilihan untuk pengguna aplikasi.
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-sky-300">
              Pelajari Selanjutnya
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
