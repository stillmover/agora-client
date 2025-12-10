import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  name?: string;
}

const sizeClasses = {
  lg: {
    box: "h-6 w-6",
    description: "text-sm",
    icon: "h-3.5 w-3.5",
    label: "text-base font-medium",
  },
  md: {
    box: "h-5 w-5",
    description: "text-xs",
    icon: "h-3 w-3",
    label: "text-sm font-medium",
  },
  sm: {
    box: "h-4 w-4",
    description: "text-xs",
    icon: "h-2.5 w-2.5",
    label: "text-sm",
  },
};

export const Checkbox = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
  id,
  name,
}: CheckboxProps) => {
  const config = sizeClasses[size];
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex cursor-pointer items-start gap-3",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />

      <motion.div
        aria-hidden="true"
        whileTap={disabled ? undefined : { scale: 0.9 }}
        className={cn(
          "flex-shrink-0 rounded-md border-2 transition-all duration-200",
          "flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          config.box,
          checked
            ? "border-primary bg-primary"
            : "border-muted-foreground/50 bg-background hover:border-muted-foreground"
        )}
      >
        <motion.div
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0 }}
          transition={{ damping: 30, stiffness: 500, type: "spring" }}
        >
          <Check className={cn("text-primary-foreground", config.icon)} strokeWidth={3} />
        </motion.div>
      </motion.div>

      {(label || description) && (
        <div className="flex-1 min-w-0 pt-0.5">
          {label && <span className={cn("text-foreground", config.label)}>{label}</span>}
          {description && (
            <p className={cn("mt-0.5 text-muted-foreground", config.description)}>{description}</p>
          )}
        </div>
      )}
    </label>
  );
};
