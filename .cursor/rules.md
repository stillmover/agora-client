# Cursor Rules — Sentry Usage

## Error Tracking

- Always use `Sentry.captureException(error)` for handled errors
- Never rely on `console.error` for production error tracking
- All critical UI trees must be wrapped in `Sentry.ErrorBoundary`

## Performance & Tracing

- Use `Sentry.startSpan` for:
  - UI interactions (buttons, forms)
  - API calls
  - Multi-step async logic
- Spans must have meaningful `op` and `name`
- Prefer nested spans for complex flows

## Logging

- Import Sentry as: `import * as Sentry from "@sentry/react"`
- Use `const { logger } = Sentry`
- Use `logger.fmt` for structured values
- Avoid raw console logs in business logic

## Configuration

- Sentry DSN must always come from environment variables
- Never hardcode secrets
- Sentry initialization must stay centralized

## Code Quality

- Sentry instrumentation should improve observability without harming UX
- Avoid noise: do not log expected validation or user input errors
