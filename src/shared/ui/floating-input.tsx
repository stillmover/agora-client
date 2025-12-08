import { Input } from "@/shared/ui/input";
import { FormErrorText } from "@/shared/ui/form-error-text";
import { cn } from "@/shared/lib/utils";
import type { ComponentProps } from "react";

interface FloatingInputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FloatingInput = ({
  id,
  label,
  error,
  required,
  className,
  value,
  ...props
}: FloatingInputProps) => {
  const hasValue = Boolean(value) || Boolean(props?.autoFocus);
  const hasError = Boolean(error);

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        placeholder=" "
        aria-invalid={hasError}
        {...props}
        className={cn(
          "peer rounded-full px-6 pt-5 pb-2 text-sm bg-[#E5EBEE] hover:bg-[#DBE4E9] dark:border-none dark:bg-[#2a3236] h-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          hasError && "border-destructive focus-visible:ring-destructive/50",
          className,
        )}
      />

      <label
        htmlFor={id}
        className={cn(
          "absolute left-6 transition-all duration-200 ease-out pointer-events-none",
          hasValue || hasError
            ? "top-2 text-xs"
            : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs",
          hasError
            ? "text-destructive"
            : "text-gray-500 dark:text-[#D7DADC] peer-focus:text-gray-500",
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <FormErrorText>{error}</FormErrorText>
    </div>
  );
};
