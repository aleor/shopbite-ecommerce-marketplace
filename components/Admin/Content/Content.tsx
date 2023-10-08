import { collection } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { lazy, Suspense, useContext } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Center, HStack, Spinner, Text } from '@chakra-ui/react';

import { db } from '../../../firebase/firestore';
import { collectionConverter, itemConverter } from '../../../models';
import { ShopContext } from '../hooks/shopContext';
import { MenuTabQuery } from '../Navigation/menu';
import Account from './Account/Account';
import Collections from './Collections/Collections';
import Items from './Items/Items';
import Links from './Links/Links';
import OrdersDashboard from './Orders/OrdersDashboard';
import Upgrade from './Upgrade/Upgrade';

const Analytics = lazy(() => import('./Analytics/Analytics'));

const Content = () => {
  const shop = useContext(ShopContext);

  const [collections, collectionsLoading, collectionsLoadingError] =
    useCollectionData(
      collection(db, `shops/${shop.id}/collections`).withConverter(
        collectionConverter
      )
    );

  const [allItems, itemsLoading, itemsLoadingError] = useCollectionData(
    collection(db, `shops/${shop.id}/items`).withConverter(itemConverter)
  );

  const router = useRouter();

  const query = parseUrl(router.asPath)?.query;
  const target = query?.tab as MenuTabQuery;

  if (collectionsLoading || itemsLoading) {
    return (
      <Center width="100%" height="100%">
        <Spinner color="brand.blue" />
      </Center>
    );
  }

  if (collectionsLoadingError || itemsLoadingError) {
    return (
      <Center width="100%" height="100%">
        <Text>Gagal memuat data toko Anda, harap mencoba kembali.</Text>
      </Center>
    );
  }

  const renderTargetTab = () => {
    switch (target) {
      case 'collections':
        return (
          <Collections
            items={allItems}
            collections={collections}
            shopId={shop.id}
          />
        );
      case 'items':
        return <Items items={allItems} collections={collections} />;
      case 'links':
        return <Links />;
      case 'analytics':
        return (
          <Suspense
            fallback={
              <Center pt="10">
                <HStack spacing="4">
                  <Spinner color="brand.blue"></Spinner>
                  <Text>Memuat data analitik...</Text>
                </HStack>
              </Center>
            }
          >
            <Analytics />
          </Suspense>
        );
      case 'upgrade':
        return <Upgrade />;
      case 'account':
        return <Account />;
      case 'orders':
        return <OrdersDashboard />;
      default:
        return <Items items={allItems} collections={collections} />;
    }
  };

  return renderTargetTab();
};

export default Content;
