import { Loader2Icon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="flex items-center gap-4">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
    </div>
  );
}

export { Spinner };
