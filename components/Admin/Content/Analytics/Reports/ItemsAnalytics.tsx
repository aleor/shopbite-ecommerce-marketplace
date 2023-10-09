import { format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { Box, Heading, SimpleGrid, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import { mapToItemAnalyticsResult } from '../../../../../libs/analytics/mapToItemAnalyticsResult';
import fetcher from '../../../../../libs/fetcher';
import { GAReportModel, ItemAnalyticsResult } from '../../../../../models/analytics';
import { ShopContext } from '../../../hooks/shopContext';
import ItemAnalytics from './ItemAnalytics';

const ItemsAnalytics = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const shop = useContext(ShopContext);

  const [itemsAnalytics, setItemsAnalytics] = useState(
    [] as ItemAnalyticsResult[]
  );

  const stringifyDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const { data, error, isValidating } = useSWR<{
    itemsAnalyticsReport: GAReportModel;
  }>(
    startDate && endDate
      ? `${shop.id}/analytics/items/${stringifyDate(startDate)}/${stringifyDate(
          endDate
        )}`
      : null,
    () =>
      fetcher(
        `/analytics/items?startDate=${stringifyDate(
          startDate
        )}&endDate=${stringifyDate(endDate)}`
      ),
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

    setItemsAnalytics(mapToItemAnalyticsResult(data.itemsAnalyticsReport));
  }, [data]);

  return (
    <VStack spacing="4" alignItems="flex-start">
      <Stack
        direction={{ base: 'row', sm: 'column', md: 'row' }}
        spacing={{ base: 6, sm: 2, md: 6 }}
      >
        <Heading
          as="h4"
          fontFamily="poppins"
          fontSize="20px"
          fontWeight="semibold"
        >
          Product Analytics
        </Heading>
        <Text
          fontFamily="source"
          fontSize="14px"
          fontWeight="normal"
          color="brand.black40"
        >
          The data displayed are the 10 most popular products
        </Text>
      </Stack>

      {isValidating ? (
        <Box py="4">
          <Spinner color="brand.blue" />
        </Box>
      ) : error ? (
        <Box>Failed to load statistics, please try again</Box>
      ) : (
        <SimpleGrid
          pt="4"
          columns={{ base: 2, sm: 1, md: 2 }}
          rowGap="16"
          columnGap="20"
          w="100%"
        >
          {itemsAnalytics.map((item) => (
            <Box
              key={item.itemId}
              w="100%"
              pr={{ base: '12', sm: '0', lg: '12' }}
            >
              <ItemAnalytics item={item} shop={shop} />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default ItemsAnalytics;
