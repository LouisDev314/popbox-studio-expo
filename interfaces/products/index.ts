import IProduct from '@/models/product';

export type IProductCard = Pick<IProduct, '_id' | 'title' | 'images' | 'category' | 'price' | 'inventory' | 'createdAt'>

export interface IProductsResponse {
  items: IProductCard[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
