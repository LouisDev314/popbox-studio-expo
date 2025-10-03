export interface ICartItem {
  itemId: string;
  title: string;
  images: string[];
  price: number;
  itemType: string;
  quantity: number;
}

export interface ICartResponse {
  items: ICartItem[];
}
