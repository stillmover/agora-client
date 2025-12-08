import { useState, useCallback } from "react";
import { useParams } from "@tanstack/react-router";

import { usePosts, type Post } from "@/entities/post";
import { PostCard } from "@/widgets/post-card";
import { SortBar } from "@/features/sort-bar";
import type { SortOption, RegionOption } from "@/shared/types";
import { useInfiniteScroll } from "@/shared/hooks";
import { mapSortOptionToSortType } from "../lib/mappers";
import {
  FeedError,
  FeedEmpty,
  FeedLoading,
  LoadingMoreIndicator,
  EndOfFeed,
} from "./components";

export const Feed = () => {
  const params = useParams({ strict: false });
  const communityId = params?.communityId as string | undefined;

  const [sort, setSort] = useState<SortOption>("best");
  const [region, setRegion] = useState<RegionOption>("global");

  const {
    posts,
    isLoading,
    isFetchingNextPage,
    hasMore,
    fetchNextPage,
    error,
  } = usePosts({
    communityId,
    sort: mapSortOptionToSortType(sort),
    region,
  });

  const sentinelRef = useInfiniteScroll(fetchNextPage, {
    hasMore,
    isLoading: isLoading || isFetchingNextPage,
  });

  const handleFilterClick = useCallback(() => {}, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
  }, []);

  const handleRegionChange = useCallback((newRegion: RegionOption) => {
    setRegion(newRegion);
  }, []);

  if (error) {
    return <FeedError />;
  }

  if (isLoading && posts.length === 0) {
    return <FeedLoading />;
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
        <FeedEmpty />
      ) : (
        <div className="space-y-4">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} showCommunity={!communityId} />
          ))}

          <div ref={sentinelRef} aria-hidden="true" />

          {isFetchingNextPage && <LoadingMoreIndicator />}

          {!hasMore && posts.length > 0 && <EndOfFeed />}
        </div>
      )}
    </div>
  );
};
