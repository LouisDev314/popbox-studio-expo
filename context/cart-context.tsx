import React, { createContext, useContext, useEffect, useState } from 'react';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { useGetUser, useSetUser } from '@/hooks/use-user-store';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { useAuth } from '@/context/auth-context';
import { ICartItem } from '@/interfaces/cart';

interface IAddCartItemParams {
  uid: string;
  item: {
    itemId: string;
    itemType: string;
    quantity: number;
    price: number;
  };
}

interface ICartContext {
  fetchCart: () => void;
  isFetchingCart: boolean;
  handleRemoveCartItem: (item: ICartItem) => void;
  addItemToCart: (params: IAddCartItemParams) => void;
  isAddingItemToCart: boolean;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider = (props: { children: React.ReactNode }) => {
  const user = useGetUser();
  const setUser = useSetUser();
  const { isStorageReady, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ICartItem[]>([]);

  // Due to reactivity of Zustand, have to separate it here
  useEffect(() => {
    if (!isStorageReady) return;
    const updatedUser = { ...user!, cart };
    setUser(updatedUser);
  }, [cart, isStorageReady]);

  // Fetch user cart and store to local on init
  const { refetch: fetchCart, isFetching: isFetchingCart } = useCustomizeQuery({
    queryKey: ['cart', 'user', 'fetch', user],
    queryFn: () => QueryConfigs.fetchUserCart(user?.uid),
    onSuccess: (data) => {
      const cart = data.data.data;
      setCart(cart);
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user cart:', err);
    },
    enabled: isAuthenticated && !!user,
  });

  const { mutation: deleteCartItem } = useCustomizeMutation({
    mutationFn: MutationConfigs.deleteCartItem,
  });

  const { mutation: addItemToCart, isPending: isAddingItemToCart } = useCustomizeMutation({
    mutationFn: MutationConfigs.addItemToCart,
    onSuccess: (data) => {
      // TODO: setOverBoughtMsg to toast instead
      const updatedCart = data.data.data.items;
      const updatedUser = { ...user!, cart: updatedCart };
      setUser(updatedUser);
    },
    onError: (err) => {
      // TODO: use Toast to indicate cannot add item
      console.error('Cannot add item to cart', err.response);
    },
  });

  const handleRemoveCartItem = (item: ICartItem) => {
    const updatedCart = user?.cart?.filter(cartItem => cartItem.itemId !== item.itemId) as ICartItem[];
    const updatedUser = { ...user!, cart: updatedCart };
    setUser(updatedUser);
    deleteCartItem({ uid: user!.uid, itemId: item.itemId });
  };

  const contextValue: ICartContext = {
    fetchCart,
    isFetchingCart,
    handleRemoveCartItem,
    addItemToCart,
    isAddingItemToCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
