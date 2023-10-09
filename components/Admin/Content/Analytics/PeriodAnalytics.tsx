import 'react-datepicker/dist/react-datepicker.css';

import { format, subDays, subMonths } from 'date-fns';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import useSWR from 'swr';

import {
    Box, Center, FormControl, Heading, HStack, Link, Spinner, Stack, Text, VStack
} from '@chakra-ui/react';

import { mapToCountableResult } from '../../../../libs/analytics/mapToCountableResult';
import { ShopAnalyticsReport } from '../../../../libs/analytics/shopAnalyticsReport';
import fetcher from '../../../../libs/fetcher';
import { CountableResult, GAReportModel } from '../../../../models/analytics';
import { ShopContext } from '../../hooks/shopContext';
import { useNavigation } from '../../hooks/useNavigation';
import { useSubscription } from '../../hooks/useSubscription';
import CatalogAnalytics from './Reports/CatalogAnalytics';
import ItemsAnalytics from './Reports/ItemsAnalytics';
import SearchedKeywords from './Reports/SearchedKeywords';
import ViewedCategories from './Reports/ViewedCategories';

const PeriodAnalytics = ({}) => {
  const _monthAgo = subMonths(new Date(), 1);
  const _yesterday = subDays(new Date(), 1);
  const _7daysAgo = subDays(new Date(), 7);

  const shop = useContext(ShopContext);
  const hasActiveSubscription = useSubscription();

  const [dateRange, setDateRange] = useState([
    hasActiveSubscription ? _monthAgo : _7daysAgo,
    _yesterday,
  ]);
  const [startDate, endDate] = dateRange;

  const [searchResult, setSearchResult] = useState([] as CountableResult[]);

  const [top10Collections, setTop10Collections] = useState(
    [] as CountableResult[]
  );

  const { getLink } = useNavigation();

  const stringifyDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const { data, error, isValidating } = useSWR<{
    searchReport: GAReportModel;
    deviceCategoryReport: GAReportModel;
    topCollectionsReport: GAReportModel;
    itemsAnalyticsReport: GAReportModel;
    shopAnalyticsReport: ShopAnalyticsReport;
  }>(
    startDate && endDate
      ? `${shop.id}/analytics/period/${stringifyDate(
          startDate
        )}/${stringifyDate(endDate)}`
      : null,
    () =>
      fetcher(
        `/analytics/period?startDate=${stringifyDate(
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

    setSearchResult(mapToCountableResult(data.searchReport.rows));
    setTop10Collections(mapToCountableResult(data.topCollectionsReport.rows));
  }, [data]);

  if (error) {
    return (
      <Center py="4">
        <Text fontFamily="poppins">
          Failed to load analytics data, please try again
        </Text>
      </Center>
    );
  }

  return (
    <VStack spacing="10" alignItems="flex-start" w="100%" pb="4">
      <Stack
        w="100%"
        direction={{ base: 'row', sm: 'column', lg: 'row' }}
        spacing="4"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Heading
          as="h4"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize="24px"
        >
          Analytic Period
        </Heading>
        <FormControl w={{ base: '25%', sm: '100%', lg: '25%' }}>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={false}
            placeholderText="Select date range"
            dateFormat="yyyy/MM/dd"
            maxDate={_yesterday}
            minDate={
              hasActiveSubscription ? new Date(shop.createdAt) : _7daysAgo
            }
          />
        </FormControl>
      </Stack>

      {!hasActiveSubscription && (
        <Text
          fontFamily="poppins"
          fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        >
          You can only access analytics data up to a maximum of 7 days
          back. Upgrade with{' '}
          <NextLink href={getLink('upgrade')}>
            <Link>Premium package</Link>
          </NextLink>{' '}
          to access full analytics data.
        </Text>
      )}

      {isValidating ? (
        <Center pt="2">
          <HStack spacing="4">
            <Spinner color="brand.blue"></Spinner>
            <Text fontFamily="poppins">
              Loading data for the selected period...
            </Text>
          </HStack>
        </Center>
      ) : (
        <>
          <Box w="100%">
            <CatalogAnalytics
              shopAnalyticsReport={data?.shopAnalyticsReport}
              deviceAnalyticsReport={data?.deviceCategoryReport}
              dateRange={dateRange}
            />
          </Box>

          <Stack
            w="100%"
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', lg: 'row' }}
            spacing={{ base: '32', sm: '12', lg: '32' }}
          >
            <SearchedKeywords searchResult={searchResult} />
            <ViewedCategories collectionResult={top10Collections} />
          </Stack>

          <Box w="100%">
            <ItemsAnalytics startDate={dateRange[0]} endDate={dateRange[1]} />
          </Box>
        </>
      )}
    </VStack>
  );
};

export default PeriodAnalytics;
