import { Region } from "@/shared/api/gql";
import type { RegionOption } from "@/shared/types";

export const mapRegionOptionToRegion = (
  region?: RegionOption,
  userRegion: Region | null = null,
): Region | undefined => {
  if (!region) {
    return undefined;
  }

  switch (region) {
    case "global":
      return Region.All;
    case "my-country":
      return userRegion ?? undefined;
    default:
      return undefined;
  }
};
