import { z } from 'zod';
import IKuji from '@/models/kuji';
import { IOrder } from '@/models/order';

export const UserSchema =
  z.object({
    username: z
      .string()
      .min(3)
      .max(15)
      .regex(/^[a-zA-Z0-9]+$/)
      .optional(),
    email: z
      .string()
      .email()
      .optional(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}])[a-zA-Z\d!@#$%^&*()[\]{}]{8,30}$/),
  }).refine(
    (data) => !!data.username || !!data.email,
    {
      message: 'Either username or email is required',
    },
  );

export interface IUser {
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
