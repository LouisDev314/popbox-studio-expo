import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import queryConfigs from '@/configs/api/query-config';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IItemsResponse } from '@/interfaces/items';

export interface IItemParam {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
}

const useItemsInfinite = (itemParam: IItemParam, isKuji: boolean, isPopular: boolean, enabled?: boolean) => {
  const queryFn = isKuji ? queryConfigs.fetchKujis : queryConfigs.fetchProducts;

  return useInfiniteQuery<AxiosResponse<IBaseApiResponse<IItemsResponse>>>({
    queryKey: [isKuji ? 'kujis' : 'products', isPopular ? 'popular' : '', itemParam],
    queryFn: ({ pageParam }) => queryFn({
      pageParam,
      ...itemParam,
    }),
    enabled: enabled ?? true,
    getNextPageParam: (lastPage) => lastPage.data.data.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
};

export default useItemsInfinite;
