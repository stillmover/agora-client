import { mapExchange } from "urql";
import type { CombinedError } from "urql";
import { notificationActions } from "@/shared/stores";
import { logger } from "@/shared/services/logger";

const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHENTICATED: "Please log in to continue.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
};

const getErrorMessage = (error: CombinedError): string => {
  if (error.graphQLErrors?.length > 0) {
    const gqlError = error.graphQLErrors[0];
    const code = gqlError.extensions?.code as string | undefined;

    if (code && ERROR_MESSAGES[code]) {
      return ERROR_MESSAGES[code];
    }

    return gqlError.message || "An unexpected error occurred.";
  }

  if (error.networkError) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return error.message || "An unexpected error occurred.";
};

const shouldShowNotification = (error: CombinedError): boolean => {
  const isAuthError = error.graphQLErrors?.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED",
  );

  return !isAuthError;
};

export const errorExchange = mapExchange({
  onError(error, operation) {
    logger.error(`GraphQL ${operation.kind} error:`, {
      operationName: operation.context.url,
      error: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
    });

    if (operation.kind === "mutation" && shouldShowNotification(error)) {
      const message = getErrorMessage(error);
      notificationActions.error("Error", message);
    }
  },
});
