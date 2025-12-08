import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "@/shared/api/gql/query-hooks";
import { queryKeys } from "@/shared/api/query-keys";
import { useIsCommunityJoined, clientStateActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";

export const useCommunityActions = (communityId: string) => {
  const isJoined = useIsCommunityJoined(communityId);
  const queryClient = useQueryClient();
  const joinMutation = useJoinCommunityMutation();
  const leaveMutation = useLeaveCommunityMutation();

  const join = useCallback(async () => {
    clientStateActions.joinCommunity(communityId);

    try {
      await joinMutation.mutateAsync({ communityId });

      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.detail(communityId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.lists(),
        refetchType: "none",
      });

      logger.info("Joined community:", communityId);
    } catch (error) {
      clientStateActions.leaveCommunity(communityId);
      logger.error("Failed to join community:", error);
      throw error;
    }
  }, [communityId, joinMutation, queryClient]);

  const leave = useCallback(async () => {
    const wasJoined = isJoined;

    clientStateActions.leaveCommunity(communityId);

    try {
      await leaveMutation.mutateAsync({ communityId });

      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.detail(communityId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.lists(),
        refetchType: "none",
      });

      logger.info("Left community:", communityId);
    } catch (error) {
      if (wasJoined) {
        clientStateActions.joinCommunity(communityId);
      }
      logger.error("Failed to leave community:", error);
      throw error;
    }
  }, [communityId, isJoined, leaveMutation, queryClient]);

  const toggleJoin = useCallback(async () => {
    if (isJoined) {
      await leave();
    } else {
      await join();
    }
  }, [isJoined, join, leave]);

  const isPending = joinMutation.isPending || leaveMutation.isPending;

  return {
    join,
    leave,
    toggleJoin,
    isJoined,
    isPending,
    joinLabel: isJoined ? "Joined" : "Join",
    actionLabel: isJoined ? "Leave" : "Join",
  };
};
