import fetcher from '@/lib/fetcher';
import { ApiKey } from '../lib/generated/prisma';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';

const useAPIKeys = (slug: string | undefined) => {
  const url = `/api/teams/${slug}/api-keys`;

  const { data, error, isLoading } = useSWR<ApiResponse<ApiKey[]>>(() => {
    return slug ? url : null;
  }, fetcher);

  const mutateAPIKeys = async () => {
    mutate(url);
  };

  return {
    data,
    isLoading,
    error,
    mutate: mutateAPIKeys,
  };
};

export default useAPIKeys;
