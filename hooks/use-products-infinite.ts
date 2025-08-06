import { useInfiniteQuery } from '@tanstack/react-query';
import { IProductsResponse } from '@/interfaces/products';
import queryConfigs from '@/configs/api/query-config';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { AxiosResponse } from 'axios';
import { IKujisResponse } from '@/interfaces/kujis';

export interface IProductParam {
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
}

const useProductsInfinite = (productParam: IProductParam, isKuji: boolean, enabled?: boolean) => {
  const kujisQuery = useInfiniteQuery<AxiosResponse<IBaseApiResponse<IKujisResponse>>>({
    queryKey: ['kujis', productParam],
    queryFn: ({ pageParam }) =>
      queryConfigs.fetchKujis({
        pageParam: pageParam ? (pageParam as string) : undefined,
        ...productParam,
      }),
    enabled: isKuji ? enabled : false,
    getNextPageParam: (lastPage) => lastPage.data.data.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

  const productsQuery = useInfiniteQuery<AxiosResponse<IBaseApiResponse<IProductsResponse>>>({
    queryKey: ['products', productParam],
    queryFn: ({ pageParam }) =>
      queryConfigs.fetchProducts({
        pageParam: pageParam ? (pageParam as string) : undefined,
        ...productParam,
      }),
    enabled: !isKuji ? enabled : false,
    getNextPageParam: (lastPage) => lastPage.data.data.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

  return isKuji ? kujisQuery : productsQuery;
};

export default useProductsInfinite;
