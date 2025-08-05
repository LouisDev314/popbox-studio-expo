import { useInfiniteQuery } from '@tanstack/react-query';
import { IProductsResponse } from '@/interfaces/products';
import queryConfigs from '@/configs/api/query-config';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { AxiosResponse } from 'axios';

export interface IProductParam {
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
}

const useProductsInfinite = (productParam: IProductParam, enabled?: boolean) =>
  useInfiniteQuery<AxiosResponse<IBaseApiResponse<IProductsResponse>>>({
    queryKey: ['products', productParam],
    queryFn: ({ pageParam }) => {
      return queryConfigs.fetchProducts({ pageParam: pageParam ? pageParam as string : undefined, ...productParam });
    },
    enabled,
    getNextPageParam: (lastPage) => {
      // console.log('lastPage:', lastPage.data.data.nextCursor);
      return lastPage.data.data.nextCursor ?? undefined;
    },
    initialPageParam: undefined,
  });

export default useProductsInfinite;
