"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on watch pages for immersive video experience
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="editorial-panel relative overflow-hidden px-6 py-6 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-40 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <p className="section-kicker relative mx-auto mb-4">desdracin</p>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            Kumpulan short drama dari beberapa tempat, dibikin lebih rapi biar gampang dicari dan enak ditonton.
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
            © {new Date().getFullYear()} desdracin. Tinggal pilih, klik, lalu nonton.
          </p>
        </div>
      </div>
    </footer>
  );
}
