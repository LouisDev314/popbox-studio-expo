import { useCallback } from 'react';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/mmkv';
import { ISearchHistoryItem } from '@/interfaces/search';
import { clearAllHistory, getHistory, setHistory } from '@/hooks/use-search-history-store';

const useSearchHistory = () => {
  const MAX_HISTORY_ITEMS = 10;

  const loadHistory = useCallback(() => {
    try {
      const stored = secureStorage().getString(StorageKey.SearchHistory);
      if (stored) {
        const parsedHistory: ISearchHistoryItem[] = JSON.parse(stored);
        // Sort by timestamp descending (most recent first)
        setHistory(parsedHistory.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      setHistory([]);
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    const filtered = getHistory().filter(item =>
      item.query.toLowerCase() !== query.toLowerCase(),
    );
    const newItem: ISearchHistoryItem = {
      query: query.trim(),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    try {
      secureStorage().set(StorageKey.SearchHistory, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving search history:', error);
    }

    setHistory(updated);
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    const updated = getHistory().filter(item => item.query !== query);

    try {
      secureStorage().set(StorageKey.SearchHistory, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }

    setHistory(updated);
  }, []);

  const clearHistory = useCallback(() => {
    clearAllHistory();
    try {
      secureStorage().delete(StorageKey.SearchHistory);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  return {
    loadHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};

export default useSearchHistory;
