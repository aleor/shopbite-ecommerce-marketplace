import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

import { ItemAddOn } from './itemAddon';
import { ItemLink } from './itemLink';
import { ItemVariant } from './itemVariant';

export enum ItemStatus {
  available = 'A',
  hidden = 'H',
  disabled = 'D',
}

export type Item = {
  id: string;
  collectionIds: string[];
  title: string;
  description?: string;
  imageUrls: string[];
  price?: number;
  status: ItemStatus;
  thumbnailUrl?: string;
  externalLinks?: ItemLink[];
  variants?: ItemVariant[];
  addOns?: ItemAddOn[];
};

export const getLowestPrice = (item: Item) => {
  if (!item.price) {
    return (
      item.variants?.reduce(
        (lowestPrice, variant) => Math.min(lowestPrice, variant.price),
        Number.MAX_SAFE_INTEGER
      ) ?? 0
    );
  }

  return item.variants?.length
    ? item.variants.reduce((min, v) => Math.min(min, v.price), item.price)
    : item.price;
};

export const getPriceRange = (item: Item): { min: number; max: number } => {
  return item.variants?.length
    ? item.variants.reduce(
        (range, v) => {
          range.min = Math.min(range.min, v.price);
          range.max = Math.max(range.max, v.price);
          return range;
        },
        { min: Number.MAX_SAFE_INTEGER, max: 0 }
      )
    : { min: item.price, max: item.price };
};

export const getThumbnailUrl = (item: Item): string => {
  return (
    item?.thumbnailUrl || item?.imageUrls?.[0] || '/images/no_photo_small.png'
  );
};

export type ItemUploadImage = {
  file: File;
  timestamp: number;
};

export const itemConverter: FirestoreDataConverter<Item> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Item {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      collectionIds: data.collectionIds,
      title: data.title,
      description: data.description,
      imageUrls: data.imageUrls,
      price: data.price || null,
      status: data.status,
      thumbnailUrl: data.thumbnailUrl || null,
      externalLinks: data.externalLinks || [],
      variants: data.variants || [],
      addOns: data.addOns || [],
    };
  },
  toFirestore(data: Item): DocumentData {
    return { ...data };
  },
};
