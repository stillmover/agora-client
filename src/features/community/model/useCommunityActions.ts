import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useJoinCommunityMutation, useLeaveCommunityMutation } from "@/shared/api/gql/query-hooks";
import { queryKeys } from "@/shared/api/query-keys";
import { logger } from "@/shared/services/logger";
import { notificationActions } from "@/shared/stores/notification-store";
import { clientStateActions, clientStateStore, useIsCommunityJoined } from "@/shared/stores";

export const useCommunityActions = (communityId: string, initialIsJoined = false) => {
  const [joined, setJoined] = useState<boolean>(initialIsJoined);
  const optimisticJoined = useIsCommunityJoined(communityId);
  const queryClient = useQueryClient();
  const joinMutation = useJoinCommunityMutation();
  const leaveMutation = useLeaveCommunityMutation();
  const joinInFlightRef = useRef(false);
  const leaveInFlightRef = useRef(false);

  useEffect(() => {
    setJoined(initialIsJoined);
    if (!communityId) {
      return;
    }

    if (
      joinInFlightRef.current ||
      leaveInFlightRef.current ||
      joinMutation.isPending ||
      leaveMutation.isPending
    ) {
      return;
    }

    const isOptimisticallyJoined =
      clientStateStore.state.optimistic.joinedCommunities.has(communityId);
    if (initialIsJoined && !isOptimisticallyJoined) {
      clientStateActions.joinCommunity(communityId);
      return;
    }

    if (!initialIsJoined && isOptimisticallyJoined) {
      clientStateActions.leaveCommunity(communityId);
    }
  }, [communityId, initialIsJoined, joinMutation.isPending, leaveMutation.isPending]);

  useEffect(() => {
    return () => {
      joinInFlightRef.current = false;
      leaveInFlightRef.current = false;
    };
  }, []);

  const isJoined = joined || optimisticJoined;

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const join = useCallback(async () => {
    if (
      !communityId ||
      isJoined ||
      joinMutation.isPending ||
      joinInFlightRef.current ||
      leaveInFlightRef.current ||
      leaveMutation.isPending
    ) {
      return;
    }

    joinInFlightRef.current = true;
    setJoined(true);
    clientStateActions.joinCommunity(communityId);

    try {
      await joinMutation.mutateAsync({ communityId });

      queryClient.invalidateQueries({ queryKey: queryKeys.communities.detail(communityId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.lists(),
        refetchType: "none",
      });

      logger.info("Joined community:", communityId);
      notificationActions.success("Joined community");
    } catch (error) {
      clientStateActions.leaveCommunity(communityId);
      if (isMounted.current) {
        setJoined(false);
      }
      logger.error("Failed to join community:", error);
      notificationActions.error(
        "Failed to join community",
        error instanceof Error ? error.message : undefined
      );
      throw error;
    } finally {
      joinInFlightRef.current = false;
    }
  }, [communityId, isJoined, joinMutation, queryClient]);

  const leave = useCallback(async () => {
    if (
      !communityId ||
      !isJoined ||
      leaveMutation.isPending ||
      leaveInFlightRef.current ||
      joinInFlightRef.current ||
      joinMutation.isPending
    ) {
      return;
    }

    leaveInFlightRef.current = true;
    setJoined(false);
    clientStateActions.leaveCommunity(communityId);

    try {
      await leaveMutation.mutateAsync({ communityId });

      queryClient.invalidateQueries({ queryKey: queryKeys.communities.detail(communityId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.lists(),
        refetchType: "none",
      });

      logger.info("Left community:", communityId);
      notificationActions.success("Left community");
    } catch (error) {
      clientStateActions.joinCommunity(communityId);
      if (isMounted.current) {
        setJoined(true);
      }
      logger.error("Failed to leave community:", error);
      notificationActions.error(
        "Failed to leave community",
        error instanceof Error ? error.message : undefined
      );
      throw error;
    } finally {
      leaveInFlightRef.current = false;
    }
  }, [communityId, isJoined, leaveMutation, queryClient]);

  const toggleJoin = useCallback(async () => {
    const isBusy =
      joinInFlightRef.current ||
      leaveInFlightRef.current ||
      joinMutation.isPending ||
      leaveMutation.isPending;

    if (isBusy) {
      return;
    }

    if (isJoined) {
      await leave();
      return;
    }

    await join();
  }, [isJoined, join, leave, joinMutation.isPending, leaveMutation.isPending]);

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
