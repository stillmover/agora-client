import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { usePostsQuery, usePostQuery, mapPost } from "@/shared/api";
import { Region } from "@/shared/api/gql";
import type { SortType } from "@/shared/api/gql";
import type { RegionOption } from "@/features/sort-bar";
import { detectUserRegion } from "@/shared/services";
import { clientStateActions, useUserRegion } from "@/shared/stores";

export type PostsQueryParams = {
  communityId?: string;
  sort?: SortType;
  region?: RegionOption;
  page?: number;
  limit?: number;
};

const mapRegionOptionToRegion = (
  region?: RegionOption,
  userRegion: Region | null = null,
): Region | undefined => {
  if (!region) {
    return undefined;
  }

  switch (region) {
    case "global":
      return Region.All;
    case "my-country":
      return userRegion ?? undefined;
    default:
      return undefined;
  }
};

export const usePosts = (params: PostsQueryParams = {}) => {
  const limit = params.limit ?? 20;
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * limit;
  const userRegion = useUserRegion();
  const hasDetectedRegion = useRef(false);

  useEffect(() => {
    if (
      params.region === "my-country" &&
      userRegion === null &&
      !hasDetectedRegion.current
    ) {
      hasDetectedRegion.current = true;
      detectUserRegion()
        .then((region) => {
          if (region) {
            clientStateActions.setUserRegion(region);
          } else {
            hasDetectedRegion.current = false;
          }
        })
        .catch(() => {
          clientStateActions.setUserRegion(null);
          hasDetectedRegion.current = false;
        });
    }
  }, [params.region, userRegion]);

  const [result, reexecute] = usePostsQuery(
    {
      communityId: params.communityId ?? undefined,
      sort: params.sort ?? undefined,
      region: mapRegionOptionToRegion(params.region, userRegion),
      limit,
      offset,
    },
    {
      requestPolicy: "cache-first",
    },
  );

  const hasReexecutedRef = useRef(false);
  useEffect(() => {
    if (
      params.region === "my-country" &&
      userRegion !== null &&
      !hasReexecutedRef.current
    ) {
      hasReexecutedRef.current = true;
      reexecute({ requestPolicy: "network-only" });
    }
    if (params.region !== "my-country") {
      hasReexecutedRef.current = false;
    }
  }, [userRegion, params.region, reexecute]);

  const posts = useMemo(() => {
    return (result.data?.posts ?? []).map(mapPost);
  }, [result.data]);

  const hasMore = posts.length === limit;

  const fetchNextPage = useCallback(() => {
    if (hasMore && !result.fetching) {
      setCurrentPage((prev) => prev + 1);
      reexecute({ requestPolicy: "network-only" });
    }
  }, [hasMore, result.fetching, reexecute]);

  return {
    posts,
    isLoading: result.fetching && !result.data,
    isFetchingNextPage: result.fetching && !!result.data,
    hasMore,
    error: result.error,
    fetchNextPage,
    refetch: () => reexecute({ requestPolicy: "network-only" }),
  };
};

export const usePost = (postId: string) => {
  const [result, reexecute] = usePostQuery(
    { id: postId },
    {
      requestPolicy: "cache-first",
    },
  );

  const post = useMemo(() => {
    return result.data?.post ? mapPost(result.data.post) : null;
  }, [result.data]);

  return {
    post,
    isLoading: result.fetching && !result.data,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: "network-only" }),
  };
};
