import appClient from '@/api/app-client';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/interfaces/user';
import { IItemsResponse, IKujiCard, IProductCard } from '@/interfaces/items';
import { IAutocompleteItem } from '@/interfaces/search';
import IProduct from '@/interfaces/product';
import { IWishlistItem } from '@/interfaces/wishlist';

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
  fetchProductById: (id: string): Promise<AxiosResponse<IBaseApiResponse<IProduct>>> => {
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
  fetchUserWishlist: async ({
                              uid,
                              category,
                              sortBy,
                              order = 'desc',
                            }: {
    uid?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }): Promise<AxiosResponse<IBaseApiResponse<IWishlistItem[]>>> => {
    return await appClient.get(`/wishlist-items/${uid}`, {
      params: {
        category,
        sortBy,
        order: order.toLowerCase(),
      },
    });
  },
};

export default QueryConfigs;
