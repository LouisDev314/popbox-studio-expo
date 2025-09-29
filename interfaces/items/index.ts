export interface IItemsResponse {
  items: IItemCard[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface IPrize {
  rank: string;
  name: string;
  description: string;
  caption: string;
  quantity: number;
  imgUrl: string;
  probability: number;
}

export interface IKuji {
  _id: string;
  title: string;
  images: string[];
  price: number;
  category: string;
  prizes: IPrize[];
  totalTickets: number;
  remainingTickets: number;
  isActive: boolean;
  createdAt: string;
  itemType: string;
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

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  price: number;
  inventory: number;
  material: string;
  size: string;
  isActive: boolean;
  createdAt: string;
  itemType: string;
}

export interface IItem extends IProduct {
  category: string;
  prizes: IPrize[];
  totalTickets: number;
  remainingTickets: number;
}
