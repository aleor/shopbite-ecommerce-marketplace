import format from 'date-fns/format';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { Center, Heading, HStack, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';

import {
    moneyValueFormatter, numberFormatter, reportToShopAnalytics, ShopAnalytics, ShopAnalyticsReport
} from '../../../../libs/analytics/shopAnalyticsReport';
import fetcher from '../../../../libs/fetcher';
import { ShopContext } from '../../hooks/shopContext';
import AnalyticsCard from './AnalyticsCard';

const LifetimeAnalytics = () => {
  const shop = useContext(ShopContext);
  const startDate = shop ? format(shop.createdAt, 'yyyy-MM-dd') : null;

  const [shopAnalytics, setShopAnalytics] = useState(null as ShopAnalytics);

  const { data, error, isValidating } = useSWR<{
    shopAnalyticsReport: ShopAnalyticsReport;
  }>(
    startDate ? `${shop.id}/analytics/lifetime/${startDate}` : null,
    () => fetcher(`/analytics/lifetime?startDate=${startDate}`),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const { shopAnalyticsReport } = data;

    if (!shopAnalyticsReport) {
      return;
    }

    setShopAnalytics(reportToShopAnalytics(shopAnalyticsReport));
  }, [data]);

  if (error) {
    return (
      <Center py="4">
        <Text fontFamily="poppins">
          Tidak berhasil memuat data analitik, harap mencoba kembali.
        </Text>
      </Center>
    );
  }

  return (
    <VStack spacing="4" alignItems="flex-start" w="100%">
      <Heading
        as="h4"
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize="24px"
      >
        Analitik Lifetime
      </Heading>
      {isValidating ? (
        <Center pt="2">
          <HStack spacing="4">
            <Spinner color="brand.blue"></Spinner>
            <Text fontFamily="poppins">Memuat data...</Text>
          </HStack>
        </Center>
      ) : (
        <SimpleGrid
          columnGap="4"
          rowGap={{ base: 2, sm: 4, md: 2 }}
          w="100%"
          columns={{ base: 4, sm: 2, lg: 4 }}
        >
          <AnalyticsCard
            title="Kunjungan Toko"
            value={numberFormatter(shopAnalytics?.totalCatalogVisits)}
          />
          <AnalyticsCard
            title="Produk Dibuka"
            value={numberFormatter(shopAnalytics?.totalItemsViewed)}
          />
          <AnalyticsCard
            title="Jumlah Pesanan"
            value={numberFormatter(shopAnalytics?.totalOrdersCreated)}
          />
          <AnalyticsCard
            title="Total Transaksi"
            value={moneyValueFormatter(
              shopAnalytics?.totalPurchaseRevenue,
              shop.currency
            )}
          />
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default LifetimeAnalytics;
