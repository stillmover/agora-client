import { useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useCreateCommunityMutation } from "@/shared/api/gql/query-hooks";
import { notificationActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";
import { createCommunitySchema } from "../lib/schemas";
import type { CreateCommunityValues } from "../lib/schemas";

interface UseCreateCommunityFormOptions {
  onSuccess?: (communityName: string) => void;
  navigateOnSuccess?: boolean;
}

const DEFAULT_VALUES: CreateCommunityValues = {
  description: "",
  displayName: "",
  name: "",
};

export const useCreateCommunityForm = (options?: UseCreateCommunityFormOptions) => {
  const createCommunityMutation = useCreateCommunityMutation();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    onSubmit: async ({ value }) => {
      if (createCommunityMutation.isPending) {
        return;
      }

      try {
        const result = await createCommunityMutation.mutateAsync({
          input: {
            description: value.description || undefined,
            displayName: value.displayName,
            name: value.name.toLowerCase(),
          },
        });

        if (result.createCommunity) {
          const communityName = result.createCommunity.name;
          notificationActions.success("Community created!", `r/${communityName} is ready`);
          options?.onSuccess?.(communityName);

          if (options?.navigateOnSuccess !== false) {
            navigate({
              params: { communityId: communityName },
              to: "/r/$communityId",
            });
          }
        }
      } catch (error) {
        logger.error("Failed to create community:", error);
        notificationActions.error(
          "Failed to create community",
          error instanceof Error ? error.message : "Please try again later"
        );
        throw error;
      }
    },
    validators: {
      onSubmit: createCommunitySchema,
    },
  });

  const reset = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    error: createCommunityMutation.error,
    form,
    isSubmitting: createCommunityMutation.isPending,
    reset,
  };
};
