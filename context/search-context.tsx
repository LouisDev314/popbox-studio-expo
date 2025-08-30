import { IAutocompleteItem } from '@/interfaces/search';
import React, { createContext, Ref, useContext, useEffect, useRef, useState } from 'react';
import { SearchStep } from '@/enums/search-step';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import useSearchHistory from '@/hooks/use-search-history';
import { useAuth } from '@/context/auth-context';
import { IKujiCard, IProductCard } from '@/interfaces/items';
import { Input } from 'tamagui';
import useDebounceInput from '@/hooks/use-debounce-input';

interface ISearchContext {
  isKuji: boolean;
  setIsKuji: (isKuji: boolean) => void;
  step: SearchStep;
  setStep: (step: SearchStep) => void;
  handleSearchBarFocus: () => void;
  handleSearchByItem: (item: IAutocompleteItem) => void;
  setAutocompleteItems: (items: IAutocompleteItem[]) => void;
  autocompleteItems: IAutocompleteItem[];
  isSearchBarFocused: boolean;
  setIsSearchBarFocused: (focused: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: IProductCard[] | IKujiCard[] | [];
  setSearchResults: (searchResults: IProductCard[] | IKujiCard[] | []) => void;
  debouncedQuery: string;
  searchBarRef: Ref<Input>;
}

const SearchContext = createContext<ISearchContext | undefined>(undefined);

export const SearchProvider = (props: { children: React.ReactNode }) => {
  const { addToHistory, loadHistory } = useSearchHistory();
  const { isStorageReady } = useAuth();
  const [step, setStep] = useState(SearchStep.Init);
  const [isKuji, setIsKuji] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<IAutocompleteItem[]>([]);
  const [itemId, setItemId] = useState('');
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IProductCard[] | IKujiCard[] | []>([]);
  const searchBarRef = useRef<Input>(null);

  const debouncedQuery = useDebounceInput(searchQuery.trim(), 300);

  useEffect(() => {
    if (isStorageReady) loadHistory();
  }, [isStorageReady]);

  const { refetch: fetchProductById } = useCustomizeQuery({
    queryKey: ['id', 'product', 'fetch'],
    queryFn: () => QueryConfigs.fetchItemById(itemId, isKuji),
    onSuccess: (data) => {
      // TODO: push the detailed item screen
    },
    onError: (err) => {
      console.error('Cannot fetch user:', err);
    },
    enabled: false,
  });

  const handleSearchByItem = (item: IAutocompleteItem) => {
    addToHistory(item.title, item._id);
    setItemId(item._id);
    console.log('Search item by id');
    // fetchProductById();
  };

  const handleSearchBarFocus = () => {
    setStep(SearchStep.OnFocus);
    searchBarRef.current?.focus();
  };

  const contextValue: ISearchContext = {
    step,
    setStep,
    isKuji,
    setIsKuji,
    handleSearchByItem,
    autocompleteItems,
    setAutocompleteItems,
    handleSearchBarFocus,
    isSearchBarFocused,
    setIsSearchBarFocused,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    debouncedQuery,
    searchBarRef,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {props.children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};
