import { useCallback } from "react";
import {
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "@/shared/api";
import { useIsCommunityJoined, clientStateActions } from "@/shared/stores";

export const useCommunityActions = (communityId: string) => {
  const isJoined = useIsCommunityJoined(communityId);
  const [, executeJoin] = useJoinCommunityMutation();
  const [, executeLeave] = useLeaveCommunityMutation();

  const join = useCallback(async () => {
    clientStateActions.joinCommunity(communityId);

    try {
      const result = await executeJoin({ communityId });
      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      clientStateActions.leaveCommunity(communityId);
      throw error;
    }
  }, [communityId, executeJoin]);

  const leave = useCallback(async () => {
    const wasJoined = isJoined;

    clientStateActions.leaveCommunity(communityId);

    try {
      const result = await executeLeave({ communityId });
      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      if (wasJoined) {
        clientStateActions.joinCommunity(communityId);
      }
      throw error;
    }
  }, [communityId, isJoined, executeLeave]);

  const toggleJoin = useCallback(async () => {
    if (isJoined) {
      await leave();
    } else {
      await join();
    }
  }, [isJoined, join, leave]);

  return {
    join,
    leave,
    toggleJoin,
    isJoined,
    joinLabel: isJoined ? "Joined" : "Join",
    actionLabel: isJoined ? "Leave" : "Join",
  };
};
