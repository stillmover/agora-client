import { env, isDevelopment } from "@/shared/utils/env";
import { logger } from "@/shared/services/logger";

export const apiMutator = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const baseUrl = env.BACKEND_URL;
  const urlObj = new URL(url, baseUrl);

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  try {
    if (isDevelopment) {
      logger.debug(
        `API Request: ${options.method || "GET"} ${urlObj.toString()}`,
        {
          headers: requestHeaders,
          body: requestOptions.body,
        },
      );
    }

    const response = await fetch(urlObj.toString(), requestOptions);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData: unknown;

      try {
        errorData = await response.json();
        if (
          errorData &&
          typeof errorData === "object" &&
          "message" in errorData
        ) {
          errorMessage = String(errorData.message);
        }
      } catch {
        try {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
      }

      const error = new Error(errorMessage) as Error & {
        status: number;
        statusText: string;
        data: unknown;
      };
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;

      throw error;
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();

      if (isDevelopment) {
        logger.debug(
          `API Response: ${options.method || "GET"} ${urlObj.toString()}`,
          jsonData,
        );
      }

      return jsonData as T;
    }

    const textData = await response.text();
    return textData as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.warn("Request aborted:", urlObj.toString());
      throw error;
    }

    if (isDevelopment) {
      logger.error(
        `API Error: ${options.method || "GET"} ${urlObj.toString()}`,
        error,
      );
    }

    throw error;
  }
};
