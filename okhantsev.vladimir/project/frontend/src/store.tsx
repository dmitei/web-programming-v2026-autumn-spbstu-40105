import {useCallback, useEffect, useMemo, useState, type ReactNode} from 'react';
import {
  ApiError,
  getGoods,
  login as apiLogin,
  logout as apiLogout,
} from './api';
import * as cartStorage from './cartStorage';
import {StoreContext} from './storeContext';
import type {CartItem, Product, User} from './types';

const SESSION_KEY = 'gadget-hub-session';
const USER_KEY = 'gadget-hub-user';

export function StoreProvider({children}: {children: ReactNode}) {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(SESSION_KEY) === '1',
  );
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'),
  );
  const [goods, setGoods] = useState<Product[]>([]);
  const [goodsLoading, setGoodsLoading] = useState(true);
  const [goodsError, setGoodsError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => cartStorage.loadCart());

  const refetchGoods = useCallback(() => {
    getGoods()
      .then((data) => {
        setGoods(data);
        setGoodsError(null);
      })
      .catch((err) =>
        setGoodsError(
          err instanceof ApiError
            ? `Не удалось загрузить товары: ${err.message}`
            : 'Не удалось загрузить товары.',
        ),
      )
      .finally(() => setGoodsLoading(false));
  }, []);

  useEffect(() => {
    refetchGoods();
  }, [refetchGoods]);

  useEffect(() => {
    const onFocus = () => refetchGoods();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refetchGoods]);

  const reloadGoods = useCallback(() => {
    setGoodsLoading(true);
    refetchGoods();
  }, [refetchGoods]);

  useEffect(() => {
    const clearSession = () => {
      setAuthenticated(false);
      setUser(null);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
    };
    window.addEventListener('session-expired', clearSession);
    return () => window.removeEventListener('session-expired', clearSession);
  }, []);

  const addToCart = useCallback((id: number, quantity = 1) => {
    setCart((prev) => {
      const next = [...prev];
      const idx = next.findIndex((item) => item.productId === id);
      if (idx === -1) {
        next.push({productId: id, quantity});
      } else {
        next[idx] = {...next[idx], quantity: next[idx].quantity + quantity};
      }
      cartStorage.saveCart(next);
      return next;
    });
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    setCart((prev) => {
      const next =
        quantity <= 0
          ? prev.filter((item) => item.productId !== id)
          : prev.map((item) =>
              item.productId === id ? {...item, quantity} : item,
            );
      cartStorage.saveCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
      const next = prev.filter((item) => item.productId !== id);
      cartStorage.saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    cartStorage.clearCart();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiLogin(username, password);
    setUser(res);
    setAuthenticated(true);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
    localStorage.setItem(SESSION_KEY, '1');
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setAuthenticated(false);
      setUser(null);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      authenticated,
      user,
      goods,
      goodsLoading,
      goodsError,
      reloadGoods,
      cart,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      login,
      logout,
    }),
    [
      authenticated,
      user,
      goods,
      goodsLoading,
      goodsError,
      reloadGoods,
      cart,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      login,
      logout,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
