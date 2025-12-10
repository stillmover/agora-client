import { useMemo } from "react";
import {
  useUserQuery as useUserGql,
  useUserByUsernameQuery as useUserByUsernameGql,
} from "@/shared/api/gql/query-hooks";
import { mapUser } from "../api/mappers";

export const useUser = (userId: string) => {
  const { data, isLoading, error, refetch } = useUserGql(userId, {
    enabled: Boolean(userId),
  });

  const user = useMemo(() => (data ? mapUser(data) : undefined), [data]);

  return {
    error,
    isLoading,
    refetch,
    user,
  };
};

export const useUserByUsername = (username: string) => {
  const { data, isLoading, error, refetch } = useUserByUsernameGql(username, {
    enabled: Boolean(username),
  });

  const user = useMemo(() => (data ? mapUser(data) : undefined), [data]);

  return {
    error,
    isLoading,
    refetch,
    user,
  };
};
