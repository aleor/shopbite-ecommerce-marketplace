import { logEvent } from 'firebase/analytics';

import { analytics } from '../../firebase/analytics';
import {
  CartItem,
  Collection,
  getTotalCustomizedItemPrice,
  Order,
} from '../../models';
import { Item } from '../../models/item';
import { LinkType } from '../../models/linkType';
import { Shop } from '../../models/shop';
import { getCartTotalPrice, getOrderTotalPrice } from '../getTotal';
import {
  cartItemToGA4Item,
  itemToGA4Item,
  orderItemToGA4Item,
} from './eventConverters';

let shop: Shop;

export const injectShop = (_shop) => {
  shop = _shop;
};

const guard = (o: any, eventName: string) => {
  if (!shop) {
    logEvent(analytics, 'logging_error', {
      event_name: eventName,
      message: `${eventName} event is not sent because shop is not initialized`,
    });

    return false;
  }

  if (o) return true;

  logEvent(analytics, 'logging_error', {
    event_name: eventName,
    message: `${eventName} is unexpectedly null, unable to log event`,
  });

  return false;
};

export const logViewItem = (item: Item, quantity: number = 1) => {
  const ga4EventName = 'view_item';

  if (guard(item, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      currency: shop.currency,
      value: item.price * quantity,
      items: [itemToGA4Item(item, quantity)],
      shop_id: shop.id,
    });
  }
};

export const logViewCatalog = () => {
  const customEventName = 'view_catalog';

  if (guard(shop, customEventName)) {
    logEvent(analytics, customEventName, {
      shop_id: shop.id,
    });
  }
};

export const logAddToCart = (cartItem: CartItem) => {
  const ga4EventName = 'add_to_cart';

  if (guard(cartItem, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      currency: shop.currency,
      value: getTotalCustomizedItemPrice(cartItem),
      items: [
        itemToGA4Item(
          cartItem.item,
          cartItem.quantity,
          cartItem.variant,
          cartItem.addOns
        ),
      ],
      shop_id: shop.id,
    });
  }
};

export const logRemoveFromCart = (cartItem: CartItem, quantity: number = 1) => {
  const ga4EventName = 'remove_from_cart';

  if (guard(cartItem, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      currency: shop.currency,
      value: getTotalCustomizedItemPrice(cartItem),
      items: [
        itemToGA4Item(
          cartItem.item,
          quantity,
          cartItem.variant,
          cartItem.addOns
        ),
      ],
      shop_id: shop.id,
    });
  }
};

export const logBeginCheckout = (order: Order) => {
  const ga4EventName = 'begin_checkout';

  if (guard(order, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      value: getOrderTotalPrice(order.itemList),
      currency: shop.currency,
      items: order.itemList.map(orderItemToGA4Item),
      shop_id: shop.id,
    });
  }
};

export const logPurchase = (order: Order, orderId: string) => {
  const ga4EventName = 'purchase';

  if (guard(order, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      value: getOrderTotalPrice(order.itemList),
      currency: shop.currency,
      transaction_id: orderId,
      items: order.itemList.map(orderItemToGA4Item),
      shop_id: shop.id,
    });
  }
};

export const logViewCollection = (collection: Collection) => {
  const ga4EventName = 'view_item_list';

  if (guard(collection, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      item_list_id: collection.id,
      item_list_name: collection.label,
      items: collection.itemList.map((item) => itemToGA4Item(item, 1)),
      shop_id: shop.id,
    });
  }
};

export const logViewCart = (cartItems: CartItem[]) => {
  const ga4EventName = 'view_cart';

  if (guard(cartItems, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      value: getCartTotalPrice(cartItems),
      currency: shop.currency,
      items: cartItems.map(cartItemToGA4Item),
      shop_id: shop.id,
    });
  }
};

export const logShareEvent = ({
  url,
  method,
}: {
  url: string;
  method: string;
}) => {
  const ga4EventName = 'share';

  if (guard(url, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      method: method,
      content_type: 'url',
      item_id: url,
      shop_id: shop.id,
    });
  }
};

export const logSearchEvent = (term: string) => {
  if (!term?.trim()) return;

  const ga4EventName = 'search';

  if (guard(term, ga4EventName)) {
    logEvent(analytics, ga4EventName, {
      search_term: term.toLowerCase(),
      shop_id: shop.id,
    });
  }
};

export const logClickLinkEvent = ({
  url,
  label,
  type,
}: {
  url: string;
  label?: string;
  type: LinkType;
}) => {
  const customEventName = 'click_link';

  if (guard(url, customEventName)) {
    logEvent(analytics, customEventName, {
      link_url: url,
      link_label: label,
      link_type: type,
      label,
      type,
      url,
      shop_id: shop.id,
    });
  }
};
