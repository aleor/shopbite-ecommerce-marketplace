import isAfter from 'date-fns/isAfter';
import { useContext } from 'react';

import { ShopContext } from './shopContext';

export const useSubscription = () => {
  const shop = useContext(ShopContext);

  if (!shop || !shop.subscriptionEndDate) {
    return false;
  }

  const hasActiveSubscription = isAfter(
    new Date(shop.subscriptionEndDate),
    new Date()
  );

  return hasActiveSubscription;
};
