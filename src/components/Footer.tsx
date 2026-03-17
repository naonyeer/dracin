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
          <p className="relative text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
            by pusatdracin author sansekai
          </p>
        </div>
      </div>
    </footer>
  );
}
