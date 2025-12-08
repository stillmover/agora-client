import { useEffect, useRef, useCallback } from "react";

export type UseInfiniteScrollOptions = {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
};

export const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions,
) => {
  const { hasMore, isLoading, threshold = 0.1, rootMargin = "0px" } = options;
  const targetRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading],
  );

  useEffect(() => {
    const target = targetRef.current;

    if (!target || isLoading || !hasMore) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection, hasMore, isLoading, threshold, rootMargin]);

  return targetRef;
};

export default useInfiniteScroll;
