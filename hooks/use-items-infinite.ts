import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import QueryConfigs from '@/configs/api/query-config';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IItemsResponse } from '@/interfaces/items';
import { IItemSearchOptions } from '@/interfaces/search';

const useItemsInfinite = (options: IItemSearchOptions, isKuji: boolean, enabled?: boolean) => {
  const queryFn = isKuji ? QueryConfigs.fetchKujis : QueryConfigs.fetchProducts;

  return useInfiniteQuery<AxiosResponse<IBaseApiResponse<IItemsResponse>>>({
    queryKey: [isKuji ? 'kujis' : 'items', options],
    queryFn: ({ pageParam }) => queryFn({
      pageParam,
      ...options,
    }),
    enabled: enabled ?? true,
    getNextPageParam: (lastPage) => lastPage.data.data.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
};

export default useItemsInfinite;
