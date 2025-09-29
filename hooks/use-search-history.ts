import { ISearchHistoryItem } from '@/interfaces/search';
import { useGetHistory, useSetHistory } from '@/hooks/use-search-history-store';

const useSearchHistory = () => {
  const history = useGetHistory();
  const setHistory = useSetHistory();

  const MAX_HISTORY_ITEMS = 10;

  const addToHistory = (query: string, _id?: string) => {
    if (!query.trim()) return;

    const filtered = history.filter(item =>
      item.query.toLowerCase() !== query.toLowerCase(),
    );
    const newItem: ISearchHistoryItem = {
      _id,
      query: query.trim(),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    setHistory(updated);
    // setHistory(updated);
  };

  const removeFromHistory = (query: string) => {
    const updated = history.filter(item => item.query !== query);
    // setHistory(updated);
    setHistory(updated);
  };

  return {
    addToHistory,
    removeFromHistory,
  };
};

export default useSearchHistory;
