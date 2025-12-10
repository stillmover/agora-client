import { useQuery } from "@tanstack/react-query";
import { detectUserPlace } from "./geolocation";
import type { UserPlace } from "./geolocation";

const userPlaceQueryKey = ["userPlace"] as const;

export function useUserPlaceQuery(enabled: boolean) {
  return useQuery<UserPlace | null>({
    enabled,
    gcTime: 24 * 60 * 60 * 1000,
    queryFn: async (): Promise<UserPlace | null> => detectUserPlace(),
    queryKey: userPlaceQueryKey,
    staleTime: 60 * 60 * 1000,
  });
}

export { userPlaceQueryKey };
