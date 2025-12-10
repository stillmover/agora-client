import type { SortOption, RegionOption } from "@/shared/types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { label: "Best", value: "best" },
  { label: "Hot", value: "hot" },
  { label: "New", value: "new" },
  { label: "Rising", value: "rising" },
  { label: "Top", value: "top" },
];

export const REGION_OPTIONS: { value: RegionOption; label: string }[] = [
  { label: "Global", value: "global" },
  { label: "My Country", value: "my-country" },
];
