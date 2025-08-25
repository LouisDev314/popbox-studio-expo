import { IAutocompleteItem } from '@/interfaces/search';
import React, { createContext, useContext, useState } from 'react';
import { SearchStep } from '@/enums/search-step';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { Keyboard } from 'react-native';
import useSearchHistory from '@/hooks/use-search-history';

interface ISearchContext {
  isKuji: boolean;
  setIsKuji: (isKuji: boolean) => void;
  step: SearchStep;
  setStep: (step: SearchStep) => void;
  handleSearchBarFocus: () => void;
  handleSearch: (query: string) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  setAutocompleteItems: (items: IAutocompleteItem[]) => void;
  autocompleteItems: IAutocompleteItem[];
}

const SearchContext = createContext<ISearchContext | undefined>(undefined);

export const SearchProvider = (props: { children: React.ReactNode }) => {
  const { addToHistory } = useSearchHistory();
  const [step, setStep] = useState(SearchStep.Init);
  const [searchQuery, setSearchQuery] = useState('');
  const [isKuji, setIsKuji] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<IAutocompleteItem[]>([]);

  const { refetch: fuzzySearch } = useCustomizeQuery({
    queryKey: ['fuzzy', 'search', searchQuery, 'fetch'],
    queryFn: () => QueryConfigs.fetchFuzzySearch(searchQuery, isKuji),
    onSuccess: (data) => {
      const results = data.data.data;
      const serialized = results ? JSON.stringify(results) : '';
      // router.push({
      //   pathname: AppScreen.SearchResult,
      //   params: { serialized },
      // });
    },
    enabled: false, // Only run when manually triggered
  });

  const handleSearch = (query: string) => {
    console.log(query);
    if (query.trim()) {
      addToHistory(query);
      Keyboard.dismiss();
      fuzzySearch();
    }
  };

  const handleSearchBarFocus = () => {
    setStep(SearchStep.OnFocus);
  };

  const contextValue: ISearchContext = {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    isKuji,
    setIsKuji,
    handleSearch,
    autocompleteItems,
    setAutocompleteItems,
    handleSearchBarFocus,
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
