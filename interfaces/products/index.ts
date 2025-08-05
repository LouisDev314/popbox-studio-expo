import IProduct from '@/models/product';

export type IProductCardResponse = Pick<IProduct, '_id' | 'title' | 'images' | 'category' | 'price' | 'inventory' | 'createdAt'>

export interface IProductsResponse {
  items: IProductCardResponse[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
