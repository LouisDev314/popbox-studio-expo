import { create } from 'zustand/index';
import { IUser } from '@/models/user';

interface IUserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<IUserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const setUser = (user: IUser) => useUserStore.getState().setUser(user);
export const clearUser = () => useUserStore.getState().clearUser();
export const getUser = () => useUserStore.getState().user;
