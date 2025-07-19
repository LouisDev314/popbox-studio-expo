import IKuji from '@/models/kuji';
import { IOrder } from '@/models/order';
import { User } from 'firebase/auth';

export interface IUser extends User {
  uid: string;
  username: string;
  email: string;
  avatar: string;
  wishlist: IKuji[];
  cart: IKuji[];
  address: string;
  order: IOrder[];
  role: 'user' | 'admin';
  settings: {};
}
