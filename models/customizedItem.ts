import { Item } from './item';
import { ItemAddOn } from './itemAddon';
import { ItemVariant } from './itemVariant';

export type CustomizedItem = {
  item: Item;
  quantity: number;
  variant?: ItemVariant | null;
  addOns?: ItemAddOn[];
};

export const getSingleCustomizedItemPrice = (
  customizedItem: CustomizedItem
) => {
  const variantPrice =
    customizedItem.variant?.price || customizedItem.item.price || 0;

  const addOnsPrice =
    customizedItem.addOns?.reduce((total, addOn) => total + addOn.price, 0) ||
    0;

  return variantPrice + addOnsPrice;
};

export const getTotalCustomizedItemPrice = (customizedItem: CustomizedItem) => {
  const singleItemPrice = getSingleCustomizedItemPrice(customizedItem);

  return singleItemPrice * customizedItem.quantity;
};
