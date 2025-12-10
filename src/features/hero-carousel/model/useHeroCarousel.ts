import { useState, useCallback, useMemo } from "react";
import { useTopStories } from "../api/topStoriesApi";

const VISIBLE_STORIES_COUNT = 3;
const TOP_STORIES_LIMIT = 6;

export const useHeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { stories, isLoading, error, refetch } = useTopStories(TOP_STORIES_LIMIT);

  const canNavigate = stories.length > VISIBLE_STORIES_COUNT;

  const nextSlide = useCallback(() => {
    if (!canNavigate) {
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, [canNavigate, stories.length]);

  const prevSlide = useCallback(() => {
    if (!canNavigate) {
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, [canNavigate, stories.length]);

  const visibleStories = useMemo(() => {
    if (stories.length === 0) {
      return [];
    }

    if (!canNavigate) {
      return stories;
    }

    return stories
      .slice(currentIndex, currentIndex + VISIBLE_STORIES_COUNT)
      .concat(stories.slice(0, Math.max(0, currentIndex + VISIBLE_STORIES_COUNT - stories.length)));
  }, [stories, currentIndex, canNavigate]);

  return {
    currentIndex,
    canNavigate,
    error,
    isLoading,
    nextSlide,
    prevSlide,
    refetch,
    stories,
    visibleStories,
  };
};
