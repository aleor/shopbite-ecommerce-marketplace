import { Item, ItemStatus } from './item';

export type FilterOptions = {
  sortBy: 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc';
  filterBy: {
    status: ItemStatus[];
    minPrice: number;
    maxPrice: number;
  };
};

export const sortByNameAsc = (items: Item[]): Item[] => {
  if (items?.length === 0) {
    return items;
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
};

export const sortByNameDesc = (items: Item[]): Item[] => {
  if (items?.length === 0) {
    return items;
  }

  return items.sort((a, b) => b.title.localeCompare(a.title));
};

export const sortByPriceAsc = (items: Item[]): Item[] => {
  if (items?.length === 0) {
    return items;
  }

  return items.sort((a, b) => a.price - b.price);
};

export const sortByPriceDesc = (items: Item[]): Item[] => {
  if (items?.length === 0) {
    return items;
  }

  return items.sort((a, b) => b.price - a.price);
};
