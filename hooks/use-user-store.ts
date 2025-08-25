import { create } from 'zustand/index';
import { IUser } from '@/interfaces/user';

interface IUserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<IUserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const setUser = (user: IUser | null) => useUserStore.getState().setUser(user);
export const clearUser = () => useUserStore.getState().clearUser();
export const getUser = () => useUserStore.getState().user;
