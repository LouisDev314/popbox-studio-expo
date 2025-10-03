import { IOrder } from '@/interfaces/order';
import { User } from 'firebase/auth';
import { IWishlistItem } from '@/interfaces/wishlist';
import { ICartItem } from '@/interfaces/cart';

export interface IUser extends User {
  uid: string;
  username: string;
  email: string;
  avatar: string;
  wishlist: IWishlistItem[];
  cart: ICartItem[];
  address: string;
  order: IOrder[];
  role: 'user' | 'admin';
  settings: {};
}
