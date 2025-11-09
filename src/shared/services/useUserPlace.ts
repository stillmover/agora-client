import { useQuery } from "@tanstack/react-query";
import { detectUserPlace, type UserPlace } from "./geolocation";

const userPlaceQueryKey = ["userPlace"] as const;

export function useUserPlaceQuery(enabled: boolean) {
  return useQuery<UserPlace | undefined>({
    queryKey: userPlaceQueryKey,
    queryFn: () => detectUserPlace(),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export { userPlaceQueryKey };
