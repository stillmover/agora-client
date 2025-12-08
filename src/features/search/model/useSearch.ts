import { useMemo } from "react";
import {
  useSearchPostsQuery,
  useSearchCommunitiesQuery,
  useSearchUsersQuery,
} from "@/shared/api/gql/query-hooks";
import { useDebounce } from "@/shared/hooks";
import { mapPost } from "@/entities/post";
import { mapCommunity } from "@/entities/community/api/mappers";
import { mapUser } from "@/entities/user";

export type SearchType = "posts" | "communities" | "users";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

export const useSearchPosts = (query: string, limit = 20, offset = 0) => {
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const isValidQuery = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const { data, isLoading, isFetching, error, refetch } = useSearchPostsQuery(
    debouncedQuery,
    { limit, offset },
    { enabled: isValidQuery },
  );

  const posts = useMemo(() => {
    return (data ?? []).map(mapPost);
  }, [data]);

  return {
    posts,
    isLoading: isValidQuery && isLoading,
    isSearching: isFetching,
    isPending: query !== debouncedQuery && query.length >= MIN_SEARCH_LENGTH,
    error,
    refetch,
  };
};

export const useSearchCommunities = (query: string, limit = 20, offset = 0) => {
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const isValidQuery = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const { data, isLoading, isFetching, error, refetch } =
    useSearchCommunitiesQuery(
      debouncedQuery,
      { limit, offset },
      { enabled: isValidQuery },
    );

  const communities = useMemo(() => {
    return (data ?? []).map(mapCommunity);
  }, [data]);

  return {
    communities,
    isLoading: isValidQuery && isLoading,
    isSearching: isFetching,
    isPending: query !== debouncedQuery && query.length >= MIN_SEARCH_LENGTH,
    error,
    refetch,
  };
};

export const useSearchUsers = (query: string, limit = 20, offset = 0) => {
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const isValidQuery = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const { data, isLoading, isFetching, error, refetch } = useSearchUsersQuery(
    debouncedQuery,
    { limit, offset },
    { enabled: isValidQuery },
  );

  const users = useMemo(() => {
    return (data ?? []).map(mapUser);
  }, [data]);

  return {
    users,
    isLoading: isValidQuery && isLoading,
    isSearching: isFetching,
    isPending: query !== debouncedQuery && query.length >= MIN_SEARCH_LENGTH,
    error,
    refetch,
  };
};

export const useSearch = (query: string, limit = 10) => {
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const isValidQuery = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const {
    data: postsData,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useSearchPostsQuery(debouncedQuery, { limit }, { enabled: isValidQuery });

  const {
    data: communitiesData,
    isLoading: communitiesLoading,
    isFetching: communitiesFetching,
  } = useSearchCommunitiesQuery(
    debouncedQuery,
    { limit },
    { enabled: isValidQuery },
  );

  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching,
  } = useSearchUsersQuery(debouncedQuery, { limit }, { enabled: isValidQuery });

  const posts = useMemo(() => (postsData ?? []).map(mapPost), [postsData]);
  const communities = useMemo(
    () => (communitiesData ?? []).map(mapCommunity),
    [communitiesData],
  );
  const users = useMemo(() => (usersData ?? []).map(mapUser), [usersData]);

  const isLoading =
    isValidQuery && (postsLoading || communitiesLoading || usersLoading);
  const isFetching = postsFetching || communitiesFetching || usersFetching;
  const isPending =
    query !== debouncedQuery && query.length >= MIN_SEARCH_LENGTH;

  return {
    posts,
    communities,
    users,
    isLoading,
    isFetching,
    isPending,
    hasResults: posts.length > 0 || communities.length > 0 || users.length > 0,
    debouncedQuery,
  };
};
