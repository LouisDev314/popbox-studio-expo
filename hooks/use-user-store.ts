import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IUser } from '@/interfaces/user';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/mmkv';

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
      name: StorageKey.User,
      storage: createJSONStorage(() => ({
        getItem: (key) => secureStorage().getString(key) || null,
        setItem: (key, value) => secureStorage().set(key, value),
        removeItem: (key) => secureStorage().delete(key),
      })),
      skipHydration: true,
    },
  ),
);

export const useGetUser = () => useUserStore(state => state.user);
export const useSetUser = () => useUserStore(state => state.setUser);
export const useClearUser = () => useUserStore(state => state.clearUser);
