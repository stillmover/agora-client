import * as Sentry from "@sentry/react";
import type { Integration } from "@sentry/types";
import { env } from "@/shared/utils/env";

type ConsoleIntegrationFactory = (options: { levels: Array<"log" | "warn" | "error"> }) => unknown;
type BrowserTracingFactory = (options?: {
  tracePropagationTargets?: Array<string | RegExp>;
}) => unknown;

type SentryWithOptionalIntegrations = typeof Sentry & {
  consoleIntegration?: ConsoleIntegrationFactory;
  captureConsoleIntegration?: ConsoleIntegrationFactory;
  browserTracingIntegration?: BrowserTracingFactory;
};

const { logger } = Sentry;
const sentryWithIntegrations = Sentry as SentryWithOptionalIntegrations;

const consoleIntegration =
  sentryWithIntegrations.consoleIntegration?.({ levels: ["log", "warn", "error"] }) ??
  sentryWithIntegrations.captureConsoleIntegration?.({ levels: ["log", "warn", "error"] });

const tracingIntegration = sentryWithIntegrations.browserTracingIntegration?.({
  tracePropagationTargets: ["localhost", /^\//],
});

const customIntegrations = [consoleIntegration, tracingIntegration].filter(
  Boolean
) as Integration[];

const dsn = env.SENTRY_DSN;

if (!dsn) {
  logger.warn?.("Sentry DSN is not configured; telemetry is disabled.");
}

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: env.APP_ENV,
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
  profilesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  enableLogs: true,
  integrations: (defaults) => [...defaults, ...customIntegrations],
  beforeSend(event) {
    // Filter out 401 Unauthorized errors from Sentry
    if (event.exception?.values?.some((value) => value.value?.includes("status: 401"))) {
      return null;
    }
    return event;
  },
});
