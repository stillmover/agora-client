import { useMemo } from "react";
import {
  useCommunitiesQuery as useCommunitiesGql,
  usePopularCommunitiesQuery as usePopularCommunitiesGql,
  useCommunityQuery as useCommunityGql,
  useCommunityByNameQuery as useCommunityByNameGql,
  useFlairsByCommunityQuery as useFlairsByCommunityGql,
} from "@/shared/api/gql/query-hooks";
import { mapCommunity } from "../api/mappers";

export const useCommunities = (limit = 20, offset = 0) => {
  const { data, isLoading, error, refetch } = useCommunitiesGql({
    limit,
    offset,
  });

  const communities = useMemo(() => {
    return (data ?? []).map(mapCommunity);
  }, [data]);

  return {
    communities,
    error,
    isLoading,
    refetch,
  };
};

export const usePopularCommunities = (limit = 10) => {
  const { data, isLoading, error, refetch } = usePopularCommunitiesGql(limit);

  const communities = useMemo(() => {
    return (data ?? []).map(mapCommunity);
  }, [data]);

  return {
    communities,
    error,
    isLoading,
    refetch,
  };
};

export const useCommunity = (communityId: string) => {
  const { data, isLoading, error, refetch } = useCommunityGql(communityId, {
    enabled: Boolean(communityId),
  });

  const community = useMemo(() => (data ? mapCommunity(data) : undefined), [data]);

  return {
    community,
    error,
    isLoading,
    refetch,
  };
};

export const useCommunityByName = (name: string) => {
  const { data, isLoading, error, refetch } = useCommunityByNameGql(name, {
    enabled: Boolean(name),
  });

  const community = useMemo(() => (data ? mapCommunity(data) : undefined), [data]);

  return {
    community,
    error,
    isLoading,
    refetch,
  };
};

export const useFlairsByCommunity = (communityId: string) => {
  const { data, isLoading, error, refetch } = useFlairsByCommunityGql(communityId, {
    enabled: Boolean(communityId),
  });

  return {
    error,
    flairs: data ?? [],
    isLoading,
    refetch,
  };
};
