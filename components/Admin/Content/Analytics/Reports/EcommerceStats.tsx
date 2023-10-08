import { format, parseISO } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { Box, Stack, VStack } from '@chakra-ui/react';

import { normalizeReportsByDates } from '../../../../../libs/analytics/normalizeReportByDates';
import {
    moneyValueFormatter, numberFormatter, reportToShopAnalytics, ShopAnalytics, ShopAnalyticsReport
} from '../../../../../libs/analytics/shopAnalyticsReport';
import { ShopContext } from '../../../hooks/shopContext';
import ReportTextRow from '../ReportTextRow';

const EcommerceStats = ({
  shopAnalyticsReport,
  dateRange,
}: {
  shopAnalyticsReport: ShopAnalyticsReport;
  dateRange: Date[];
}) => {
  const [shopAnalytics, setShopAnalytics] = useState(null as ShopAnalytics);

  const [datasets, setDatasets] = useState({
    orders: [] as { date: string; value: number }[],
    transactions: [] as { date: string; value: number }[],
    items: [] as { date: string; value: number }[],
    visits: [] as { date: string; value: number }[],
  });

  const shop = useContext(ShopContext);

  const normalizeGraphData = (report: ShopAnalyticsReport) => {
    const [
      catalogVisitsDataset,
      itemsViewedDataset,
      transactionsDataset,
      ordersCreatedDataset,
    ] = normalizeReportsByDates(
      [
        report.catalogVisitsReport,
        report.itemsViewedReport,
        report.purchaseRevenueReport,
        report.ordersCreatedReport,
      ],
      dateRange[0],
      dateRange[1]
    );

    setDatasets({
      orders: ordersCreatedDataset,
      transactions: transactionsDataset,
      items: itemsViewedDataset,
      visits: catalogVisitsDataset,
    });
  };

  useEffect(() => {
    if (!shopAnalyticsReport || !dateRange) {
      return;
    }

    setShopAnalytics(reportToShopAnalytics(shopAnalyticsReport));
    normalizeGraphData(shopAnalyticsReport);
  }, [shopAnalyticsReport, dateRange]);

  if (!shopAnalytics) {
    return null;
  }

  return (
    <VStack w="100%" spacing="8">
      <Stack
        w="100%"
        spacing="12"
        direction={{ base: 'row', sm: 'column', lg: 'row' }}
      >
        <VStack w="100%" spacing="4">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { position: 'bottom' } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
            data={{
              labels: datasets.visits.map(
                (v) => format(parseISO(v.date), 'MMM dd'),
                'dd MMM'
              ),
              datasets: [
                {
                  label: 'Kunjungan Toko',
                  data: datasets.visits.map((v) => v.value),
                  borderColor: '#856C3F',
                  backgroundColor: '#856C3F',
                  tension: 0.1,
                  borderWidth: 2,
                  pointHoverBorderColor: 'darkgray',
                },
                {
                  label: 'Produk Dibuka',
                  data: datasets.items.map((v) => v.value),
                  borderColor: '#518788',
                  backgroundColor: '#518788',
                  tension: 0.1,
                  borderWidth: 2,
                  pointHoverBorderColor: 'darkgray',
                },
                {
                  label: 'Jumlah Pesanan',
                  data: datasets.orders.map((v) => v.value),
                  borderColor: '#CEA55A',
                  backgroundColor: '#CEA55A',
                  tension: 0.1,
                  borderWidth: 2,
                  pointHoverBorderColor: 'darkgray',
                },
              ],
            }}
          />

          <Box w="100%">
            <VStack w="100%">
              <ReportTextRow
                label="Kunjungan Toko"
                value={numberFormatter(shopAnalytics.totalCatalogVisits)}
              />

              <ReportTextRow
                label="Produk Dibuka"
                value={numberFormatter(shopAnalytics.totalItemsViewed)}
              />

              <ReportTextRow
                label="Jumlah Pesanan"
                value={numberFormatter(shopAnalytics.totalOrdersCreated)}
              />
            </VStack>
          </Box>
        </VStack>

        <VStack w="100%" spacing="4">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { position: 'bottom' } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
            data={{
              labels: datasets.transactions.map(
                (t) => format(parseISO(t.date), 'MMM dd'),
                'dd MMM'
              ),
              datasets: [
                {
                  label: 'Total Transaksi Harian',
                  data: datasets.transactions.map((t) => t.value),
                  borderColor: '#856C3F',
                  backgroundColor: '#856C3F',
                  tension: 0.1,
                  borderWidth: 2,
                  pointHoverBorderColor: 'darkgray',
                },
              ],
            }}
          />

          <Box w="100%">
            <VStack w="100%">
              <ReportTextRow
                label="Rata-rata Transaksi"
                value={moneyValueFormatter(
                  shopAnalytics.averagePurchaseRevenue,
                  shop.currency
                )}
              />

              <ReportTextRow
                label="Total Transaksi"
                value={moneyValueFormatter(
                  shopAnalytics.totalPurchaseRevenue,
                  shop.currency
                )}
              />
            </VStack>
          </Box>
        </VStack>
      </Stack>
    </VStack>
  );
};

export default EcommerceStats;
