import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionApi } from "./sessionApi";
import { sessionKeys } from "./query-keys";
import { sessionActions, sessionStore } from "../model/session-store";
import { logger } from "@/shared/services/logger";
import type {
  PostApiLoginBodyOne,
  PostApiRegisterBodyOne,
} from "@/shared/api/models";

const handlePostAuth = async (
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> => {
  try {
    const response = await sessionApi.getCurrentUser();

    const anyResponse = response as unknown as {
      success?: boolean;
      data?: { user?: unknown };
    };

    if (anyResponse?.success && anyResponse.data?.user) {
      const userData = anyResponse.data.user as {
        id: number;
        username: string;
        email?: string;
      };

      sessionActions.login({
        id: String(userData.id),
        username: userData.username,
        email: userData.email ?? undefined,
      });

      queryClient.setQueryData(sessionKeys.me(), response);

      logger.info("User authenticated successfully", { userId: userData.id });
    } else {
      logger.warn("Authentication response missing user data", response);
    }
  } catch (error) {
    logger.error("Failed to fetch user data after authentication:", error);
  }
};

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: PostApiLoginBodyOne) => {
      sessionStore.setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));
      const response = await sessionApi.login(credentials);

      try {
        const userResponse = await sessionApi.getCurrentUser();
        const anyResponse = userResponse as unknown as {
          success?: boolean;
          data?: { user?: unknown };
        };

        if (anyResponse?.success && anyResponse.data?.user) {
          const userData = anyResponse.data.user as {
            id: number;
            username: string;
            email?: string;
          };

          sessionActions.login({
            id: String(userData.id),
            username: userData.username,
            email: userData.email ?? undefined,
          });

          queryClient.setQueryData(sessionKeys.me(), userResponse);
          logger.info("User logged in successfully", { userId: userData.id });
        } else {
          throw new Error("Login successful but failed to fetch user data");
        }
      } catch (error) {
        sessionStore.setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to fetch user data after login",
        }));
        throw error;
      }

      return response;
    },
    onError: (error) => {
      sessionStore.setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      logger.error("Login failed", error);
    },
  });
};

const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostApiRegisterBodyOne) => {
      sessionStore.setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));
      const response = await sessionApi.register(data);

      try {
        const userResponse = await sessionApi.getCurrentUser();
        const anyResponse = userResponse as unknown as {
          success?: boolean;
          data?: { user?: unknown };
        };

        if (anyResponse?.success && anyResponse.data?.user) {
          const userData = anyResponse.data.user as {
            id: number;
            username: string;
            email?: string;
          };

          sessionActions.login({
            id: String(userData.id),
            username: userData.username,
            email: userData.email ?? undefined,
          });

          queryClient.setQueryData(sessionKeys.me(), userResponse);
          logger.info("User registered successfully", { userId: userData.id });
        } else {
          throw new Error(
            "Registration successful but failed to fetch user data",
          );
        }
      } catch (error) {
        sessionStore.setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to fetch user data after registration",
        }));
        throw error;
      }

      return response;
    },
    onError: (error) => {
      sessionStore.setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
      logger.error("Registration failed", error);
    },
  });
};

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      sessionStore.setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));
      return await sessionApi.logout();
    },
    onSettled: () => {
      sessionActions.logout();
      queryClient.removeQueries({ queryKey: sessionKeys.all });
      queryClient.clear();
      logger.info("User logged out successfully");
    },
    onError: (error) => {
      sessionStore.setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      }));
      logger.error("Logout failed", error);
    },
  });
};

export {
  handlePostAuth,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
};
