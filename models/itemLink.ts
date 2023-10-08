import { LinkType } from './linkType';

export const externalItemLinkTypes = [
  LinkType.Tokopedia,
  LinkType.Shopee,
  LinkType.Lazada,
  LinkType.GoFood,
  LinkType.GrabFood,
  LinkType.TravelokaEats,
  LinkType.ShopeeFood,
] as const;

export type ItemLinkType = typeof externalItemLinkTypes[number];

export type ItemLink = {
  type: ItemLinkType;
  url: string;
};