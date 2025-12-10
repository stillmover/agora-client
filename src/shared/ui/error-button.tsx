import * as Sentry from "@sentry/react";

import { Button } from "./button";

type ErrorButtonProps = {
  label?: string;
};

export const ErrorButton = ({ label = "Trigger Sentry error" }: ErrorButtonProps) => {
  const handleClick = () =>
    Sentry.startSpan({ name: "ui.error-button.click", op: "ui.action" }, () => {
      const { logger } = Sentry;
      const message =
        typeof logger.fmt === "function"
          ? logger.fmt`Emitting test error to verify Sentry wiring`
          : "Emitting test error to verify Sentry wiring";

      logger.info?.(message, { component: "ErrorButton" });
      throw new Error("Sentry test error from ErrorButton");
    });

  return (
    <Button variant="outline" onClick={handleClick}>
      {label}
    </Button>
  );
};
