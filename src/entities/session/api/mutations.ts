import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionApi } from "./sessionApi";
import { sessionKeys } from "./query-keys";
import { sessionActions } from "../model/session-store";
import { logger } from "@/shared/services/logger";
import type {
  PostApiLoginBodyOne,
  PostApiRegisterBodyOne,
} from "@/shared/api/models";

const handlePostAuth = async (
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> => {
  try {
    const userData = await sessionApi.getCurrentUser();

    if (
      userData &&
      (userData as any).success === true &&
      (userData as any).data?.user
    ) {
      const user = (userData as any).data.user;
      sessionActions.login({
        id: String(user.id),
        username: user.username,
        email: user.email ?? undefined,
      });

      // Keep the cache shape consistent with the queryFn/select expectations
      queryClient.setQueryData(sessionKeys.me(), userData);
    }
  } catch (error) {
    logger.error("Failed to fetch user data after authentication:", error);
  }
};

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: PostApiLoginBodyOne) =>
      sessionApi.login(credentials),
    onSuccess: async () => {
      await handlePostAuth(queryClient);
    },
  });
};

const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostApiRegisterBodyOne) => sessionApi.register(data),
    onSuccess: async () => {
      await handlePostAuth(queryClient);
    },
  });
};

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sessionApi.logout(),
    onSuccess: () => {
      // Clear query cache after successful API logout
      queryClient.removeQueries({ queryKey: sessionKeys.all });
      queryClient.clear();
    },
  });
};

export {
  handlePostAuth,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
};
