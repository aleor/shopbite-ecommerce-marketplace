import { getApp } from 'firebase/app';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { useAppDispatch } from '../app/hooks';
import NotFound from '../components/NotFound/NotFound';
import ShopPage from '../components/Shop/ShopPage';
import { setCollections } from '../features/collections/collections-slice';
import { selectAndShowDetails } from '../features/items/items-slice';
import { setShop } from '../features/shop/shop-slice';
import { db } from '../firebase/firestore';
import { functionsRegion } from '../firebase/functions';
import { injectShop, logViewCatalog } from '../libs/analytics/logEvents';
import {
  Collection,
  collectionConverter,
  itemConverter,
  Shop,
  shopConverter,
} from '../models';

const Shop = ({
  shop,
  collections,
  allItemsCollection,
  itemId,
}: {
  shop: Shop | null;
  collections: Collection[] | null;
  allItemsCollection: Collection | null;
  itemId: string;
}) => {
  const dispatch = useAppDispatch();
  const [allCollections, setAllCollections] =
    useState<Collection[]>(collections);

  useEffect(() => {
    const mergedCollections = [collections, allItemsCollection]
      .flatMap((c) => c)
      .filter((c) => c) as Collection[];

    setAllCollections([...mergedCollections]);

    dispatch(setShop(shop));
    dispatch(setCollections([...mergedCollections]));

    if (shop) {
      injectShop(shop);
      logViewCatalog();
    }

    if (itemId) {
      const selectedItem = collections
        ?.flatMap((c) => c.itemList)
        .find((i) => i.id === itemId);

      dispatch(selectAndShowDetails(selectedItem));
    }
  }, []);

  if (!shop) {
    return <NotFound message="Shop not found" />;
  }

  return (
    <>
      <Head>
        <title>{`@${shop.username} | Shopbite`}</title>
      </Head>
      <Box display="flex" flexDirection="column">
        <ShopPage shop={shop} collections={allCollections} />
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const username = context.query?.shop?.[0];
  const itemId = context.query?.shop?.[1];

  if (!username) {
    return {
      props: {
        shop: null,
      },
    };
  }

  const shopQuery = query(
    collection(db, 'shops'),
    where('username', '==', username),
    limit(1)
  );

  const shopQuerySnapshot = await getDocs(
    shopQuery.withConverter(shopConverter)
  );

  if (shopQuerySnapshot.empty) {
    return {
      props: {
        shop: null,
      },
    };
  }

  const shop = shopQuerySnapshot.docs[0].data();

  if (!shop.isVerified) {
    const syncEmailVerificationStatus = httpsCallable<
      { userId: string },
      { emailVerified: boolean }
    >(getFunctions(getApp(), functionsRegion), 'syncEmailVerificationStatus');

    const result = await syncEmailVerificationStatus({ userId: shop.id });

    if (result?.data?.emailVerified) {
      shop.isVerified = true;
    }
  }

  const collectionsQuery = collection(
    db,
    'shops',
    shop.id,
    'collections'
  ).withConverter(collectionConverter);

  const collectionsQuerySnapshot = await getDocs(collectionsQuery);
  const collections = collectionsQuerySnapshot.empty
    ? null
    : collectionsQuerySnapshot.docs.map((doc) => doc.data());

  const nonHiddenItemsQuery = query(
    collection(db, 'shops', shop.id, 'items'),
    where('status', '!=', 'H')
  ).withConverter(itemConverter);

  const nonHiddenItemsQuerySnapshot = await getDocs(nonHiddenItemsQuery);

  const allItemsCollection: Collection = nonHiddenItemsQuerySnapshot.empty
    ? null
    : {
        id: 'all-items',
        itemList: nonHiddenItemsQuerySnapshot.docs.map((doc, index) => {
          return { ordering: index, ...doc.data() };
        }),
        label: 'Semua Produk',
        ordering: Number.MAX_VALUE,
      };

  return {
    props: {
      shop,
      collections,
      itemId: itemId || null,
      allItemsCollection,
    },
  };
}

export default Shop;
