// https://developers.google.com/analytics/devguides/collection/ga4/reference/events

import { Item as GA4Item } from 'firebase/analytics';

import { CartItem, ItemAddOn, ItemVariant } from '../../models';
import { Item } from '../../models/item';
import { OrderItem } from '../../models/orderItem';

export const itemToGA4Item = (
  item: Item,
  quantity: number,
  variant?: ItemVariant,
  addOns?: ItemAddOn[]
): GA4Item => {
  return {
    item_id: item.id,
    item_name: item.title,
    item_category: item.collectionIds?.[0],
    item_category2: item.collectionIds?.[1],
    item_category3: item.collectionIds?.[2],
    item_category4: item.collectionIds?.[3],
    item_category5: item.collectionIds?.[4],
    price: variant?.price || item.price,
    quantity: quantity,
    item_variant: variant?.label,
  };
};

export const cartItemToGA4Item = (item: CartItem): GA4Item => {
  return itemToGA4Item(item.item, item.quantity, item.variant);
};

export const orderItemToGA4Item = (item: OrderItem): GA4Item => {
  return {
    item_id: item.id,
    item_name: item.title,
    price: item.price,
    quantity: item.quantity,
    item_variant: item.variant,
  };
};
