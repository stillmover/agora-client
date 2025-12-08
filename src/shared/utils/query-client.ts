import { QueryClient } from "@tanstack/react-query";
import { isDevelopment } from "./env";
import { TIME_CONSTANTS } from "@/shared/constants";
import { logger } from "@/shared/services/logger";

type ErrorWithStatus = Error & {
  status?: number;
};

const defaultQueryOptions = {
  gcTime: 10 * TIME_CONSTANTS.MINUTE,
  refetchOnMount: false,
  refetchOnReconnect: true,
  refetchOnWindowFocus: false,
  retry: (failureCount: number, error: unknown) => {
    if (error instanceof Error && "status" in error) {
      const status = (error as ErrorWithStatus).status;
      if (status !== undefined && status >= 400 && status < 500) {
        return false;
      }
    }

    return failureCount < 3;
  },
  retryDelay: (attemptIndex: number) =>
    Math.min(TIME_CONSTANTS.SECOND * 2 ** attemptIndex, 30000),
  staleTime: 5 * TIME_CONSTANTS.MINUTE,
};

const defaultMutationOptions = {
  retry: 1,
  retryDelay: TIME_CONSTANTS.SECOND,
};

const globalErrorHandler = (error: unknown) => {
  if (
    error instanceof Error &&
    "status" in error &&
    (error as ErrorWithStatus).status === 401
  ) {
    return;
  }

  if (isDevelopment) {
    logger.error("Query Error:", error);
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: defaultMutationOptions,
    queries: defaultQueryOptions,
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if ("error" in event && event.error) {
    globalErrorHandler(event.error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if ("error" in event && event.error) {
    globalErrorHandler(event.error);
  }
});

if (isDevelopment) {
  (window as Window & { queryClient?: QueryClient }).queryClient = queryClient;

  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === "added") {
      logger.debug("Query added:", event.query.queryKey);
    } else if (event.type === "removed") {
      logger.debug("Query removed:", event.query.queryKey);
    }
  });
}
