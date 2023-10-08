import { randomUUID } from 'crypto';
import { addMonths, addYears } from 'date-fns';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore';

import { regionalFunctions } from './regionalFunctions';

admin.initializeApp();

export const reserveUsername = regionalFunctions.firestore
  .document('/shops/{shopId}')
  .onCreate(async (snapshot: QueryDocumentSnapshot) => {
    functions.logger.info('New shop registered, retrieving username...');

    const doc = await admin
      .firestore()
      .collection('shops')
      .doc(snapshot.id)
      .get();

    const username = doc.data()?.username;

    if (!username) {
      functions.logger.error(
        `No username found for a shopId ${snapshot.id}, aborting...`
      );
      return;
    }

    functions.logger.info(`Reserving username '${username}'...`);
    const takenUsernamesCollection = admin.firestore().collection('/usernames');

    try {
      await takenUsernamesCollection.doc(username).create({});
      functions.logger.info(`Username '${username}' reserved.`);
    } catch (error) {
      functions.logger.error(
        `Failed to reserve username '${username}': ${error}`
      );
    }
  });

export const createOrder = regionalFunctions.https.onCall(async (data) => {
  if (!data.shopId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      '"shopId" must be specified'
    );
  }

  const orderId = randomUUID();

  functions.logger.info(`Creating order ${orderId}...`);

  try {
    await admin.firestore().collection('orders').doc(orderId).create({
      shopId: data.shopId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      itemList: data.itemList,
      customerInfo: data.customerInfo,
    });
  } catch (error) {
    functions.logger.error(`Failed to create order ${orderId}: ${error}`);
    throw new functions.https.HttpsError(
      'internal',
      'Unable to create order',
      error
    );
  }

  functions.logger.info(`Order ${orderId} successfully created.`);

  return { orderId };
});

export const syncEmailVerificationStatus = regionalFunctions.https.onCall(
  async (data) => {
    if (!data?.userId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '"userId" must be specified'
      );
    }

    functions.logger.info(`Retrieving email status for user ${data.userId}...`);

    const user = await admin.auth().getUser(data.userId);

    if (!user) {
      functions.logger.error(`User ${data.userId} not found.`);
      return { emailVerified: null };
    }

    functions.logger.info(
      `Syncing e-mail verification status for shop ${data.userId}...`
    );

    try {
      await admin
        .firestore()
        .collection('shops')
        .doc(data.userId)
        .update({ isVerified: user.emailVerified });

      functions.logger.info(
        `E-mail verification status for shop ${data.userId} successfully synced.`
      );
    } catch (error) {
      functions.logger.error(
        `Failed to sync e-mail verification status for shop ${data.userId}: ${error}`
      );
    }

    return {
      emailVerified: user.emailVerified,
    };
  }
);

export const onShopUpdated = regionalFunctions.firestore
  .document('/shops/{shopId}')
  .onUpdate(async (change, context) => {
    const newModifiedAt: admin.firestore.Timestamp | null =
      change.after.data()?.modifiedAt;
    const previousModifiedAt: admin.firestore.Timestamp | null =
      change.before.data()?.modifiedAt;

    if (newModifiedAt?.toMillis() !== previousModifiedAt?.toMillis()) {
      functions.logger.info(
        `modifiedAt has already been changed for shop ${context.params.shopId}, no further updates needed.`
      );
      return;
    }

    functions.logger.info(
      `Shop ${context.params.shopId} has been updated, refreshing 'modifiedAt' value...`
    );

    try {
      await admin
        .firestore()
        .collection('shops')
        .doc(context.params.shopId)
        .update({ modifiedAt: admin.firestore.FieldValue.serverTimestamp() });

      functions.logger.info(
        `Shop ${context.params.shopId} 'modifiedAt' value successfully refreshed.`
      );
    } catch (error) {
      functions.logger.error(
        `Failed to update 'modifiedAt' value for shop ${context.params.shopId}: ${error}`
      );
    }
  });

export const handlePaymentCallback = regionalFunctions.https.onCall(
  async (data: {
    id: string;
    status: 'PAID' | 'EXPIRED';
    paid_at: string;
    paid_amount: number;
    external_id: string;
    payer_email: string;
    payment_method: string;
    payment_channel: string;
    credit_card_charge_id?: string;
    bank_code?: string;
    retail_outlet_name?: string;
    ewallet_type?: string;
  }) => {
    if (!data?.external_id) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '"external_id" must be specified'
      );
    }

    functions.logger.info(
      `Got a payment callback with status ${data.status}, external_id ${data.external_id}
       and payment_id ${data.id}...`
    );

    if (data.status !== 'PAID') {
      functions.logger.info('Payment callback status is not PAID, aborting...');
      return;
    }

    const shopId = data.external_id.split('_')[0];

    if (!shopId) {
      functions.logger.error(
        `Failed to extract shopId from external_id ${data.external_id}`
      );
      return;
    }

    const shopRef = await admin
      .firestore()
      .collection('shops')
      .doc(shopId)
      .get();

    if (!shopRef.exists) {
      functions.logger.error(`Shop with id ${shopId} not found.`);
      return;
    }

    let paymentPeriod: string;

    switch (data.paid_amount) {
      case 54000:
        paymentPeriod = 'M';
        break;
      case 468000:
        paymentPeriod = 'Y';
        break;
      default:
        functions.logger.error(
          `Invalid paid_amount ${data.paid_amount} for shop ${shopId}`
        );
        return;
    }

    const currentSubscriptionEndDate: admin.firestore.Timestamp | null =
      shopRef.data()?.subscriptionEndDate;

    const paidAt = new Date(data.paid_at);

    const newSubscriptionStartDate = currentSubscriptionEndDate
      ? currentSubscriptionEndDate.toDate()
      : paidAt;

    let newSubscriptionEndDate: Date;

    switch (paymentPeriod) {
      case 'M':
        newSubscriptionEndDate = addMonths(newSubscriptionStartDate, 1);
        break;
      case 'Y':
        newSubscriptionEndDate = addYears(newSubscriptionStartDate, 1);
        break;
      default:
        functions.logger.error(
          `Invalid subscriptionPeriod ${paymentPeriod} for shop ${shopId}`
        );
        return;
    }

    functions.logger.info(
      `Updating subscription status for shop ${shopId} with a period: '${paymentPeriod}',
      previous payment End Date: ${currentSubscriptionEndDate?.toDate()},
      new End Date: ${newSubscriptionEndDate}...`
    );

    try {
      await admin
        .firestore()
        .collection('shops')
        .doc(shopId)
        .update({
          subscriptionBillingType: paymentPeriod,
          subscriptionEndDate: admin.firestore.Timestamp.fromDate(
            newSubscriptionEndDate
          ),
        });

      functions.logger.info(
        `Subscription data for shop ${shopId} successfully updated.`
      );
    } catch (error) {
      functions.logger.error(
        `Failed to update subscription data for shop ${shopId}: ${error}`
      );
    }
  }
);

export const dailySubscriptionCheck = regionalFunctions.pubsub
  .schedule('every day 00:00')
  .timeZone('Asia/Jakarta')
  .onRun(async () => {
    const nonHiddenItemsLimit = 30;

    functions.logger.info('Starting scheduled subscription check...');

    const shopsWithExpiredSubscriptionQuery = admin
      .firestore()
      .collection('shops')
      .where('subscriptionEndDate', '<', admin.firestore.Timestamp.now());

    const shopsWithExpiredSubscriptionQuerySnap =
      await shopsWithExpiredSubscriptionQuery.get();

    if (shopsWithExpiredSubscriptionQuerySnap.empty) {
      functions.logger.info(
        'No shops with expired subscription found, exiting...'
      );
      return;
    }

    const shops = shopsWithExpiredSubscriptionQuerySnap.docs.map((doc) => {
      const shop = doc.data();
      shop.id = doc.id;
      return shop;
    });

    functions.logger.info(
      `Found ${shops.length} shop(s) with expired subscriptions.`
    );

    await Promise.all(
      shops.map(async (shop) => {
        functions.logger.info(
          `Applying post-subscription changes for shop ${shop.id}...`
        );

        try {
          if (shop.recurringPaymentId) {
            await admin.firestore().collection('shops').doc(shop.id).update({
              recurringPaymentId: '',
            });

            functions.logger.info(
              `Recurring Payment ID for shop ${shop.id} cleared.`
            );
          } else {
            functions.logger.info(
              `Recurring Payment ID for shop ${shop.id} is already cleared.`
            );
          }

          functions.logger.info(`Retrieving shop items for shop ${shop.id}...`);

          const nonHiddenShopItemsQuery = await admin
            .firestore()
            .collection('shops')
            .doc(shop.id)
            .collection('items')
            .where('status', '!=', 'H')
            .get();

          if (nonHiddenShopItemsQuery.empty) {
            functions.logger.info(
              `No active or disabled items found for shop ${shop.id}, skipping...`
            );
            return;
          }

          const nonHiddenShopItems = nonHiddenShopItemsQuery.docs.map((doc) => {
            const item = doc.data();
            item.id = doc.id;
            return item;
          });

          functions.logger.info(
            `Found ${nonHiddenShopItems.length} non-hidden items for shop ${shop.id}.`
          );

          if (nonHiddenShopItems.length <= nonHiddenItemsLimit) {
            functions.logger.info(
              `Shop ${shop.id} has less (or equal) than ${nonHiddenItemsLimit} non-hidden items, skipping...`
            );
            return;
          }

          const itemsToHide = nonHiddenShopItems.slice(nonHiddenItemsLimit);

          functions.logger.info(
            `Updating / hiding ${itemsToHide.length} items for shop ${shop.id}...`
          );

          await Promise.all(
            itemsToHide.map(async (itemToHide) => {
              await admin
                .firestore()
                .collection('shops')
                .doc(shop.id)
                .collection('items')
                .doc(itemToHide.id)
                .update({
                  status: 'H',
                });
            })
          );

          functions.logger.info(
            `Successfully hidden ${itemsToHide.length} items for ${shop.id}.`
          );

          const itemsToHideIds = itemsToHide.map((item) => item.id);
          const collectionToUpdateIds: string[] = itemsToHide
            .flatMap((item) => item.collectionIds)
            .reduce((acc, curr) => {
              if (!acc.includes(curr)) {
                acc.push(curr);
              }
              return acc;
            }, [] as string[]);

          collectionToUpdateIds.forEach(async (collectionId) => {
            functions.logger.info(
              `Updating items in collection ${collectionId}...`
            );

            const collection = await admin
              .firestore()
              .collection('shops')
              .doc(shop.id)
              .collection('collections')
              .doc(collectionId)
              .get();

            if (!collection.exists) {
              functions.logger.error(
                `Collection with id ${collectionId} not found.`
              );
              return;
            }

            const collectionItems = collection.data()?.itemList;

            const updatedCollectionItems = collectionItems?.map(
              (collectionItem: any) => {
                if (itemsToHideIds.includes(collectionItem.id)) {
                  return {
                    ...collectionItem,
                    status: 'H',
                  };
                }

                return collectionItem;
              }
            );

            await admin
              .firestore()
              .collection('shops')
              .doc(shop.id)
              .collection('collections')
              .doc(collectionId)
              .update({
                itemList: updatedCollectionItems,
              });

            functions.logger.info(
              `Successfully updated items in collection ${collectionId}.`
            );
          });

          functions.logger.info(
            `Post-subscription changes for shop ${shop.id} successfully applied.`
          );
        } catch (error) {
          functions.logger.error(
            `Failed to apply post-subscription changes for shop ${shop.id}: ${error}`
          );
        }
      })
    );
  });

export * from './generateThumbnail';
