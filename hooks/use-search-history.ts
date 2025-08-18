import { useCallback, useState } from 'react';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/mmkv';
import { ISearchHistoryItem } from '@/interfaces/search';

const useSearchHistory = () => {
  const MAX_HISTORY_ITEMS = 10;
  const [history, setHistory] = useState<ISearchHistoryItem[]>([]);

  const loadHistory = useCallback(() => {
    try {
      const stored = secureStorage.getString(StorageKey.SearchHistory);
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

    setHistory(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(item =>
        item.query.toLowerCase() !== query.toLowerCase(),
      );

      const newItem: ISearchHistoryItem = {
        query: query.trim(),
        timestamp: Date.now(),
      };

      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      try {
        secureStorage.set(StorageKey.SearchHistory, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving search history:', error);
      }

      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.query !== query);

      try {
        secureStorage.set(StorageKey.SearchHistory, JSON.stringify(updated));
      } catch (error) {
        console.error('Error removing from search history:', error);
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      secureStorage.delete(StorageKey.SearchHistory);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  return {
    loadHistory,
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};

export default useSearchHistory;
