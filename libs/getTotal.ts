import {
  CartItem,
  getTotalCustomizedItemPrice,
} from '../models';

export const getCartTotalPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, unit) => {
    return total + getTotalCustomizedItemPrice(unit);
  }, 0);
};

export const getOrderTotalPrice = (
  items: { price: number; quantity: number }[]
) => {
  return items.reduce((total, unit) => {
    return total + unit.price * unit.quantity;
  }, 0);
};

export const getTotalItems = (items: { quantity: number }[]) => {
  return items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};
