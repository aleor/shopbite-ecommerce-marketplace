import { format, parseISO } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import useSWR from 'swr';

import { Box, Heading, Spinner, VStack } from '@chakra-ui/react';

import { mapToLinksDataset } from '../../../../../libs/analytics/mapToLinkDataset';
import { normalizeReportsByDates } from '../../../../../libs/analytics/normalizeReportByDates';
import fetcher from '../../../../../libs/fetcher';
import { GABatchReportModel, GAReportModel } from '../../../../../models/analytics';
import { ShopContext } from '../../../hooks/shopContext';

const LinksAnalytics = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const shop = useContext(ShopContext);

  const stringifyDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const { data, error, isValidating } = useSWR<{
    linksAnalyticsReport: GABatchReportModel;
    websiteLinksClickedReport: GAReportModel;
  }>(
    startDate && endDate
      ? `${shop.id}/analytics/links/${stringifyDate(startDate)}/${stringifyDate(
          endDate
        )}`
      : null,
    () =>
      fetcher(
        `/analytics/links?startDate=${stringifyDate(
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

    const getLineColor = (index: number) => {
      const colors = [
        '#856C3F',
        '#518788',
        '#CEA55A',
        '#CA8179',
        '#673ab7',
        '#9c27b0',
        '#3f51b5',
        '#2196f3',
        '#e91e63',
        '#ff9800',
      ];

      return colors[index] || colors[0];
    };

    const [normalizedWebsiteLinksData] = normalizeReportsByDates(
      [data.websiteLinksClickedReport],
      startDate,
      endDate
    );

    setLabels(
      normalizedWebsiteLinksData.map(({ date }) =>
        format(parseISO(date), 'MMM dd')
      )
    );

    const normalizedExternalLinksData = data.linksAnalyticsReport?.reports?.map(
      (report) => mapToLinksDataset(report, [startDate, endDate])
    );

    const websiteLinksDataset = {
      label: 'Website Link',
      data: normalizedWebsiteLinksData.map((data) => data.value),
      backgroundColor: '#D9D9D9',
      type: 'bar',
      maxBarThickness: 16,
      order: 1,
    };

    const externalLinksDatasets = normalizedExternalLinksData?.map(
      (linkReport, index) => {
        const label = linkReport.link.label || linkReport.link.url;
        const trimmedLabel =
          label.length > 30 ? label.substring(0, 30) + '...' : label;

        return {
          label: trimmedLabel,
          data: linkReport.data.map((d) => d.value),
          type: 'line',
          backgroundColor: getLineColor(index),
          borderColor: getLineColor(index),
          tension: 0.1,
          borderWidth: 2,
          pointHoverBorderColor: 'darkgray',
          pointRadius: 2,
          order: 0,
        };
      }
    );

    setDatasets(
      externalLinksDatasets
        ? [websiteLinksDataset, ...externalLinksDatasets]
        : [websiteLinksDataset]
    );
  }, [data]);

  return (
    <VStack spacing="4" alignItems="flex-start" w="100%">
      <Heading
        as="h4"
        fontFamily="poppins"
        fontSize="20px"
        fontWeight="semibold"
      >
        Top 5 Link Dibuka
      </Heading>

      {isValidating ? (
        <Box py="4">
          <Spinner color="brand.blue" />
        </Box>
      ) : error ? (
        <Box>Gagal memuat data statistik, harap mencoba kembali</Box>
      ) : (
        <Box pt="2" w="100%">
          <Chart
            type="bar"
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
              labels,
              datasets,
            }}
          />
        </Box>
      )}
    </VStack>
  );
};

export default LinksAnalytics;
