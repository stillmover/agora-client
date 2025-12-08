import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type RadioOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: React.ElementType;
  disabled?: boolean;
};

type RadioCardGroupProps<T extends string = string> = {
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  direction?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
  name?: string;
  disabled?: boolean;
};

const sizeClasses = {
  sm: {
    container: "gap-2",
    card: "p-3",
    radio: "h-4 w-4",
    inner: "h-1.5 w-1.5",
    icon: "h-4 w-4",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    container: "gap-3",
    card: "p-4",
    radio: "h-5 w-5",
    inner: "h-2 w-2",
    icon: "h-5 w-5",
    label: "text-sm font-medium",
    description: "text-xs",
  },
  lg: {
    container: "gap-4",
    card: "p-5",
    radio: "h-6 w-6",
    inner: "h-2.5 w-2.5",
    icon: "h-6 w-6",
    label: "text-base font-medium",
    description: "text-sm",
  },
};

export const RadioCardGroup = <T extends string = string>({
  value,
  onChange,
  options,
  direction = "vertical",
  size = "md",
  className,
  name,
  disabled = false,
}: RadioCardGroupProps<T>) => {
  const config = sizeClasses[size];

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const enabledOptions = options.filter((o) => !o.disabled);
      const currentEnabledIndex = enabledOptions.findIndex(
        (o) => o.value === options[currentIndex].value,
      );

      let newIndex = currentEnabledIndex;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        newIndex = (currentEnabledIndex + 1) % enabledOptions.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        newIndex =
          (currentEnabledIndex - 1 + enabledOptions.length) %
          enabledOptions.length;
      }

      if (newIndex !== currentEnabledIndex) {
        onChange(enabledOptions[newIndex].value);
      }
    },
    [options, onChange],
  );

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        config.container,
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => !isDisabled && onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            whileHover={isDisabled ? undefined : { scale: 1.01 }}
            whileTap={isDisabled ? undefined : { scale: 0.99 }}
            className={cn(
              "relative flex w-full items-start gap-3 text-left",
              "rounded-xl border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              config.card,
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-muted-foreground/50 hover:bg-muted/50",
              isDisabled && "cursor-not-allowed opacity-50",
              direction === "horizontal" && "flex-1 min-w-[200px]",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 rounded-full border-2 transition-all duration-200",
                "flex items-center justify-center",
                config.radio,
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/50 bg-background",
              )}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isSelected ? 1 : 0,
                  opacity: isSelected ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "rounded-full bg-primary-foreground",
                  config.inner,
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {Icon && (
                  <Icon
                    className={cn(
                      config.icon,
                      isSelected ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                )}
                <span
                  className={cn(
                    config.label,
                    isSelected ? "text-foreground" : "text-foreground",
                  )}
                >
                  {option.label}
                </span>
              </div>
              {option.description && (
                <p
                  className={cn(
                    "mt-0.5 text-muted-foreground",
                    config.description,
                  )}
                >
                  {option.description}
                </p>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{
                scale: isSelected ? 1 : 0,
                opacity: isSelected ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex-shrink-0"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
};
