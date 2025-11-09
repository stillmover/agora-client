import { useQuery } from "@tanstack/react-query";
import { detectUserPlace, type UserPlace } from "./geolocation";

const userPlaceQueryKey = ["userPlace"] as const;

export function useUserPlaceQuery(enabled: boolean) {
  return useQuery<UserPlace | null>({
    queryKey: userPlaceQueryKey,
    queryFn: async (): Promise<UserPlace | null> => {
      const result = await detectUserPlace();
      return result ?? null;
    },
    enabled,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export { userPlaceQueryKey };
