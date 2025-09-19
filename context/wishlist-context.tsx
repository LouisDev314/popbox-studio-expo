import React, { createContext, useContext, useState } from 'react';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { IItemSearchOptions } from '@/interfaces/search';
import { ProductCategory, ProductsOrder, ProductSortBy } from '@/enums/sort-by-filters';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { getUser, setUser } from '@/hooks/use-user-store';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/mmkv';
import { IWishlistItem } from '@/interfaces/wishlist';
import { IUser } from '@/interfaces/user';

interface IWishlistContext {
  setSearchOptions: React.Dispatch<React.SetStateAction<IItemSearchOptions>>;
}

const WishlistContext = createContext<IWishlistContext | undefined>(undefined);

export const WishlistProvider = (props: { children: React.ReactNode }) => {
  const [searchOptions, setSearchOptions] = useState<IItemSearchOptions>({
    category: ProductCategory.All,
    sortBy: ProductSortBy.Date,
    order: ProductsOrder.Desc,
  });

  // Fetch user wishlist and store to local on init
  const { isLoading } = useCustomizeQuery({
    queryKey: ['wishlist', 'user', 'fetch', searchOptions],
    queryFn: () => QueryConfigs.fetchUserWishlist({
      uid: getUser()?.uid,
      ...searchOptions,
    }),
    onSuccess: (data) => {
      const wishlist = data.data.data as IWishlistItem[];
      const updatedUser = { ...getUser(), wishlist };
      setUser(updatedUser as IUser);
      secureStorage().set(StorageKey.User, JSON.stringify(updatedUser));
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user wishlist:', err);
    },
  });

  const contextValue: IWishlistContext = {
    setSearchOptions,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {props.children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
