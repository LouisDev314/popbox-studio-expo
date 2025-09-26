import { create } from 'zustand/index';
import { ISearchHistoryItem } from '@/interfaces/search';

// FIXME: make it persist
interface ISearchHistoryState {
  history: ISearchHistoryItem[];
  setHistory: (history: ISearchHistoryItem[]) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<ISearchHistoryState>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
  clearHistory: () => set({ history: [] }),
}));

export const setHistory = (history: ISearchHistoryItem[]) => useHistoryStore.getState().setHistory(history);
export const clearAllHistory = () => useHistoryStore.getState().clearHistory();
export const getHistory = () => useHistoryStore.getState().history;
