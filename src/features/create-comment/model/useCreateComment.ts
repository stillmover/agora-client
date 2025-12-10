import { useCallback } from "react";
import { useSessionUser } from "@/entities/session";
import { useCreateCommentMutation } from "@/shared/api/gql/query-hooks";
import { logger } from "@/shared/services/logger";

export const useCreateComment = (postId: string) => {
  const user = useSessionUser();
  const createCommentMutation = useCreateCommentMutation();

  const createComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!user) {
        const authError = new Error("User must be authenticated to create comments");
        logger.error("Create comment failed:", authError);
        throw authError;
      }

      try {
        const result = await createCommentMutation.mutateAsync({
          input: {
            content,
            parentId: parentId ?? undefined,
            postId,
          },
        });

        logger.info("Comment created successfully");
        return result.createComment;
      } catch (error) {
        logger.error("Failed to create comment:", error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [postId, user, createCommentMutation]
  );

  return {
    createComment,
    error: createCommentMutation.error,
    isPending: createCommentMutation.isPending,
  };
};
