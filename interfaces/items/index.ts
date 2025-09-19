import IProduct from '@/interfaces/product';
import IKuji from '@/interfaces/kuji';

export interface IItemsResponse {
  items: IItemCard[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export type IKujiCard = Pick<IKuji, '_id' | 'title' | 'images' | 'category' | 'price' | 'totalTickets' | 'remainingTickets' | 'createdAt'>

export type IItemCard =
  '_id'
  | 'itemId'
  | 'itemType'
  | 'title'
  | 'images'
  | 'category'
  | 'price'
  | 'inventory'
  | 'totalTickets'
  | 'remainingTickets'
  | 'createdAt';

export type IProductCard = Pick<IProduct, '_id' | 'title' | 'images' | 'category' | 'price' | 'inventory' | 'createdAt'>
