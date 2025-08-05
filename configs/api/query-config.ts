import appClient from '@/api/app-client';
import { IProductsResponse } from '@/interfaces/products';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';

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
    pageParam?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }): Promise<AxiosResponse<IBaseApiResponse<IProductsResponse>>> => {
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
  fetchProductById: (id: string) => {
    return appClient.get(`/products/${id}`);
  },
};

export default QueryConfigs;
