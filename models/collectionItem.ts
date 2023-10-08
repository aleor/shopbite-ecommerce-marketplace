import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  UpdateData,
} from 'firebase/firestore';

import { Item } from './item';

export type CollectionItem = Item & { ordering: number };

export const collectionItemConverter: FirestoreDataConverter<CollectionItem> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CollectionItem {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      collectionIds: data.collectionIds,
      title: data.title,
      description: data.description,
      imageUrls: data.imageUrls,
      price: data.price,
      status: data.status,
      thumbnailUrl: data.thumbnailUrl || null,
      ordering: data.ordering,
      externalLinks: data.externalLinks || [],
      variants: data.variants || [],
      addOns: data.addOns || [],
    };
  },
  toFirestore(data: CollectionItem): DocumentData {
    return { ...data };
  },
};

export const getUpdateData = (
  item: CollectionItem
): UpdateData<CollectionItem> => {
  return {
    id: item.id,
    collectionIds: item.collectionIds,
    description: item.description || null,
    ordering: item.ordering,
    price: item.price || null,
    title: item.title || null,
    imageUrls: item.imageUrls || null,
    status: item.status || null,
    thumbnailUrl: item.thumbnailUrl || null,
    externalLinks: item.externalLinks || [],
    variants: item.variants || [],
    addOns: item.addOns || [],
  };
};
