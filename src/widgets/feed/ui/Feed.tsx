import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "@tanstack/react-router";

import { PostCard, usePosts } from "@/entities/post";
import {
  SortBar,
  type SortOption,
  type RegionOption,
} from "@/features/sort-bar";
import { UI_TEXT } from "@/shared/constants";

export const Feed = () => {
  const params = useParams({ strict: false });
  const communityId = params?.communityId as string | undefined;

  const [sort, setSort] = useState<SortOption>("best");
  const [region, setRegion] = useState<RegionOption>("global");

  const observerRef = useRef<IntersectionObserver>(null);
  const lastPostRef = useRef<HTMLDivElement>(null);

  const {
    posts,
    isLoading,
    isFetchingNextPage,
    hasMore,
    fetchNextPage,
    error,
  } = usePosts({
    communityId,
    sort,
    region,
  });

  const setupIntersectionObserver = useCallback(() => {
    if (isLoading || isFetchingNextPage) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, isFetchingNextPage, hasMore, fetchNextPage]);

  useEffect(() => {
    const cleanup = setupIntersectionObserver();
    return cleanup;
  }, [setupIntersectionObserver]);

  const handleFilterClick = useCallback(() => {
    // TODO: Implement filter functionality
  }, []);

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleRegionChange = (newRegion: RegionOption) => {
    setRegion(newRegion);
  };

  if (error) {
    return (
      <div className="rounded-lg border bg-destructive/10 p-6 text-center">
        <p className="text-destructive">
          Failed to load posts. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Reload page
        </button>
      </div>
    );
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: UI_TEXT.LOADING.SKELETON_COUNT }, (_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SortBar
        sort={sort}
        region={region}
        onSortChange={handleSortChange}
        onRegionChange={handleRegionChange}
        onFilterClick={handleFilterClick}
      />

      {posts.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">{UI_TEXT.POST.NO_POSTS}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <PostCard post={post} showCommunity={!communityId} />
            </div>
          ))}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={`loading-${i}`}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
                </div>
              ))}
            </div>
          )}

          {/* End of feed message */}
          {!hasMore && posts.length > 0 && (
            <div className="rounded-lg border bg-muted/20 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                You've reached the end of the feed
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
