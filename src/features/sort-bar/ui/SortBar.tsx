import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/shared/ui";
import {
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Flame,
  TrendingUp,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import type { SortOption, RegionOption } from "@/shared/types";
import { useSortBar } from "../model/useSortBar";
import { SORT_OPTIONS, REGION_OPTIONS } from "../lib/constants";
import { cn } from "@/shared/lib/utils";

interface SortBarProps {
  sort: SortOption;
  region: RegionOption;
  onSortChange: (sort: SortOption) => void;
  onRegionChange: (region: RegionOption) => void;
  onFilterClick?: VoidFunction;
}

const sortIcons: Record<string, React.ElementType> = {
  best: Star,
  hot: Flame,
  new: Sparkles,
  rising: Clock,
  top: TrendingUp,
};

export const SortBar = ({
  sort,
  region,
  onSortChange,
  onRegionChange,
  onFilterClick,
}: SortBarProps) => {
  const { currentRegionLabel, place } = useSortBar({ region });

  return (
    <nav
      className="flex items-center gap-2 py-3 px-1"
      aria-label="Feed sorting and filtering options"
    >
      <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
        {SORT_OPTIONS.map((option) => {
          const Icon = sortIcons[option.value] || Star;
          const isActive = sort === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "transition-all duration-150 whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              aria-pressed={isActive}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive && option.value === "hot" && "text-orange-400",
                  isActive && option.value === "new" && "text-green-400"
                )}
              />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            aria-label={`Current region: ${currentRegionLabel}`}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden md:inline max-w-[100px] truncate">{currentRegionLabel}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {REGION_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onRegionChange(option.value)}
              className={cn("gap-2", region === option.value && "bg-accent")}
            >
              <MapPin className="h-4 w-4" />
              <span>
                {option.value === "my-country" && place?.displayName
                  ? place.displayName
                  : option.label}
              </span>
              {region === option.value && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={onFilterClick}
        className="gap-1.5 text-muted-foreground"
        aria-label="Open filters menu"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">Filter</span>
      </Button>
    </nav>
  );
};
