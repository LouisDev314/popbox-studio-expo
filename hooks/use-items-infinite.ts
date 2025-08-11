import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import queryConfigs from '@/configs/api/query-config';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IKujisResponse } from '@/interfaces/kujis';
import { IProductsResponse } from '@/interfaces/products';

export interface IItemParam {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
}

// Function overloads for type safety
function useItemsInfinite(
  itemParam: IItemParam,
  isKuji: boolean,
  enabled?: boolean,
): ReturnType<typeof useInfiniteQuery<AxiosResponse<IBaseApiResponse<IKujisResponse>>>>;

function useItemsInfinite(
  productParam: IItemParam,
  isKuji: boolean,
  enabled?: boolean,
): ReturnType<typeof useInfiniteQuery<AxiosResponse<IBaseApiResponse<IProductsResponse>>>>;

function useItemsInfinite(productParam: IItemParam, isKuji: boolean, enabled?: boolean) {
  if (isKuji) {
    return useInfiniteQuery<AxiosResponse<IBaseApiResponse<IKujisResponse>>>({
      queryKey: ['kujis', productParam],
      queryFn: ({ pageParam }) =>
        queryConfigs.fetchKujis({
          pageParam,
          ...productParam,
        }),
      enabled: enabled ?? true,
      getNextPageParam: (lastPage) => lastPage.data.data.nextCursor ?? undefined,
      initialPageParam: undefined,
    });
  }

  return useInfiniteQuery<AxiosResponse<IBaseApiResponse<IProductsResponse>>>({
    queryKey: ['products', productParam],
    queryFn: ({ pageParam }) =>
      queryConfigs.fetchProducts({
        pageParam,
        ...productParam,
      }),
    enabled: enabled ?? true,
    getNextPageParam: (lastPage) => lastPage.data.data.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}

export default useItemsInfinite;
