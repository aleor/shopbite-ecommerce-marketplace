import { useEffect } from 'react';

import { Stack, VStack } from '@chakra-ui/react';

import { ShopAnalyticsReport } from '../../../../../libs/analytics/shopAnalyticsReport';
import { GAReportModel } from '../../../../../models/analytics';
import DeviceAnalytics from './DeviceAnalytics';
import EcommerceStats from './EcommerceStats';
import LinksAnalytics from './LinksAnalytics';

const CatalogAnalytics = ({
  shopAnalyticsReport,
  deviceAnalyticsReport,
  dateRange,
}: {
  shopAnalyticsReport: ShopAnalyticsReport;
  deviceAnalyticsReport: GAReportModel;
  dateRange: Date[];
}) => {
  useEffect(() => {
    if (!shopAnalyticsReport || !dateRange) {
      return;
    }
  }, [shopAnalyticsReport, dateRange]);

  return (
    <VStack w="100%" alignItems="flex-start" spacing="12">
      <EcommerceStats
        shopAnalyticsReport={shopAnalyticsReport}
        dateRange={dateRange}
      />

      <Stack
        w="100%"
        alignItems="flex-start"
        spacing={{ base: '20', sm: '8', lg: '20' }}
        direction={{ base: 'row', sm: 'column', lg: 'row' }}
      >
        <LinksAnalytics startDate={dateRange[0]} endDate={dateRange[1]} />

        <DeviceAnalytics deviceAnalyticsReport={deviceAnalyticsReport} />
      </Stack>
    </VStack>
  );
};

export default CatalogAnalytics;
