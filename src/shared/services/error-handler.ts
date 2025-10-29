import { logger } from "./logger";

export type AppError = {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
};

export const handleError = (error: unknown, context?: string): AppError => {
  let errorMessage: string;
  if (context) {
    errorMessage = `Error in ${context}: ${getErrorMessage(error)}`;
  } else {
    errorMessage = getErrorMessage(error);
  }

  logger.error(errorMessage, error);

  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
      details: error.stack,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return {
    message: "An unexpected error occurred",
    details: error,
  };
};

export const formatUserMessage = (error: AppError): string => {
  return error.message || "Something went wrong. Please try again.";
};

export const AppErrorHandler = {
  formatUserMessage,
  handle: handleError,
};
