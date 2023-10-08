import {
    DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp
} from 'firebase/firestore';

import { CollectionItem } from './collectionItem';

export type Collection = {
  id: string;
  label: string;
  itemList: CollectionItem[];
  ordering: number;
};

export const collectionConverter: FirestoreDataConverter<Collection> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Collection {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      label: data.label,
      itemList: data.itemList || [],
      ordering: data.ordering,
    };
  },
  toFirestore(data: Collection): DocumentData {
    return { ...data };
  },
};
