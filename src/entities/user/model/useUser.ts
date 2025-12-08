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

  const user = useMemo(() => {
    return data ? mapUser(data) : null;
  }, [data]);

  return {
    user,
    isLoading,
    error,
    refetch,
  };
};

export const useUserByUsername = (username: string) => {
  const { data, isLoading, error, refetch } = useUserByUsernameGql(username, {
    enabled: Boolean(username),
  });

  const user = useMemo(() => {
    return data ? mapUser(data) : null;
  }, [data]);

  return {
    user,
    isLoading,
    error,
    refetch,
  };
};
