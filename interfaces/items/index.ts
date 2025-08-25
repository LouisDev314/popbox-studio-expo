import IKuji from '@/interfaces/kuji';
import IProduct from '@/interfaces/product';

export interface IItemsResponse {
  items: IKujiCard[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export type IKujiCard = Pick<IKuji, '_id' | 'title' | 'images' | 'category' | 'price' | 'totalTickets' | 'remainingTickets' | 'createdAt'>

export type IProductCard = Pick<IProduct, '_id' | 'title' | 'images' | 'category' | 'price' | 'inventory' | 'createdAt'>
