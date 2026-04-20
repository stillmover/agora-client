import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ErrorBoundary as ReactErrorBoundary, useErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import { AlertTriangle, ArrowLeft, Info, RefreshCw } from "lucide-react";

import { ROUTES } from "@/shared/config";
import { logger } from "@/shared/services/logger";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

interface AppErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
  fallbackRoute?: string;
  resetLabel?: string;
  fallbackLabel?: string;
  showDetails?: boolean;
  onReset?: (details: { reason: string; args: unknown[] }) => void;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
  className?: string;
}

type ErrorFallbackProps = FallbackProps & {
  title: string;
  description: string;
  fallbackRoute: string;
  resetLabel: string;
  fallbackLabel: string;
  showDetailsDefault: boolean;
  className?: string;
};

const ErrorFallback = ({
  error,
  resetErrorBoundary,
  title,
  description,
  fallbackRoute,
  resetLabel,
  fallbackLabel,
  showDetailsDefault,
  className,
}: ErrorFallbackProps) => {
  const [showDetails, setShowDetails] = useState(showDetailsDefault);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  const handleRetry = () => {
    setShowDetails(showDetailsDefault);
    resetErrorBoundary();
  };

  return (
    <div className="min-h-[50vh] bg-muted/20 px-4 py-12">
      <Card
        ref={cardRef}
        tabIndex={-1}
        role="alert"
        aria-live="polite"
        className={cn("mx-auto w-full max-w-xl border-border/80 shadow-sm", className)}
      >
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
            {title}
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            <Button
              onClick={handleRetry}
              className="w-full sm:w-auto"
              aria-label="Retry loading this view"
            >
              <RefreshCw className="h-4 w-4" />
              {resetLabel}
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-center text-muted-foreground sm:w-auto"
              aria-label="Return to a safe page"
            >
              <Link to={fallbackRoute}>
                <ArrowLeft className="h-4 w-4" />
                {fallbackLabel}
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/70 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              If this keeps happening, try again or head back home. Your content stays safe.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowDetails((prev) => !prev)}
              aria-expanded={showDetails}
              aria-controls="error-details"
            >
              <Info className="h-4 w-4" />
              {showDetails ? "Hide details" : "Show details"}
            </Button>
          </div>

          {showDetails && (
            <div
              id="error-details"
              className="rounded-lg border border-border/70 bg-muted/70 p-3 text-left"
            >
              <p className="text-xs font-semibold text-foreground">Technical details</p>
              <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-muted-foreground">
                {error?.message ?? "Unknown error"}
              </p>
              {error?.stack && (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-muted-foreground/90">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export function ErrorBoundary({
  children,
  title = "We hit a snag",
  description = "Something broke while loading this page. You can try again or go back to a safe place.",
  fallbackRoute = ROUTES.HOME,
  resetLabel = "Try again",
  fallbackLabel = "Back home",
  showDetails = false,
  onReset,
  onError,
  className,
}: AppErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallbackRender={(fallbackProps) => (
        <ErrorFallback
          {...fallbackProps}
          title={title}
          description={description}
          fallbackRoute={fallbackRoute}
          resetLabel={resetLabel}
          fallbackLabel={fallbackLabel}
          showDetailsDefault={showDetails}
          className={className}
        />
      )}
      onError={(error, errorInfo) => {
        logger.error("ErrorBoundary caught an error:", error, errorInfo);
        onError?.(error, errorInfo);
      }}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export const useErrorHandler = () => {
  const { showBoundary } = useErrorBoundary();

  return (error: unknown) => {
    const normalizedError = error instanceof Error ? error : new Error("Unexpected error");

    logger.error("Error caught by error handler:", normalizedError, {
      original: error,
    });

    showBoundary(normalizedError);
  };
};
