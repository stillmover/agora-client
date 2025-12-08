import { useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useCreateCommunityMutation } from "@/shared/api/gql/query-hooks";
import { notificationActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";
import {
  createCommunitySchema,
  type CreateCommunityValues,
} from "../lib/schemas";

type UseCreateCommunityFormOptions = {
  onSuccess?: (communityName: string) => void;
  navigateOnSuccess?: boolean;
};

const DEFAULT_VALUES: CreateCommunityValues = {
  name: "",
  displayName: "",
  description: "",
  communityType: "public",
};

export const useCreateCommunityForm = (
  options?: UseCreateCommunityFormOptions,
) => {
  const createCommunityMutation = useCreateCommunityMutation();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: createCommunitySchema,
    },
    onSubmit: async ({ value }) => {
      if (createCommunityMutation.isPending) return;

      try {
        const result = await createCommunityMutation.mutateAsync({
          input: {
            name: value.name.toLowerCase(),
            displayName: value.displayName,
            description: value.description || undefined,
          },
        });

        if (result.createCommunity) {
          const communityName = result.createCommunity.name;
          notificationActions.success(
            "Community created!",
            `r/${communityName} is ready`,
          );
          options?.onSuccess?.(communityName);

          if (options?.navigateOnSuccess !== false) {
            navigate({
              to: "/r/$communityId",
              params: { communityId: communityName },
            });
          }
        }
      } catch (error) {
        logger.error("Failed to create community:", error);
        notificationActions.error(
          "Failed to create community",
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
    isSubmitting: createCommunityMutation.isPending,
    error: createCommunityMutation.error,
    reset,
  };
};
