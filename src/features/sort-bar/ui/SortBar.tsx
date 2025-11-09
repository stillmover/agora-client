import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ChevronDown, Filter, MapPin } from "lucide-react";
import { useUserPlaceQuery } from "@/shared/services";

export type SortOption = "best" | "hot" | "new" | "rising" | "top";
export type RegionOption = "global" | "my-country";

type SortBarProps = {
  sort: SortOption;
  region: RegionOption;
  onSortChange: (sort: SortOption) => void;
  onRegionChange: (region: RegionOption) => void;
  onFilterClick?: () => void;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best", label: "Best" },
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "rising", label: "Rising" },
  { value: "top", label: "Top" },
];

const REGION_OPTIONS: { value: RegionOption; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "my-country", label: "My Country" },
];

export const SortBar = ({
  sort,
  region,
  onSortChange,
  onRegionChange,
  onFilterClick,
}: SortBarProps) => {
  const { data: place } = useUserPlaceQuery(region === "my-country");

  const currentRegionLabel =
    region === "my-country"
      ? (place?.displayName ??
        REGION_OPTIONS.find((opt) => opt.value === region)?.label)
      : REGION_OPTIONS.find((opt) => opt.value === region)?.label;

  return (
    <nav
      className="flex items-center justify-between py-4 border-b"
      aria-label="Feed sorting and filtering options"
    >
      <div className="flex items-center gap-4">
        {/* Sort Tabs */}
        <fieldset className="space-y-2">
          <legend className="sr-only">Sort posts by</legend>
          <Tabs
            value={sort}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <TabsList
              className="grid w-full grid-cols-5"
              role="tablist"
              aria-label="Sort options"
            >
              {SORT_OPTIONS.map((option) => (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  className="text-sm focus-visible:ring-2 focus-visible:ring-orange-500"
                  aria-selected={sort === option.value}
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </fieldset>

        {/* Region Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`Current region: ${currentRegionLabel}. Click to change region`}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{currentRegionLabel}</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {REGION_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onRegionChange(option.value)}
                className="flex items-center gap-2 focus-visible:bg-accent focus-visible:text-accent-foreground"
                aria-selected={region === option.value}
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {option.value === "my-country" && place?.displayName
                  ? place.displayName
                  : option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFilterClick}
        className="gap-2 focus-visible:ring-2 focus-visible:ring-purple-500"
        aria-label="Open filters menu"
      >
        <Filter className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Filters</span>
        <Badge
          variant="secondary"
          className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
          aria-label="No active filters"
        >
          0
        </Badge>
      </Button>
    </nav>
  );
};
