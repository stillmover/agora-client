import { useEffect } from 'react';
import { useGetApiMe } from '@/shared/api/endpoints/authentication/authentication';
import { authActions } from '../model/auth.store';

export const useAuthSync = () => {
  const { data, isError, isLoading } = useGetApiMe();

  useEffect(() => {
    if (data?.user) {
      const user = data.data.user;
      authActions.login({
        id: String(user.id),
        username: user.username,
      });
    } else if (isError) {
      authActions.logout();
    }
  }, [data, isError]);

  return { isLoading };
};
