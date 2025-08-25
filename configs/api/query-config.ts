import appClient from '@/api/app-client';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/interfaces/user';
import { IItemsResponse, IKujiCard, IProductCard } from '@/interfaces/items';
import { IAutocompleteItem } from '@/interfaces/search';
import IProduct from '@/interfaces/product';
import IKuji from '@/interfaces/kuji';

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
  fetchFuzzySearch: (query: string, isKuji: boolean): Promise<AxiosResponse<IBaseApiResponse<IProductCard[] | IKujiCard[] | undefined>>> => {
    return appClient.get('/search', {
      params: {
        search: query,
        isKuji,
      },
    });
  },
  fetchItemById: (id: string, isKuji: boolean): Promise<AxiosResponse<IBaseApiResponse<IProduct | IKuji>>> => {
    return appClient.get(`/${isKuji ? 'kujis' : 'products'}/${id}`);
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
