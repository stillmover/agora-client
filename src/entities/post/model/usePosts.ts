import { useMemo, useEffect, useRef } from "react";
import {
  usePostsQuery as usePostsGql,
  usePostQuery as usePostGql,
  useInfinitePostsQuery,
  useSavedPostsQuery as useSavedPostsGql,
  useUserPostsQuery as useUserPostsGql,
} from "@/shared/api/gql/query-hooks";
import type { SortType } from "@/shared/api/gql";
import type { RegionOption } from "@/shared/types";
import { detectUserRegion } from "@/shared/services";
import { clientStateActions, useUserRegion } from "@/shared/stores";
import { mapPost } from "../api/mappers";
import { mapRegionOptionToRegion } from "../lib/mappers";

export type PostsQueryParams = {
  communityId?: string;
  sort?: SortType;
  region?: RegionOption;
  limit?: number;
};

export const usePosts = (params: PostsQueryParams = {}) => {
  const limit = params.limit ?? 20;
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

  const region = mapRegionOptionToRegion(params.region, userRegion);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfinitePostsQuery({
    communityId: params.communityId,
    sort: params.sort,
    region,
    limit,
  });

  const posts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.posts.map(mapPost));
  }, [data]);

  return {
    posts,
    isLoading: isLoading && posts.length === 0,
    isFetchingNextPage,
    hasMore: hasNextPage ?? false,
    error,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    refetch,
  };
};

export const usePostsList = (params: PostsQueryParams = {}) => {
  const limit = params.limit ?? 20;
  const userRegion = useUserRegion();
  const region = mapRegionOptionToRegion(params.region, userRegion);

  const { data, isLoading, error, refetch } = usePostsGql({
    communityId: params.communityId,
    sort: params.sort,
    region,
    limit,
    offset: 0,
  });

  const posts = useMemo(() => {
    return (data ?? []).map(mapPost);
  }, [data]);

  return {
    posts,
    isLoading,
    error,
    refetch,
  };
};

export const usePost = (postId: string) => {
  const { data, isLoading, error, refetch } = usePostGql(postId, {
    enabled: Boolean(postId),
  });

  const post = useMemo(() => {
    return data ? mapPost(data) : null;
  }, [data]);

  return {
    post,
    isLoading,
    error,
    refetch,
  };
};

export const useSavedPosts = (limit = 20, offset = 0, enabled = true) => {
  const { data, isLoading, error, refetch } = useSavedPostsGql(
    { limit, offset },
    { enabled },
  );

  const posts = useMemo(() => {
    return (data ?? []).map(mapPost);
  }, [data]);

  return {
    posts,
    isLoading,
    error,
    refetch,
  };
};

export const useUserPosts = (userId: string, limit = 20, offset = 0) => {
  const { data, isLoading, error, refetch } = useUserPostsGql(
    userId,
    { limit, offset },
    { enabled: Boolean(userId) },
  );

  const posts = useMemo(() => {
    return (data ?? []).map(mapPost);
  }, [data]);

  return {
    posts,
    isLoading,
    error,
    refetch,
  };
};
