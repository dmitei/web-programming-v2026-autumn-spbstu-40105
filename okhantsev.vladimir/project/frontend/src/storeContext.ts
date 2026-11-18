import {createContext, useContext} from 'react';
import type {CartItem, Product, User} from './types';

export interface StoreContextValue {
  authenticated: boolean;
  user: User | null;
  goods: Product[];
  goodsLoading: boolean;
  goodsError: string | null;
  reloadGoods: () => void;
  cart: CartItem[];
  addToCart: (id: number, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
