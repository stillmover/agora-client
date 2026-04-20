import { cn } from "@/shared/lib/utils";
import { Button } from "./button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: VoidFunction;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: VoidFunction;
    href?: string;
  };
  className?: string;
  size?: "sm" | "default" | "lg";
}

const sizeConfig = {
  default: {
    container: "py-12 px-6",
    description: "text-sm",
    icon: "h-12 w-12",
    iconContainer: "h-16 w-16 mb-4",
    maxWidth: "max-w-sm",
    title: "text-lg",
  },
  lg: {
    container: "py-16 px-8",
    description: "text-base",
    icon: "h-16 w-16",
    iconContainer: "h-20 w-20 mb-5",
    maxWidth: "max-w-md",
    title: "text-xl",
  },
  sm: {
    container: "py-8 px-4",
    description: "text-sm",
    icon: "h-10 w-10",
    iconContainer: "h-14 w-14 mb-3",
    maxWidth: "max-w-xs",
    title: "text-base",
  },
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "default",
}: EmptyStateProps) => {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.container,
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "rounded-full bg-muted flex items-center justify-center",
            config.iconContainer
          )}
        >
          <Icon className={cn("text-muted-foreground/60", config.icon)} />
        </div>
      )}

      <h3 className={cn("font-semibold text-foreground mb-2", config.title)}>{title}</h3>

      {description && (
        <p className={cn("text-muted-foreground mb-6", config.description, config.maxWidth)}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {action && (
            <Button variant="brand" onClick={action.onClick} asChild={Boolean(action.href)}>
              {action.href ? <a href={action.href}>{action.label}</a> : action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              asChild={Boolean(secondaryAction.href)}
            >
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              ) : (
                secondaryAction.label
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const NoPostsEmptyState = () => (
  <EmptyState
    title="No posts yet"
    description="Be the first to share something with the community!"
    action={{
      href: "/submit",
      label: "Create a post",
    }}
  />
);

export const NoCommentsEmptyState = () => (
  <EmptyState
    title="No comments yet"
    description="Start the conversation by leaving a comment."
    size="sm"
  />
);

export const NoResultsEmptyState = ({ query }: { query?: string }) => (
  <EmptyState
    title="No results found"
    description={
      query
        ? `We couldn't find anything matching "${query}". Try different keywords.`
        : "Try adjusting your search or filters."
    }
  />
);

export const NotFoundEmptyState = () => (
  <EmptyState
    title="Page not found"
    description="The page you're looking for doesn't exist or has been moved."
    action={{
      href: "/",
      label: "Go home",
    }}
    size="lg"
  />
);

export const ErrorEmptyState = ({ onRetry }: { onRetry?: VoidFunction }) => (
  <EmptyState
    title="Something went wrong"
    description="We encountered an error. Please try again."
    action={
      onRetry
        ? {
            label: "Try again",
            onClick: onRetry,
          }
        : undefined
    }
  />
);

export const NoNotificationsEmptyState = () => (
  <EmptyState
    title="All caught up!"
    description="You don't have any notifications right now."
    size="sm"
  />
);

export const NoSavedPostsEmptyState = () => (
  <EmptyState
    title="No saved posts"
    description="Save posts to read them later. They'll appear here."
    action={{
      href: "/",
      label: "Browse posts",
    }}
  />
);
