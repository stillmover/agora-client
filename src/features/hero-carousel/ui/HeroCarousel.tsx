import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { MOCK_TOP_STORIES } from "../constants/top-stories";

type TopStory = {
  id: string;
  title: string;
  community: {
    id: string;
    name: string;
  };
  thumbnail: string;
  score: number;
};

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState<TopStory[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStories(MOCK_TOP_STORIES);
    }, 500);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  if (stories.length === 0) {
    return (
      <div className="bg-muted/20 border-b py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            Loading top stories...
          </div>
        </div>
      </div>
    );
  }

  const visibleStories = stories
    .slice(currentIndex, currentIndex + 3)
    .concat(stories.slice(0, Math.max(0, currentIndex + 3 - stories.length)));

  return (
    <div className="bg-muted/20 border-b py-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-4 mb-6">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold">Today's Top Stories</h2>
        </div>

        <div className="relative">
          {/* Navigation buttons - hidden on mobile */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Stories grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleStories.map((story, index) => (
              <Card
                key={`${story.id}-${index}`}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge variant="secondary" className="mb-2">
                      r/{story.community.name}
                    </Badge>
                    <Link
                      to="/post/$postId"
                      params={{ postId: story.id }}
                      className="block"
                    >
                      <h3 className="text-white font-medium text-sm line-clamp-2 hover:underline">
                        {story.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-orange-400" />
                      <span className="text-white/80 text-xs">
                        {story.score.toLocaleString()} points
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
