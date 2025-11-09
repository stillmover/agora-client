import { useCallback } from "react";

import { useSavePostMutation, useUnsavePostMutation } from "@/shared/api";
import { useIsPostSaved, clientStateActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";

const fallbackShare = (url: string) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      logger.debug("Link copied to clipboard");
    })
    .catch(() => {
      logger.warn("Failed to copy to clipboard");
    });
};

export const usePostActions = (postId: string) => {
  const isSaved = useIsPostSaved(postId);
  const [, executeSave] = useSavePostMutation();
  const [, executeUnsave] = useUnsavePostMutation();

  const save = useCallback(async () => {
    const wasSaved = isSaved;

    if (isSaved) {
      clientStateActions.unsavePost(postId);
    } else {
      clientStateActions.savePost(postId);
    }

    try {
      const result = isSaved
        ? await executeUnsave({ postId })
        : await executeSave({ postId });

      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      if (wasSaved) {
        clientStateActions.savePost(postId);
      } else {
        clientStateActions.unsavePost(postId);
      }
      logger.error("Failed to save/unsave post:", error);
      throw error;
    }
  }, [postId, isSaved, executeSave, executeUnsave]);

  const share = useCallback(async () => {
    const url = `${window.location.origin}/post/${postId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post",
          url,
        });
      } catch {
        fallbackShare(url);
      }
    } else {
      fallbackShare(url);
    }
  }, [postId]);

  return {
    save,
    share,
    isSaved,
    saveLabel: isSaved ? "Saved" : "Save",
  };
};
