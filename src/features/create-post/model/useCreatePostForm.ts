import { useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useCreatePostMutation } from "@/shared/api/gql/query-hooks";
import { PostType } from "@/shared/api/gql";
import { notificationActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";
import { createPostSchema, type CreatePostValues } from "../lib/schemas";

type UseCreatePostFormOptions = {
  defaultCommunityId?: string;
  onSuccess?: (postId: string) => void;
  navigateOnSuccess?: boolean;
};

/**
 * Form hook for creating posts using TanStack Form + TanStack Query mutation.
 */
export const useCreatePostForm = (options?: UseCreatePostFormOptions) => {
  const createPostMutation = useCreatePostMutation();
  const navigate = useNavigate();

  const defaultValues: CreatePostValues = {
    title: "",
    content: "",
    communityId: options?.defaultCommunityId ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      // Only validate on submit to reduce unnecessary validations
      onSubmit: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      if (createPostMutation.isPending) return;

      try {
        const result = await createPostMutation.mutateAsync({
          input: {
            communityId: value.communityId,
            title: value.title,
            content: value.content || undefined,
            type: PostType.Text,
          },
        });

        if (result.createPost) {
          const postId = result.createPost.id;
          notificationActions.success(
            "Post created!",
            "Your post has been published",
          );
          options?.onSuccess?.(postId);

          if (options?.navigateOnSuccess !== false) {
            navigate({
              to: "/post/$postId",
              params: { postId },
            });
          }
        }
      } catch (error) {
        logger.error("Failed to create post:", error);
        notificationActions.error(
          "Failed to create post",
          error instanceof Error ? error.message : "Please try again later",
        );
        throw error;
      }
    },
  });

  const reset = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    form,
    isSubmitting: createPostMutation.isPending,
    error: createPostMutation.error,
    reset,
  };
};
