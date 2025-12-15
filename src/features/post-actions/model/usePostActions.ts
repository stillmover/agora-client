import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSavePostMutation, useUnsavePostMutation } from "@/shared/api/gql/query-hooks";
import { queryKeys } from "@/shared/api/query-keys";
import { useIsPostSaved, clientStateActions, authModalActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";
import { sharePost } from "../lib/share-utils";
import { useIsAuthenticated } from "@/entities/session";

export const usePostActions = (postId: string) => {
  const isSaved = useIsPostSaved(postId);
  const isAuthenticated = useIsAuthenticated();
  const queryClient = useQueryClient();
  const savePostMutation = useSavePostMutation();
  const unsavePostMutation = useUnsavePostMutation();

  const save = useCallback(async () => {
    if (!isAuthenticated) {
      authModalActions.open();
      return;
    }

    const wasSaved = isSaved;

    if (isSaved) {
      clientStateActions.unsavePost(postId);
    } else {
      clientStateActions.savePost(postId);
    }

    try {
      if (isSaved) {
        await unsavePostMutation.mutateAsync({ postId });
      } else {
        await savePostMutation.mutateAsync({ postId });
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.saved(),
      });
    } catch (error) {
      if (wasSaved) {
        clientStateActions.savePost(postId);
      } else {
        clientStateActions.unsavePost(postId);
      }
      logger.error("Failed to save/unsave post:", error);
      throw error;
    }
  }, [postId, isSaved, isAuthenticated, savePostMutation, unsavePostMutation, queryClient]);

  const share = useCallback(async () => {
    await sharePost(postId);
  }, [postId]);

  const isPending = savePostMutation.isPending || unsavePostMutation.isPending;

  return {
    isPending,
    isSaved,
    save,
    saveLabel: isSaved ? "Saved" : "Save",
    share,
  };
};
