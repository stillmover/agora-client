import { forwardRef, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-lg border bg-background px-3 text-sm",
    "placeholder:text-muted-foreground/70",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "selection:bg-brand/20 selection:text-foreground",
  ],
  {
    variants: {
      size: {
        sm: "h-8 text-xs px-2.5",
        default: "h-10 py-2",
        lg: "h-12 text-base px-4",
      },
      variant: {
        default: "border-input shadow-xs dark:bg-input/30",
        filled: "border-transparent bg-muted hover:bg-muted/80",
        ghost: "border-transparent bg-transparent hover:bg-accent",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, variant, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, variant, className }))}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input, inputVariants };
