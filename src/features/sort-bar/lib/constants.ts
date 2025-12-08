import type { SortOption, RegionOption } from "@/shared/types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best", label: "Best" },
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "rising", label: "Rising" },
  { value: "top", label: "Top" },
];

export const REGION_OPTIONS: { value: RegionOption; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "my-country", label: "My Country" },
];
