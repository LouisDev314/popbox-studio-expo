import { useInfiniteQuery } from '@tanstack/react-query';
import { IProductsResponse } from '@/interfaces/products';
import queryConfigs from '@/configs/api/query-config';

const useProductsInfinite = (search?: string, category?: string) =>
  useInfiniteQuery<IProductsResponse, Error>({
    // useInfiniteQuery auto passes pageParam (cursor) and queryKey to queryFn
    queryKey: ['products', { search, category }],
    queryFn: queryConfigs.fetchProducts,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

export default useProductsInfinite;
