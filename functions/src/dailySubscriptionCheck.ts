/**
 * This scheduled function performs the task of checking all shops for expired subscriptions.
 * It takes action by hiding extra items and collections when subscriptions have lapsed.
 *
 * IMPORTANT: For the demo version, this function has been commented out to prevent Firebase costs.

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

*/
