import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Flair } from "@/shared/api/gql";

interface FlairBadgeProps {
  flair: Flair;
  size?: "sm" | "md";
}

export const FlairBadge = ({ flair, size = "md" }: FlairBadgeProps) => (
  <Badge
    variant="secondary"
    className={cn(
      "text-xs font-medium",
      size === "sm" && "px-1.5 py-0.5 text-xs",
      flair.color && `bg-[${flair.color}] text-white border-0`
    )}
    style={flair.color ? { backgroundColor: flair.color } : undefined}
  >
    {flair.label}
  </Badge>
);
