import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IUser } from '@/interfaces/user';
import { secureStorage } from '@/utils/mmkv';

interface IUserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<IUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // unique key for storage in MMKV
      storage: createJSONStorage(() => ({
        getItem: (key) => secureStorage().getString(key) || null,
        setItem: (key, value) => secureStorage().set(key, value),
        removeItem: (key) => secureStorage().delete(key),
      })),
    },
  ),
);

export const useUser = () => useUserStore(state => state.user);
export const useSetUser = () => useUserStore(state => state.setUser);
export const useClearUser = () => useUserStore(state => state.clearUser);
