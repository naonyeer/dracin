"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { usePlatform, type PlatformInfo } from "@/hooks/usePlatform";
import { useState, useRef, useEffect } from "react";

function getAvailabilityBadge(platform: PlatformInfo): string | null {
  if (platform.availability === "unavailable") return "Offline";
  if (platform.availability === "coming-soon") return "Soon";
  return null;
}

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms, getPlatformInfo } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPlatformInfo = getPlatformInfo(currentPlatform);
  const currentBadge = getAvailabilityBadge(currentPlatformInfo);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <div className="relative z-[110] block md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full touch-manipulation items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3.5 transition-all duration-300 hover:bg-white/10"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-6 w-6 overflow-hidden rounded-md">
              <Image src={currentPlatformInfo.logo} alt={currentPlatformInfo.name} fill className="object-cover" sizes="24px" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold text-foreground">{currentPlatformInfo.name}</span>
                {currentBadge && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {currentBadge}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground/80">{currentPlatformInfo.shell.replace("-", " ")}</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="pointer-events-auto absolute inset-x-0 top-full z-[120] mt-2 max-h-[min(60vh,22rem)] touch-pan-y overflow-y-auto overscroll-contain rounded-[24px] border border-white/10 bg-card/95 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl [scrollbar-width:thin] [WebkitOverflowScrolling:touch]">
            {platforms.map((platform) => {
              const badge = getAvailabilityBadge(platform);

              return (
                <button
                  key={platform.id}
                  onClick={() => {
                    setPlatform(platform.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full touch-manipulation items-center gap-3 px-4 py-3 text-left transition-colors ${
                    currentPlatform === platform.id ? "bg-primary/12 text-primary" : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative h-6 w-6 overflow-hidden rounded-md">
                    <Image src={platform.logo} alt={platform.name} fill className="object-cover" sizes="24px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{platform.name}</span>
                      {badge && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground/80">{platform.note || platform.shell.replace("-", " ")}</p>
                  </div>
                  {currentPlatform === platform.id && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden items-center gap-3 md:flex md:flex-wrap">
        {platforms.map((platform) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isActive={currentPlatform === platform.id}
            onClick={() => setPlatform(platform.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PlatformButtonProps {
  platform: PlatformInfo;
  isActive: boolean;
  onClick: () => void;
}

function PlatformButton({ platform, isActive, onClick }: PlatformButtonProps) {
  const badge = getAvailabilityBadge(platform);

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300 ease-out ${
        isActive
          ? "-translate-y-0.5 border border-primary/30 bg-white/10 shadow-lg shadow-primary/15 ring-1 ring-primary/40"
          : "border border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:bg-white/[0.08]"
      }`}
    >
      <div className="relative h-6 w-6 overflow-hidden rounded-md">
        <Image src={platform.logo} alt={platform.name} fill className="object-cover" sizes="24px" />
      </div>
      <span className={`whitespace-nowrap text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {platform.name}
      </span>
      {badge && (
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {badge}
        </span>
      )}
      {isActive && <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 animate-pulse rounded-full bg-primary" />}
    </button>
  );
}
