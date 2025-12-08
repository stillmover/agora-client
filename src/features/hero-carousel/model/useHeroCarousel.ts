import { useState, useCallback, useMemo } from "react";
import { useTopStories } from "../api/topStoriesApi";

const VISIBLE_STORIES_COUNT = 3;
const TOP_STORIES_LIMIT = 6;

export const useHeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { stories, isLoading, error } = useTopStories(TOP_STORIES_LIMIT);

  const nextSlide = useCallback(() => {
    if (stories.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, [stories.length]);

  const prevSlide = useCallback(() => {
    if (stories.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, [stories.length]);

  const visibleStories = useMemo(() => {
    if (stories.length === 0) return [];
    return stories
      .slice(currentIndex, currentIndex + VISIBLE_STORIES_COUNT)
      .concat(
        stories.slice(
          0,
          Math.max(0, currentIndex + VISIBLE_STORIES_COUNT - stories.length),
        ),
      );
  }, [stories, currentIndex]);

  return {
    stories,
    visibleStories,
    isLoading,
    error,
    currentIndex,
    nextSlide,
    prevSlide,
  };
};
