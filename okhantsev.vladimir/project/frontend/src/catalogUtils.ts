import {colorLabel, typeLabel} from './normalize';
import type {Product} from './types';

export const PAGE_SIZE = 12;

export type SortCriterion = 'new' | 'rating' | 'price';
export type SortDirection = 'asc' | 'desc';

export const CRITERIA: {value: SortCriterion; label: string}[] = [
  {value: 'new', label: 'Новизна'},
  {value: 'rating', label: 'Популярность'},
  {value: 'price', label: 'Цена'},
];

export const DIRECTIONS: {value: SortDirection; label: string}[] = [
  {value: 'desc', label: 'По убыванию'},
  {value: 'asc', label: 'По возрастанию'},
];

export interface Filters {
  priceFrom: string;
  priceTo: string;
  types: Set<string>;
  colors: Set<string>;
}

export const DEFAULT_FILTERS: Filters = {
  priceFrom: '',
  priceTo: '',
  types: new Set(),
  colors: new Set(),
};

export interface PriceBounds {
  min: number;
  max: number;
}

export function clampPrice(
  value: string,
  fallback: number,
  {min, max}: PriceBounds,
): number {
  if (value === '') {
    return fallback;
  }
  const n = Number(value);
  if (Number.isNaN(n)) {
    return fallback;
  }
  return Math.min(Math.max(n, min), max);
}

export function applyFilters(goods: Product[], f: Filters): Product[] {
  return goods.filter((g) => {
    if (f.types.size > 0 && !f.types.has(typeLabel(g.type))) {
      return false;
    }
    if (
      f.colors.size > 0 &&
      !(g.colors ?? []).some((c) => f.colors.has(colorLabel(c)))
    ) {
      return false;
    }
    const from = Number(f.priceFrom);
    const to = Number(f.priceTo);
    if (f.priceFrom !== '' && !Number.isNaN(from) && g.price < from) {
      return false;
    }
    if (f.priceTo !== '' && !Number.isNaN(to) && g.price > to) {
      return false;
    }
    return true;
  });
}

function sortScore(p: Product, criterion: SortCriterion): number {
  if (criterion === 'new') {
    return p.isNew ? 1 : 0;
  }
  if (criterion === 'rating') {
    return p.popularity ?? 0;
  }
  return p.price;
}

export function sortGoods(
  list: Product[],
  criterion: SortCriterion,
  direction: SortDirection,
): Product[] {
  return [...list].sort((a, b) => {
    let diff = sortScore(a, criterion) - sortScore(b, criterion);
    if (diff === 0 && criterion !== 'price') {
      diff = a.price - b.price;
    }
    return direction === 'desc' ? -diff : diff;
  });
}

export function pageNumbers(pages: number, page: number): (number | '…')[] {
  if (pages <= 7) {
    return Array.from({length: pages}, (_, i) => i + 1);
  }
  const set = new Set<number>([1, pages, page - 1, page, page + 1]);
  const nums = [...set]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) {
      out.push('…');
    }
    out.push(n);
    prev = n;
  }
  return out;
}
