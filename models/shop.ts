import { isAfter } from 'date-fns';
import {
    DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp
} from 'firebase/firestore';

import { AdminContactType } from './adminContactType';
import { Link } from './link';
import { SubscriptionBillingType } from './subscriptionBillingType';

export type Shop = {
  id: string;
  email: string;
  username: string;
  profileName: string;
  profilePictureUrl?: string | null;
  profileDescription?: string | null;
  websiteUrl?: string | null;
  websiteLabel?: string | null;
  isActive: boolean;
  isVerified: boolean;
  adminDestination?: AdminContactType | null;
  createdAt: number;
  modifiedAt?: number | null;
  adminContactId?: string | null;
  contactCaption?: string | null;
  currency: string;
  subscriptionEndDate?: number | null;
  subscriptionBillingType?: SubscriptionBillingType | null;
  isAdminBlocked: boolean;
  country?: string | null;
  links: Link[];
  hasSubscription: boolean;
};

export const shopConverter: FirestoreDataConverter<Shop> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Shop {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      email: data.email,
      username: data.username,
      country: data.country,
      profileName: data.profileName,
      profilePictureUrl: data.profilePictureUrl || null,
      profileDescription: data.profileDescription || null,
      websiteUrl: data.websiteUrl || null,
      websiteLabel: data.websiteLabel || null,
      isActive: data.isActive,
      isVerified: data.isVerified,
      adminDestination: data.adminDestination || null,
      createdAt: data.createdAt?.toMillis() || null,
      modifiedAt: data.modifiedAt?.toMillis() || null,
      adminContactId: data.adminContactId || null,
      contactCaption: data.contactCaption || null,
      currency: data.currency,
      subscriptionEndDate: data.subscriptionEndDate?.toMillis() || null,
      subscriptionBillingType: data.subscriptionBillingType || null,
      isAdminBlocked: data.isAdminBlocked,
      links: data.links || null,
      hasSubscription: !data.subscriptionEndDate
        ? false
        : isAfter(new Date(data.subscriptionEndDate.toMillis()), Date.now()),
    };
  },
  toFirestore(data: Shop): DocumentData {
    return { ...data };
  },
};

export const shopConfigured = (shop: Shop): boolean =>
  !!shop.adminContactId && !!shop.adminDestination;

export const shopInactive = (shop: Shop): boolean =>
  !shop.isActive || shop.isAdminBlocked || !shopConfigured(shop);
