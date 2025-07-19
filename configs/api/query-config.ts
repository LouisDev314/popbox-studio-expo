import appClient from '@/api/app-client';
import { IProductsResponse } from '@/interfaces/products';
import { QueryFunctionContext } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';

const QueryConfigs = {
  fetchUser: (uid: string): Promise<AxiosResponse<IBaseApiResponse<IUser>>> => {
    return appClient.get(`/users/${uid}`);
  },
  fetchProducts: async (context: QueryFunctionContext): Promise<IProductsResponse> => {
    const { queryKey, pageParam } = context;
    const [, { search, category }] = queryKey as [string, { search?: string; category?: string }];
    const res = await appClient.get<IProductsResponse>('/products', {
      params: {
        cursor: pageParam,
        search,
        category,
        limit: 10,
      },
    });
    return res.data;
  },
  fetchProductById: (id: string) => {
    return appClient.get(`/products/${id}`);
  },
};

export default QueryConfigs;
