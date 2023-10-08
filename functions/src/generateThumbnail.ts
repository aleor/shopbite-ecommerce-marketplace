import { spawn } from 'child-process-promise';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import fetch from 'node-fetch';
import * as os from 'os';
import * as path from 'path';

import { regionalFunctions } from './regionalFunctions';

const THUMB_HEIGHT = 200;
const THUMB_WIDTH = 200;
const THUMB_PREFIX = 'thumb_';

export const generateThumbnail = regionalFunctions.firestore
  .document('/shops/{shopId}/items/{itemId}')
  .onWrite(async (change, context) => {
    functions.logger.log(
      `Item ${context.params.itemId} for shop ${context.params.shopId} has been updated, checking changes...`
    );

    if (!change.after.exists) {
      functions.logger.log(
        `Item ${context.params.itemId} for shop ${context.params.shopId} has been deleted, skipping further checks.`
      );
      return;
    }

    const newPrimaryImage: string = change.after.data()?.imageUrls?.[0] ?? null;
    const previousPrimaryImage: string =
      change.before.data()?.imageUrls?.[0] ?? null;

    if (newPrimaryImage === previousPrimaryImage) {
      functions.logger.info(
        'Primary image has not been changed, no further updates needed.'
      );
      return;
    }

    if (!newPrimaryImage) {
      functions.logger.info(
        'Primary image has been removed, removing thumbnailUrl...'
      );

      try {
        await admin
          .firestore()
          .collection('shops')
          .doc(context.params.shopId)
          .collection('items')
          .doc(context.params.itemId)
          .update({ thumbnailUrl: null });

        functions.logger.info(
          `thumbnailUrl value for item ${context.params.itemId} for shop ${context.params.shopId}
            has been successfully removed.`
        );
      } catch (error) {
        functions.logger.error(
          `Failed to update thumbnailUrl value for item ${context.params.itemId}: ${error}`
        );
      }
      return;
    }

    functions.logger.info(
      'Primary image has been changed, updating thumbnail image and url...'
    );

    const imageFileResponse = await fetch(newPrimaryImage);

    if (!imageFileResponse.ok) {
      functions.logger.error(
        `Failed to fetch image file for item ${context.params.itemId}: ${imageFileResponse.statusText}`
      );
      return;
    }

    const disposition = imageFileResponse.headers.get('Content-Disposition');
    const filename = disposition?.split(/;(.+)/)?.[1].split(/=(.+)/)?.[1];

    if (!filename) {
      functions.logger.error(
        `Failed to get filename for primary image of the item ${context.params.itemId}`
      );
      return;
    }

    const decodedFilename = filename.toLowerCase().startsWith('utf-8\'\'') ?
      decodeURIComponent(filename.replace('utf-8\'\'', '')) :
      filename.replace(/['"]/g, '');

    functions.logger.info(
      `Image file ${decodedFilename} fetched successfully.`
    );

    const imageFileBuffer = await imageFileResponse.buffer();

    const tempLocalFile = path.join(os.tmpdir(), decodedFilename);

    functions.logger.info(`Writing image file to ${tempLocalFile}...`);

    const tempLocalDir = path.dirname(tempLocalFile);
    functions.logger.info(`Creating directory ${tempLocalDir}...`);

    await mkdirp(tempLocalDir);
    fs.writeFileSync(tempLocalFile, new Uint8Array(imageFileBuffer));

    functions.logger.info(`Image file written to ${tempLocalFile}...`);

    const thumbnailFileName = `${THUMB_PREFIX}${decodedFilename.replace(
      path.extname(decodedFilename),
      '.png'
    )}`;

    const tempLocalThumbFile = path.join(os.tmpdir(), thumbnailFileName);

    functions.logger.info(`Generating thumbnail file ${thumbnailFileName}...`);

    await spawn(
      'convert',
      [
        tempLocalFile,
        '-thumbnail',
        `${THUMB_WIDTH}x${THUMB_HEIGHT}^`,
        tempLocalThumbFile,
      ],
      { capture: ['stdout', 'stderr'] }
    );

    functions.logger.log('Thumbnail created at', tempLocalThumbFile);

    const thumbFilePath = `shops/${context.params.shopId}/images/${thumbnailFileName}`;

    const metadata = {
      'contentType': 'image/png',
      'Cache-Control': 'public,max-age=604800',
    };

    await admin.storage().bucket().upload(tempLocalThumbFile, {
      destination: thumbFilePath,
      metadata,
    });

    functions.logger.log('Thumbnail successfully uploaded to Storage.');

    const thumbFile = admin.storage().bucket().file(thumbFilePath);
    await thumbFile.makePublic();

    functions.logger.log('Thumbnail public url is ', thumbFile.publicUrl());

    await admin
      .firestore()
      .collection('shops')
      .doc(context.params.shopId)
      .collection('items')
      .doc(context.params.itemId)
      .update({ thumbnailUrl: thumbFile.publicUrl() });

    functions.logger.info(
      `thumbnailUrl value for item ${context.params.itemId} for shop ${context.params.shopId}
            has been successfully updated, cleaning up...`
    );

    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);

    functions.logger.info('Updating collections...');

    const item = await admin
      .firestore()
      .collection('shops')
      .doc(context.params.shopId)
      .collection('items')
      .doc(context.params.itemId)
      .get();

    if (!item.exists) {
      functions.logger.error(
        `Item ${context.params.itemId} for shop ${context.params.shopId} does not exist anymore.`
      );
      return;
    }

    const itemCollections = item.data()?.collectionIds ?? [];

    if (itemCollections.length === 0) {
      functions.logger.info(
        `Item ${context.params.itemId} for shop ${context.params.shopId} is not in any collections.`
      );

      return;
    }

    const collections = await admin
      .firestore()
      .collection('shops')
      .doc(context.params.shopId)
      .collection('collections')
      .where(admin.firestore.FieldPath.documentId(), 'in', itemCollections)
      .get();

    if (collections.empty) {
      functions.logger.error(
        `Cannot get Collections for item ${context.params.itemId} for shop ${context.params.shopId}.`
      );
      return;
    }

    const collectionTasks = collections.docs.map((collection) => {
      const collectionItems = collection.data()?.itemList ?? [];
      const originalItem = collectionItems.find(
        (collectionItem: { [x: string]: any }) =>
          collectionItem['id'] === context.params.itemId
      );

      if (!originalItem) {
        functions.logger.error(
          `Cannot find item ${context.params.itemId} in collection ${collection.id} for shop ${context.params.shopId}.`
        );
        return;
      }

      const updatedItemList = [...collectionItems].filter(
        (ci) => ci.id !== originalItem.id
      );

      const updatedItem = {
        ...originalItem,
        thumbnailUrl: thumbFile.publicUrl(),
      };

      return admin
        .firestore()
        .collection('shops')
        .doc(context.params.shopId)
        .collection('collections')
        .doc(collection.id)
        .update({
          itemList: [...updatedItemList, updatedItem],
        });
    });

    await Promise.all(collectionTasks);

    functions.logger.info('Item and collections have been updated, exiting.');
  });
