import { Link } from "@tanstack/react-router";
import { Card, Badge, Button, Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/shared/ui";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Flame,
  MessageSquare,
} from "lucide-react";
import { useHeroCarousel } from "../model/useHeroCarousel";
import { cn } from "@/shared/lib/utils";

const LoadingSkeleton = () => (
  <div className="bg-gradient-to-b from-muted/30 to-transparent py-8 border-b border-border/50">
    <div className="max-w-[1600px] mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-40 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-[16/10] rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export const HeroCarousel = () => {
  const { visibleStories, isLoading, error, stories, nextSlide, prevSlide, canNavigate, refetch } =
    useHeroCarousel();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-destructive/5 to-transparent py-8 border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>Unable to load trending posts</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              aria-label="Retry loading stories"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-gradient-to-b from-muted/20 to-transparent py-6 border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 text-center text-muted-foreground text-sm">
          No trending stories yet. Check back soon.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-muted/30 to-transparent py-8 border-b border-border/50">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
              <Flame className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Trending Today</h2>
              <p className="text-xs text-muted-foreground">Top stories across all communities</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={prevSlide}
              className="rounded-full"
              aria-label="Previous trending story"
              disabled={!canNavigate}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={nextSlide}
              className="rounded-full"
              aria-label="Next trending story"
              disabled={!canNavigate}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleStories.map((story, index) => (
            <Link
              key={`${story.id}-${index}`}
              to="/post/$postId"
              params={{ postId: story.id }}
              className="group"
            >
              <Card variant="interactive" className="overflow-hidden h-full">
                <div className="relative aspect-[16/10]">
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-5 w-5 ring-2 ring-white/20">
                        <AvatarImage src={story.community.iconUrl} />
                        <AvatarFallback className="text-[8px] bg-brand text-white">
                          {story.community.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Badge
                        variant="secondary"
                        className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                      >
                        r/{story.community.name}
                      </Badge>
                    </div>

                    <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-brand transition-colors">
                      {story.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-brand" />
                        {story.score.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {story.commentCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {index < 3 && (
                    <div
                      className={cn(
                        "absolute top-3 left-3 flex items-center justify-center",
                        "h-7 w-7 rounded-lg font-bold text-sm",
                        index === 0 && "bg-amber-500 text-white",
                        index === 1 && "bg-gray-300 text-gray-800",
                        index === 2 && "bg-amber-700 text-white"
                      )}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
