import {
  CartItem,
  CustomerInfo,
  getSingleCustomizedItemPrice,
  Order,
  Shop,
} from '../models';
import { OrderItem } from '../models/orderItem';

export const convertToOrder = (
  cartItems: CartItem[],
  shop: Shop,
  customerInfo: CustomerInfo
): Order | null => {
  if (!cartItems || !shop) {
    return null;
  }

  const orderItems: OrderItem[] = cartItems.map((cartItem: CartItem) => {
    return {
      id: cartItem.item.id,
      title: cartItem.item.title,
      imageUrl:
        cartItem.item.thumbnailUrl || cartItem.item.imageUrls?.[0] || null,
      price: getSingleCustomizedItemPrice(cartItem),
      quantity: cartItem.quantity,
      note: cartItem.note,
      variant: cartItem.variant?.label || null,
      addOns: cartItem.addOns?.map((addOn) => addOn.label).join(' + ') || null,
    };
  });

  return {
    id: null,
    shopId: shop.id,
    createdAt: null, // will be set by the server
    itemList: orderItems,
    customerInfo,
  };
};
