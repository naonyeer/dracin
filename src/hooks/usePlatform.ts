"use client";

import { create } from "zustand";
import {
  DEFAULT_PLATFORM,
  PLATFORM_REGISTRY,
  getPlatformInfo,
  type Platform,
  type PlatformInfo,
} from "@/lib/provider-registry";

export type { Platform, PlatformInfo } from "@/lib/provider-registry";
export const PLATFORMS = PLATFORM_REGISTRY;

interface PlatformState {
  currentPlatform: Platform;
  setPlatform: (platform: Platform) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  currentPlatform: DEFAULT_PLATFORM,
  setPlatform: (platform) => set({ currentPlatform: platform }),
}));

export function usePlatform() {
  const { currentPlatform, setPlatform } = usePlatformStore();
  const platformInfo = getPlatformInfo(currentPlatform);

  return {
    currentPlatform,
    platformInfo,
    setPlatform,
    platforms: PLATFORMS,
    getPlatformInfo,
    isDramaBox: currentPlatform === "dramabox",
    isReelShort: currentPlatform === "reelshort",
    isMelolo: currentPlatform === "melolo",
    isFreeReels: currentPlatform === "freereels",
  };
}
