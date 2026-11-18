import type {CartItem} from './types';

const KEY = 'gadget-hub-cart';

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearCart() {
  localStorage.removeItem(KEY);
}
