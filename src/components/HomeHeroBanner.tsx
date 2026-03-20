"use client";

import Image from "next/image";
import Link from "next/link";
import { Info, Play, Sparkles } from "lucide-react";

function normalizeHeroImage(src: string | undefined): string {
  if (!src) return "";
  if (src.toLowerCase().includes(".heic")) {
    return `https://wsrv.nl/?url=${encodeURIComponent(src)}&output=jpg`;
  }
  return src;
}

interface SpotlightHeroProps {
  platformName: string;
  title: string;
  description: string;
  backdrop?: string;
  poster: string;
  episodes?: number;
  plays?: string;
  watchHref: string;
  detailHref: string;
}

export function SpotlightHero({
  platformName,
  title,
  description,
  backdrop,
  poster,
  episodes,
  plays,
  watchHref,
  detailHref,
}: SpotlightHeroProps) {
  const heroBackdrop = normalizeHeroImage(backdrop || poster);
  const heroPoster = normalizeHeroImage(poster || backdrop);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#111625_0%,#0a0f1a_100%)] p-5 shadow-[0_28px_70px_-36px_rgba(0,0,0,0.92)] md:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0">
        {heroBackdrop ? (
          <Image
            src={heroBackdrop}
            alt={title}
            fill
            className="object-cover opacity-28 blur-[2px]"
            sizes="100vw"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(8,12,22,0.95)_12%,rgba(8,12,22,0.72)_52%,rgba(8,12,22,0.92)_100%)]" />
      </div>

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {platformName} spotlight
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl font-extrabold leading-[1.02] text-white md:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300/90">
            {episodes ? (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-medium">
                {episodes} Episode
              </span>
            ) : null}
            {plays ? (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-medium">
                {plays} views
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={watchHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition-transform duration-300 hover:scale-[1.03]"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              Tonton
            </Link>
            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/12"
            >
              <Info className="h-4 w-4" />
              Detail
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[360px]">
          <div className="absolute inset-0 rounded-[24px] bg-cyan-400/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[24px] border border-white/15 shadow-[0_26px_70px_-35px_rgba(0,0,0,0.92)]">
            {heroPoster ? (
              <Image
                src={heroPoster}
                alt={title}
                width={640}
                height={960}
                className="h-auto w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="aspect-[2/3] w-full bg-white/10" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { SpotlightHero as HomeHeroBanner };
