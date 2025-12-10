import { cn } from "@/shared/lib/utils";

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton = ({ className, animate = true }: SkeletonProps) => (
  <div
    className={cn("rounded-lg bg-muted", animate && "animate-pulse", className)}
    aria-hidden="true"
  />
);

export const SkeletonText = ({
  lines = 1,
  className,
  lastLineWidth = "75%",
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4", i === lines - 1 && lines > 1 ? `w-[${lastLineWidth}]` : "w-full")}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({
  size = "md",
  className,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) => {
  const sizeClasses = {
    lg: "h-12 w-12",
    md: "h-10 w-10",
    sm: "h-8 w-8",
    xl: "h-16 w-16",
    xs: "h-6 w-6",
  };

  return <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />;
};

export const SkeletonButton = ({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) => {
  const sizeClasses = {
    default: "h-10 w-24",
    lg: "h-12 w-32",
    sm: "h-8 w-16",
  };

  return <Skeleton className={cn(sizeClasses[size], className)} />;
};

export const SkeletonPostCard = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border bg-card p-4 flex gap-3", className)}>
    <div className="flex flex-col items-center gap-2 py-2">
      <Skeleton className="h-6 w-6 rounded-md" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-6 w-6 rounded-md" />
    </div>

    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonAvatar size="xs" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-6 w-3/5" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonComment = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border bg-card p-4", className)}>
    <div className="flex gap-3">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <SkeletonAvatar size="xs" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonCommunityList = ({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2">
        <SkeletonAvatar size="sm" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-7 w-14 rounded-md" />
      </div>
    ))}
  </div>
);

export const SkeletonProfileHeader = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border bg-card p-6", className)}>
    <div className="flex items-start gap-4">
      <SkeletonAvatar size="xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    </div>
    <div className="flex gap-4 mt-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const SkeletonPage = ({
  showHeader = true,
  className,
}: {
  showHeader?: boolean;
  className?: string;
}) => (
  <div className={cn("space-y-6", className)}>
    {showHeader && (
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    )}
    <SkeletonPostCard />
    <SkeletonPostCard />
    <SkeletonPostCard />
  </div>
);
