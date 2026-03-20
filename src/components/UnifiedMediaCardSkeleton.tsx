interface UnifiedMediaCardSkeletonProps {
  index?: number;
}

export function UnifiedMediaCardSkeleton({ index = 0 }: UnifiedMediaCardSkeletonProps) {
  return (
    <div
      className="w-full overflow-hidden rounded-[16px] animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Cover Skeleton */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-[16px] bg-muted/50">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/30 to-transparent animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
      </div>

      {/* Content Skeleton */}
      <div className="pt-3 pb-1 space-y-2">
        {/* Title line 1 */}
        <div className="h-3 bg-muted/50 rounded-lg w-full" />
        {/* Title line 2 (shorter) */}
        <div className="h-3 bg-muted/50 rounded-lg w-2/3" />
      </div>
    </div>
  );
}
