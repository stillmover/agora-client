import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center gap-2",
    "whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-150 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    "shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 active:scale-[0.98] focus-visible:ring-destructive/30",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand:
          "bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 active:scale-[0.98]",
        brandOutline:
          "border-2 border-brand text-brand bg-transparent hover:bg-brand/10 active:scale-[0.98]",
        reddit:
          "rounded-full font-semibold bg-brand text-white shadow-md hover:bg-brand/90 hover:shadow-lg active:scale-[0.98]",
        redditOutline:
          "rounded-full font-semibold border-2 border-brand text-brand bg-transparent hover:bg-brand/10 active:scale-[0.98]",
        subtle:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
      },
      size: {
        xs: "h-7 px-2 text-xs gap-1 rounded-md has-[>svg]:px-1.5",
        sm: "h-8 px-3 gap-1.5 has-[>svg]:px-2.5",
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        lg: "h-11 px-6 text-base has-[>svg]:px-4",
        xl: "h-12 px-8 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
        "icon-xl": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="sr-only">Loading...</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
