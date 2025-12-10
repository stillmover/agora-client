import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useJoinCommunityMutation, useLeaveCommunityMutation } from "@/shared/api/gql/query-hooks";
import { queryKeys } from "@/shared/api/query-keys";
import { useIsCommunityJoined } from "@/shared/stores";
import { logger } from "@/shared/services/logger";

export const useCommunityActions = (communityId: string) => {
  const isJoined = useIsCommunityJoined(communityId);
  const queryClient = useQueryClient();
  const joinMutation = useJoinCommunityMutation();
  const leaveMutation = useLeaveCommunityMutation();
  const joinInFlightRef = useRef(false);
  const leaveInFlightRef = useRef(false);

  const join = useCallback(async () => {
    if (isJoined || joinMutation.isPending || joinInFlightRef.current) {
      return;
    }

    joinInFlightRef.current = true;

    try {
      await joinMutation.mutateAsync({ communityId });

      queryClient.invalidateQueries({ queryKey: queryKeys.communities.detail(communityId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.lists(),
        refetchType: "none",
      });

      logger.info("Joined community:", communityId);
    } catch (error) {
      logger.error("Failed to join community:", error);
      throw error;
    } finally {
      joinInFlightRef.current = false;
    }
  }, [communityId, isJoined, joinMutation, queryClient]);

  const leave = useCallback(async () => {
    if (!isJoined || leaveMutation.isPending || leaveInFlightRef.current) {
      return;
    }

    leaveInFlightRef.current = true;

    try {
      await leaveMutation.mutateAsync({ communityId });

      queryClient.invalidateQueries({ queryKey: queryKeys.communities.detail(communityId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.lists(),
        refetchType: "none",
      });

      logger.info("Left community:", communityId);
    } catch (error) {
      logger.error("Failed to leave community:", error);
      throw error;
    } finally {
      leaveInFlightRef.current = false;
    }
  }, [communityId, isJoined, leaveMutation, queryClient]);

  const toggleJoin = useCallback(async () => {
    if (
      joinInFlightRef.current ||
      leaveInFlightRef.current ||
      joinMutation.isPending ||
      leaveMutation.isPending
    ) {
      return;
    }

    if (isJoined) {
      return;
    }

    await join();
  }, [isJoined, join, joinMutation.isPending, leaveMutation.isPending]);

  const isPending =
    joinMutation.isPending ||
    leaveMutation.isPending ||
    joinInFlightRef.current ||
    leaveInFlightRef.current;

  return {
    actionLabel: isJoined ? "Leave" : "Join",
    isJoined,
    isPending,
    join,
    joinLabel: isJoined ? "Joined" : "Join",
    leave,
    toggleJoin,
  };
};
