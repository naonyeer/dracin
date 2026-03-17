"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export interface BadgeConfig {
  text: string;
  color?: string;       // Background color (e.g., "#E52E2E" or "hsl(var(--primary))")
  textColor?: string;   // Text color (default white)
  isTransparent?: boolean; // If true, uses black/60 backdrop
}

export interface UnifiedMediaCardProps {
  title: string;
  cover: string;
  link: string;
  episodes?: number;
  topLeftBadge?: BadgeConfig | null;
  topRightBadge?: BadgeConfig | null;
  index?: number;
}

export function UnifiedMediaCard({
  title,
  cover,
  link,
  episodes = 0,
  topLeftBadge,
  topRightBadge,
  index = 0,
}: UnifiedMediaCardProps) {
  
  // SHARED STYLES
  // Responsive: Mobile (Default) -> smaller | Desktop (md:) -> regular 10px
  // Using text-[8px] for mobile and text-[10px] for desktop
  // Note: Removed absolute positioning from BASE, moving it to container
  const BADGE_BASE = "px-1 py-0.5 md:px-1.5 rounded font-bold text-white shadow-sm leading-none tracking-wide flex items-center justify-center font-sans text-[8px] md:text-[10px]";
  
  const BADGE_FONT = { 
    lineHeight: "1",      
    fontFamily: "inherit"
  };

  return (
    <Link
      href={link}
      className="group relative block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Visual Container */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] border border-white/10 bg-muted/20 shadow-[0_20px_40px_-22px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_55px_-24px_rgba(0,0,0,0.95)]">
        <img
          src={cover.includes(".heic") 
            ? `https://wsrv.nl/?url=${encodeURIComponent(cover)}&output=jpg` 
            : cover}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(10,14,28,0.08)_58%,rgba(7,10,22,0.86)_100%)]" />
        <div className="pointer-events-none absolute inset-x-3 top-3 h-16 rounded-full bg-white/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges Container - Flexbox to prevent overlap */}
        <div className="absolute top-1.5 left-1.5 right-1.5 md:top-2 md:left-2 md:right-2 flex justify-between items-start pointer-events-none z-10">
          
          {/* Top Left Badge - Allowed to truncate */}
          <div className="flex-1 min-w-0 pr-1 flex justify-start"> 
            {topLeftBadge && (
              <div 
                className={`${BADGE_BASE} truncate max-w-full`}
                style={{ 
                  ...BADGE_FONT,
                  backgroundColor: topLeftBadge.color || "#E52E2E",
                  color: topLeftBadge.textColor || "#FFFFFF"
                }}
              >
                {topLeftBadge.text}
              </div>
            )}
          </div>

          {/* Top Right Badge - Fixed width/Shrink 0 */}
          <div className="shrink-0 flex justify-end">
            {topRightBadge && (
              <div 
                className={`${BADGE_BASE} ${topRightBadge.isTransparent ? 'backdrop-blur-sm' : ''}`}
                style={{ 
                  ...BADGE_FONT,
                  backgroundColor: topRightBadge.isTransparent ? "rgba(0,0,0,0.6)" : (topRightBadge.color || "rgba(0,0,0,0.6)"),
                  color: topRightBadge.textColor || "#FFFFFF"
                }}
              >
                {topRightBadge.text}
              </div>
            )}
          </div>
        </div>

        {/* Episode Count */}
        {episodes > 0 && (
          <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm md:text-xs">
            <Play className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white" />
            <span>{episodes} Ep</span>
          </div>
        )}

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/90 text-background shadow-lg transition-transform duration-300 group-hover:scale-100 md:h-12 md:w-12">
            <Play className="ml-0.5 h-4 w-4 fill-background text-background md:h-5 md:w-5" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="pb-1 pt-3 md:pt-3.5">
        <h3 className="line-clamp-2 font-display text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-sm">
          {title}
        </h3>
      </div>
    </Link>
  );
}
