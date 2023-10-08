import { useAppSelector } from '../app/hooks';
import { Shop } from '../models';

export const getOrderLink = (orderId: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return `${window.location.origin}/o/${orderId}`;
};

export const getShopLink = (): string | null => {
  const shop: Shop = useAppSelector((state) => state.shop);

  if (typeof window === 'undefined') {
    return null;
  }

  return `${window.location.origin}/${shop.username}`;
};

export const getShopItemLink = (itemId: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return `${getShopLink()}/${itemId}`;
};
