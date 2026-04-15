export type PlatformShell = "short-drama" | "anime" | "movie";
export type PlatformAvailability = "active" | "coming-soon" | "unavailable";

export type Platform =
  | "dramabox"
  | "reelshort"
  | "melolo"
  | "freereels"
  | "flickreels"
  | "anime"
  | "donghua"
  | "moviebox"
  | "film1"
  | "sfilmindo";

export interface PlatformInfo {
  id: Platform;
  name: string;
  logo: string;
  apiBase: string;
  shell: PlatformShell;
  availability: PlatformAvailability;
  searchEnabled: boolean;
  homeEnabled: boolean;
  note?: string;
}

export const PLATFORM_REGISTRY: PlatformInfo[] = [
  {
    id: "dramabox",
    name: "DramaBox",
    logo: "/dramabox.webp",
    apiBase: "/api/dramabox",
    shell: "short-drama",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
  },
  {
    id: "reelshort",
    name: "ReelShort",
    logo: "/reelshort.webp",
    apiBase: "/api/reelshort",
    shell: "short-drama",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
  },
  {
    id: "melolo",
    name: "Melolo",
    logo: "/melolo.webp",
    apiBase: "/api/melolo",
    shell: "short-drama",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
  },
  {
    id: "freereels",
    name: "FreeReels",
    logo: "/freereels.webp",
    apiBase: "/api/freereels",
    shell: "short-drama",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
  },
  {
    id: "flickreels",
    name: "FlickReels",
    logo: "/flickreels.png",
    apiBase: "/api/flickreels",
    shell: "short-drama",
    availability: "unavailable",
    searchEnabled: false,
    homeEnabled: false,
    note: "Sumber FlickReels dari Cutad sedang tidak tersedia.",
  },
  {
    id: "anime",
    name: "Anime",
    logo: "/pusatdracin-tab.svg",
    apiBase: "/api/anime",
    shell: "anime",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
    note: "Anime sekarang aktif dengan shell episodik bergaya katalog yang menyatu dengan web utama.",
  },
  {
    id: "donghua",
    name: "Donghua",
    logo: "/pusatdracin-tab.svg",
    apiBase: "/api/donghua",
    shell: "anime",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
    note: "Donghua aktif dengan player embed/video sesuai stream yang disediakan Cutad.",
  },
  {
    id: "moviebox",
    name: "MovieBox",
    logo: "/pusatdracin-tab.svg",
    apiBase: "/api/moviebox",
    shell: "movie",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
    note: "MovieBox aktif dengan shell movie/series dan stream kualitas ganda dari Cutad.",
  },
  {
    id: "film1",
    name: "Film1",
    logo: "/pusatdracin-tab.svg",
    apiBase: "/api/film1",
    shell: "movie",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
    note: "Film1 aktif dengan fallback embed/video sesuai stream dari Cutad.",
  },
  {
    id: "sfilmindo",
    name: "SFilmIndo",
    logo: "/pusatdracin-tab.svg",
    apiBase: "/api/sfilmindo",
    shell: "movie",
    availability: "active",
    searchEnabled: true,
    homeEnabled: true,
    note: "SFilmIndo aktif dengan fallback stream bila watch Cutad belum konsisten.",
  },
];

export const DEFAULT_PLATFORM: Platform = "dramabox";

export function getPlatformInfo(platformId: Platform): PlatformInfo {
  return PLATFORM_REGISTRY.find((platform) => platform.id === platformId) ?? PLATFORM_REGISTRY[0];
}

export function isPlatformActive(platformId: Platform): boolean {
  return getPlatformInfo(platformId).availability === "active";
}
