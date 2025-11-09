import { useMemo } from "react";
import {
  usePopularCommunitiesQuery,
  useCommunityQuery,
  mapCommunity,
} from "@/shared/api";

export const usePopularCommunities = () => {
  const [result, reexecute] = usePopularCommunitiesQuery(undefined, {
    requestPolicy: "cache-first",
  });

  const communities = useMemo(() => {
    return (result.data?.popularCommunities ?? []).map(mapCommunity);
  }, [result.data]);

  return {
    communities,
    isLoading: result.fetching && !result.data,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: "network-only" }),
  };
};

export const useCommunity = (communityId: string) => {
  const [result, reexecute] = useCommunityQuery(
    { id: communityId },
    {
      requestPolicy: "cache-first",
    },
  );

  const community = useMemo(() => {
    return result.data?.community ? mapCommunity(result.data.community) : null;
  }, [result.data]);

  return {
    community,
    isLoading: result.fetching && !result.data,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: "network-only" }),
  };
};
