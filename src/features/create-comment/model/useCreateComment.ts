import { useCreateCommentMutation } from "@/shared/api";
import { useSessionUser } from "@/entities/session";
import type { CreateCommentInput } from "@/shared/api/gql";

export const useCreateComment = (postId: string) => {
  const user = useSessionUser();
  const [, executeMutation] = useCreateCommentMutation();

  const createComment = async (content: string, parentId?: string) => {
    if (!user) {
      throw new Error("User must be authenticated to create comments");
    }

    const input: CreateCommentInput = {
      postId,
      content,
      parentId: parentId ?? undefined,
    };

    const result = await executeMutation({ input });

    if (result.error) {
      throw result.error;
    }

    return result.data;
  };

  return {
    createComment,
    isPending: false,
    error: null,
  };
};
