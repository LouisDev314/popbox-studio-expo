import appClient from '@/api/app-client';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import { IItemsResponse } from '@/interfaces/items';
import { IAutocompleteItem } from '@/interfaces/search';

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
  fetchAutocomplete: (query: string, isKuji: boolean): Promise<AxiosResponse<IBaseApiResponse<IAutocompleteItem[]>>> => {
    return appClient.get('/search/autocomplete', {
      params: {
        search: query,
        isKuji,
      },
    });
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
