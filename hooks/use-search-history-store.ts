import { ISearchHistoryItem } from '@/interfaces/search';
import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKey } from '@/enums/mmkv';
import { secureStorage } from '@/utils/mmkv';

interface ISearchHistoryState {
  history: ISearchHistoryItem[];
  setHistory: (history: ISearchHistoryItem[]) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<ISearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      setHistory: (history) => set({ history }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: StorageKey.SearchHistory,
      storage: createJSONStorage(() => ({
        getItem: (key) => secureStorage().getString(key) || null,
        setItem: (key, value) => secureStorage().set(key, value),
        removeItem: (key) => secureStorage().delete(key),
      })),
      skipHydration: true,
    },
  ),
);

export const useGetHistory = () => useHistoryStore(state => state.history);
export const useSetHistory = () => useHistoryStore(state => state.setHistory);
export const useClearHistory = () => useHistoryStore(state => state.clearHistory);
