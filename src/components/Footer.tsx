"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on watch pages for immersive video experience
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <footer className="border-t border-border/50 bg-background/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="editorial-panel px-6 py-6 text-center">
          <p className="section-kicker mx-auto mb-4">desdracin</p>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            Kumpulan short drama dari beberapa tempat, dibikin lebih rapi biar gampang dicari dan enak ditonton.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/80 font-medium">
            © {new Date().getFullYear()} desdracin. Tinggal pilih, klik, lalu nonton.
          </p>
        </div>
      </div>
    </footer>
  );
}
