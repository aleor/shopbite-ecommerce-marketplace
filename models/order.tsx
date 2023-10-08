import {
    DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp
} from 'firebase/firestore';

import { CustomerInfo } from './customerInfo';
import { OrderItem } from './orderItem';

export type Order = {
  id: string;
  shopId: string;
  createdAt: number;
  itemList: OrderItem[];
  customerInfo: CustomerInfo;
};

export const orderConverter: FirestoreDataConverter<Order> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Order {
    const data = snapshot.data(options)!;

    return {
      id: snapshot.id,
      shopId: data.shopId,
      createdAt: data.createdAt.toMillis(),
      itemList: data.itemList.map((item: OrderItem) => ({
        title: item.title,
        imageUrl: item.imageUrl || null,
        note: item.note || null,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant || null,
        addOns: item.addOns || null,
      })),
      customerInfo: data.customerInfo || null,
    };
  },
  toFirestore(data: Order): DocumentData {
    return {
      id: '',
      shopId: data.shopId,
      createdAt: Timestamp.fromMillis(data.createdAt),
      itemList: data.itemList,
      customerInfo: data.customerInfo,
    };
  },
};
