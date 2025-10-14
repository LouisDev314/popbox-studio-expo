import React, { createContext, useContext, useEffect, useState } from 'react';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { IItemSearchOptions } from '@/interfaces/search';
import { ProductCategory, ProductsOrder, ProductSortBy } from '@/enums/sort-by-filters';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { useGetUser, useSetUser } from '@/hooks/use-user-store';
import { IWishlistItem } from '@/interfaces/wishlist';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { useAuth } from '@/context/auth-context';

interface IWishlistContext {
  setSearchOptions: React.Dispatch<React.SetStateAction<IItemSearchOptions>>;
  fetchWishlist: () => void;
  isFetchingWishlist: boolean;
  handleRemoveWishlistItem: (item: IWishlistItem) => void;
}

const WishlistContext = createContext<IWishlistContext | undefined>(undefined);

export const WishlistProvider = (props: { children: React.ReactNode }) => {
  // const user = useUserStore(state => state.user);
  const { isAuthenticated } = useAuth();
  const user = useGetUser();
  const setUser = useSetUser();
  const { isStorageReady } = useAuth();
  const [wishlist, setWishlist] = useState<IWishlistItem[]>([]);

  const [searchOptions, setSearchOptions] = useState<IItemSearchOptions>({
    category: ProductCategory.All,
    sortBy: ProductSortBy.Date,
    order: ProductsOrder.Desc,
  });

  // Due to reactivity of Zustand, have to separate it here
  useEffect(() => {
    if (!isStorageReady) return;
    const updatedUser = { ...user!, wishlist };
    setUser(updatedUser);
  }, [wishlist, isStorageReady]);

  // Fetch user wishlist and store to local on init
  const { refetch: fetchWishlist, isFetching: isFetchingWishlist } = useCustomizeQuery({
    queryKey: ['wishlist', 'user', 'fetch', searchOptions, user],
    queryFn: () => QueryConfigs.fetchUserWishlist({
      uid: user?.uid,
      ...searchOptions,
    }),
    onSuccess: (data) => {
      const currWishlist = data.data.data as IWishlistItem[];
      setWishlist(currWishlist);
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user wishlist:', err.message);
    },
    enabled: isAuthenticated && !!user,
  });

  const { mutation: deleteWishlistItem } = useCustomizeMutation({
    mutationFn: MutationConfigs.deleteWishlistItem,
  });

  const handleRemoveWishlistItem = (item: IWishlistItem) => {
    const updatedWishlist = user?.wishlist.filter(wishlistItem => wishlistItem.itemId !== item.itemId) as IWishlistItem[];
    const updatedUser = { ...user!, wishlist: updatedWishlist };
    setUser(updatedUser);
    deleteWishlistItem({ uid: user!.uid, itemId: item.itemId });
  };

  const contextValue: IWishlistContext = {
    setSearchOptions,
    fetchWishlist,
    isFetchingWishlist,
    handleRemoveWishlistItem,
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
