import { LinkType } from '../models/linkType';

export const getLinkDestination = (type: LinkType) => {
  switch (type) {
    case LinkType.Instagram:
      return 'Instagram';
    case LinkType.Whatsapp:
      return 'Whatsapp';
    case LinkType.TikTok:
      return 'TikTok';
    case LinkType.Twitter:
      return 'Twitter';
    case LinkType.Youtube:
      return 'Youtube';
    case LinkType.Facebook:
      return 'Facebook';
    case LinkType.Line:
      return 'Line';
    case LinkType.Telegram:
      return 'Telegram';
    case LinkType.Tokopedia:
      return 'Tokopedia';
    case LinkType.Shopee:
      return 'Shopee';
    case LinkType.Lazada:
      return 'Lazada';
    case LinkType.GoFood:
      return 'GoFood';
    case LinkType.GrabFood:
      return 'GrabFood';
    case LinkType.TravelokaEats:
      return 'Traveloka Eats';
    case LinkType.ShopeeFood:
      return 'Shopee Food';

    default:
      return 'Others';
  }
};

export const getLinkPlaceholder = (type: LinkType) => {
  switch (type) {
    case LinkType.Tokopedia:
      return 'cth. https://tokopedia.com/nama-toko/link-produk';
    case LinkType.Shopee:
      return 'cth. https://shoppee.co.id/link-produk';
    case LinkType.Lazada:
      return 'cth. https://www.lazada.co.id/products/link-produk';
    case LinkType.GoFood:
      return 'cth. https://gofood.co.id/jakarta/restaurant/nama-restoran';
    case LinkType.GrabFood:
      return 'cth. https://grab.onelink.me/id-toko';
    case LinkType.TravelokaEats:
      return 'cth. https://www.traveloka.com/restaurants/Indonesia/detail/id-toko/delivery';
    case LinkType.ShopeeFood:
      return 'cth. https://shopee.co.id/universal-link/now-food/shop/id-toko';

    default:
      return '';
  }
};
