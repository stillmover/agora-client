import * as Sentry from "@sentry/react";

type LogLevel = "debug" | "info" | "warn" | "error";

type SentryLogger = typeof Sentry.logger & {
  fmt?: (strings: TemplateStringsArray, ...values: unknown[]) => unknown;
};

const sentryLogger = Sentry.logger as SentryLogger;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toContext = (payload: unknown[]): Record<string, unknown> | undefined => {
  if (!payload.length) {
    return undefined;
  }

  if (payload.length === 1 && isRecord(payload[0])) {
    return payload[0];
  }

  return {
    payload: payload.map((value) =>
      value instanceof Error
        ? { message: value.message, name: value.name, stack: value.stack }
        : value
    ),
  };
};

const formatMessage = (message: string, context?: Record<string, unknown>) => {
  if (typeof sentryLogger.fmt === "function") {
    return context ? sentryLogger.fmt`${message} ${context}` : sentryLogger.fmt`${message}`;
  }

  return message;
};

const log = (level: LogLevel, message: string, ...payload: unknown[]) => {
  const context = toContext(payload);
  const formattedMessage = formatMessage(message, context);
  const fn =
    level === "debug"
      ? sentryLogger.debug
      : level === "info"
        ? (sentryLogger.info ?? sentryLogger.debug)
        : level === "warn"
          ? sentryLogger.warn
          : sentryLogger.error;

  fn?.(formattedMessage as string, context);
};

export const logger = {
  debug: (message: string, ...payload: unknown[]) => log("debug", message, ...payload),
  info: (message: string, ...payload: unknown[]) => log("info", message, ...payload),
  warn: (message: string, ...payload: unknown[]) => log("warn", message, ...payload),
  error: (message: string, ...payload: unknown[]) => log("error", message, ...payload),
  fmt: sentryLogger.fmt,
};

export type ILogger = Pick<typeof logger, "debug" | "info" | "warn" | "error">;
