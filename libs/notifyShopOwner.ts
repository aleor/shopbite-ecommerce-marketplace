import { AdminContactType, Shop } from '../models';

const getWhatsAppLink = (shop: Shop, message: string): string => {
  const phoneNumber = shop.adminContactId.replace(/\D/g, '');

  return `https://wa.me/${phoneNumber}?text=${encodeURI(message)}`;
};

const getMailLink = (shop: Shop, message: string) =>
  `mailto:${shop.adminContactId}?subject=${message}`;

export const notifyShopOwner = (
  shop: Shop,
  orderLink: string,
  chatWindow: Window | null
) => {
  if (!shop.adminDestination || !chatWindow) {
    chatWindow?.close();
    return;
  }

  const message = shop.contactCaption
    ? `${shop.contactCaption}\n${orderLink}`
    : `${orderLink}`;

  const url =
    shop.adminDestination === AdminContactType.WA
      ? getWhatsAppLink(shop, message)
      : getMailLink(shop, message);

  chatWindow.location.assign(url);
  chatWindow.focus();
};
