import IProduct from '@/models/product';

export interface IProductsResponse {
  products: Pick<IProduct, '_id' | 'title' | 'imgUrl' | 'price'>[];
  nextCursor: string | null;
}
