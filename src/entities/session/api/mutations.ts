import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionApi } from "./sessionApi";
import { sessionKeys } from "./query-keys";
import { sessionActions, sessionStore } from "../model/session-store";
import { logger } from "@/shared/services/logger";
import { extractUserFromResponse } from "./types";
import type {
  PostApiLoginBodyOne,
  PostApiRegisterBodyOne,
} from "@/shared/api/models";

const setLoadingState = () => {
  sessionStore.setState((prev) => ({
    ...prev,
    isLoading: true,
    error: null,
  }));
};

const setErrorState = (error: unknown, fallbackMessage: string) => {
  sessionStore.setState((prev) => ({
    ...prev,
    isLoading: false,
    error: error instanceof Error ? error.message : fallbackMessage,
  }));
};

const syncUserAfterAuth = async (
  queryClient: ReturnType<typeof useQueryClient>,
  actionName: string,
): Promise<void> => {
  const userResponse = await sessionApi.getCurrentUser();
  const userData = extractUserFromResponse(userResponse);

  if (userData) {
    sessionActions.login({
      id: String(userData.id),
      username: userData.username,
      email: userData.email ?? undefined,
    });

    queryClient.setQueryData(sessionKeys.me(), userResponse);
    logger.info(`User ${actionName} successfully`, { userId: userData.id });
  } else {
    throw new Error(`${actionName} successful but failed to fetch user data`);
  }
};

const handlePostAuth = async (
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> => {
  try {
    await syncUserAfterAuth(queryClient, "authenticated");
  } catch (error) {
    logger.error("Failed to fetch user data after authentication:", error);
  }
};

const createAuthMutation = <TPayload>(
  authFn: (payload: TPayload) => Promise<unknown>,
  actionName: string,
) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (payload: TPayload) => {
        setLoadingState();
        const response = await authFn(payload);

        try {
          await syncUserAfterAuth(queryClient, actionName);
        } catch (error) {
          setErrorState(
            error,
            `Failed to fetch user data after ${actionName.toLowerCase()}`,
          );
          throw error;
        }

        return response;
      },
      onError: (error) => {
        setErrorState(error, `${actionName} failed`);
        logger.error(`${actionName} failed`, error);
      },
    });
  };
};

const useLoginMutation = createAuthMutation<PostApiLoginBodyOne>(
  sessionApi.login,
  "Login",
);

const useRegisterMutation = createAuthMutation<PostApiRegisterBodyOne>(
  sessionApi.register,
  "Registration",
);

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      setLoadingState();
      return await sessionApi.logout();
    },
    onSettled: async () => {
      sessionActions.logout();
      await queryClient.cancelQueries();
      queryClient.removeQueries({ queryKey: sessionKeys.all });
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          !Array.isArray(queryKey) ||
          (queryKey[0] as string | undefined) !== sessionKeys.all[0],
        refetchType: "none",
      });
      logger.info("User logged out successfully");
    },
    onError: (error) => {
      setErrorState(error, "Logout failed");
      logger.error("Logout failed", error);
    },
  });
};

export const useLogout = () => {
  const mutation = useLogoutMutation();
  return {
    logout: async () => {
      await mutation.mutateAsync();
    },
    isPending: mutation.isPending,
  };
};

export {
  handlePostAuth,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
};
