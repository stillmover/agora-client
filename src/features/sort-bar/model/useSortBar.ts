import { useMemo } from "react";
import { useUserPlaceQuery } from "@/shared/services";
import { REGION_OPTIONS } from "../lib/constants";
import type { RegionOption } from "@/shared/types";

interface UseSortBarOptions {
  region: RegionOption;
}

export const useSortBar = ({ region }: UseSortBarOptions) => {
  const { data: place } = useUserPlaceQuery(region === "my-country");

  const currentRegionLabel = useMemo(() => {
    if (region === "my-country") {
      return place?.displayName ?? REGION_OPTIONS.find((opt) => opt.value === region)?.label;
    }
    return REGION_OPTIONS.find((opt) => opt.value === region)?.label ?? "Global";
  }, [region, place?.displayName]);

  return {
    currentRegionLabel,
    place,
  };
};
