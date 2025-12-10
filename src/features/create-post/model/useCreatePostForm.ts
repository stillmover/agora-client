import { useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useCreatePostMutation } from "@/shared/api/gql/query-hooks";
import { PostType } from "@/shared/api/gql";
import { notificationActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";
import { createPostSchema } from "../lib/schemas";
import type { CreatePostValues } from "../lib/schemas";

interface UseCreatePostFormOptions {
  defaultCommunityId?: string;
  onSuccess?: (postId: string) => void;
  navigateOnSuccess?: boolean;
}

export const useCreatePostForm = (options?: UseCreatePostFormOptions) => {
  const createPostMutation = useCreatePostMutation();
  const navigate = useNavigate();

  const defaultValues: CreatePostValues = {
    communityId: options?.defaultCommunityId ?? "",
    content: "",
    title: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (createPostMutation.isPending) {
        return;
      }

      try {
        const result = await createPostMutation.mutateAsync({
          input: {
            communityId: value.communityId,
            content: value.content || undefined,
            title: value.title,
            type: PostType.Text,
          },
        });

        if (result.createPost) {
          const postId = result.createPost.id;
          notificationActions.success("Post created!", "Your post has been published");
          options?.onSuccess?.(postId);

          if (options?.navigateOnSuccess !== false) {
            navigate({
              params: { postId },
              to: "/post/$postId",
            });
          }
        }
      } catch (error) {
        logger.error("Failed to create post:", error);
        notificationActions.error(
          "Failed to create post",
          error instanceof Error ? error.message : "Please try again later"
        );
        throw error;
      }
    },
    validators: {
      onSubmit: createPostSchema,
    },
  });

  const reset = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    error: createPostMutation.error,
    form,
    isSubmitting: createPostMutation.isPending,
    reset,
  };
};
