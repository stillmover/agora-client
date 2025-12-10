import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  success?: boolean | string;
  required?: boolean;
  charCount?: number;
  charMax?: number;
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export const FormField = ({
  label,
  hint,
  error,
  success,
  required,
  charCount,
  charMax,
  className,
  children,
  htmlFor,
}: FormFieldProps) => {
  const showCounter = charCount !== undefined && charMax !== undefined;
  const isOverLimit = showCounter && charCount > charMax;
  const successMessage = typeof success === "string" ? success : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
          {showCounter && (
            <span
              className={cn(
                "text-xs tabular-nums transition-colors",
                isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"
              )}
            >
              {charCount}/{charMax}
            </span>
          )}
        </div>
      )}

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}

      <div className="relative">{children}</div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-1.5 text-destructive"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span className="text-xs">{error}</span>
          </motion.div>
        )}
        {!error && success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-400"
          >
            <Check className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span className="text-xs">{successMessage ?? "Looks good!"}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
