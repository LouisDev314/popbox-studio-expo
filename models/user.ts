import { z } from 'zod';
import ISeries from '@/models/series';
import { IOrder } from '@/models/order';

export const UserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(15)
    .regex(/^[a-zA-Z0-9]+$/),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8)
    // Password must contain at least one letter, one digit, one special character, and be 8-30 characters long
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}])[a-zA-Z\d!@#$%^&*()[\]{}]{8,30}$/),
});

export interface IUser {
  username: string;
  email: string;
  avatar: string;
  wishlist: ISeries[];
  cart: ISeries[];
  address: string;
  order: IOrder[];
  role: 'user' | 'admin';
  settings: {};
}
