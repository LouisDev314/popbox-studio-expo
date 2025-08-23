import appClient from '@/api/app-client';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import { IItemsResponse } from '@/interfaces/items';

const QueryConfigs = {
  fetchUser: (uid: string): Promise<AxiosResponse<IBaseApiResponse<IUser>>> => {
    return appClient.get(`/users/${uid}`);
  },
  fetchProducts: async ({
                          pageParam = undefined,
                          search,
                          category,
                          sortBy,
                          order = 'desc',
                        }: {
    pageParam?: string | unknown;
    search?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }): Promise<AxiosResponse<IBaseApiResponse<IItemsResponse>>> => {
    return await appClient.get('/products', {
      params: {
        // limit: 10,
        cursor: pageParam ?? '',
        search,
        category,
        sortBy,
        order: order.toLowerCase(),
      },
    });
  },
  fetchTrendingProducts: () => {
    return appClient.get('/products/trending');
  },
  fetchTrendingKujis: () => {
    return appClient.get('/kujis/trending');
  },
  fetchProductById: (id: string) => {
    return appClient.get(`/products/${id}`);
  },
  fetchKujis: async ({
                       pageParam = undefined,
                       search,
                       category,
                       sortBy,
                       order = 'desc',
                     }: {
    pageParam?: string | unknown;
    search?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }): Promise<AxiosResponse<IBaseApiResponse<IItemsResponse>>> => {
    return await appClient.get('/kujis', {
      params: {
        // limit: 10,
        cursor: pageParam ?? '',
        search,
        category,
        sortBy,
        order: order.toLowerCase(),
      },
    });
  },
};

export default QueryConfigs;
