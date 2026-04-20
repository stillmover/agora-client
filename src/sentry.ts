import * as Sentry from "@sentry/react";
import type { Integration } from "@sentry/types";
import { env } from "@/shared/utils/env";

type ConsoleIntegrationFactory = (options: { levels: ("log" | "warn" | "error")[] }) => unknown;
type BrowserTracingFactory = (options?: {
  tracePropagationTargets?: (string | RegExp)[];
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
  beforeSend(event) {
    // Filter out 401 Unauthorized errors from Sentry
    if (event.exception?.values?.some((value) => value.value?.includes("status: 401"))) {
      return;
    }
    return event;
  },
  dsn,
  enableLogs: true,
  enabled: Boolean(dsn),
  environment: env.APP_ENV,
  integrations: (defaults) => [...defaults, ...customIntegrations],
  profilesSampleRate: import.meta.env.DEV ? 1 : 0.1,
  tracesSampleRate: import.meta.env.DEV ? 1 : 0.2,
});
