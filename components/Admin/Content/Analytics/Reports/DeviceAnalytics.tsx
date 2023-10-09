import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

import {
    Box, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack
} from '@chakra-ui/react';

import { mapToDeviceCategoryResult } from '../../../../../libs/analytics/mapToDeviceCategoryResult';
import { DeviceCategoryResult, GAReportModel } from '../../../../../models/analytics';

const DeviceAnalytics = ({
  deviceAnalyticsReport,
}: {
  deviceAnalyticsReport: GAReportModel;
}) => {
  const [deviceCategories, setDeviceCategories] = useState(
    [] as DeviceCategoryResult[]
  );

  useEffect(() => {
    if (!deviceAnalyticsReport) {
      return;
    }

    setDeviceCategories(mapToDeviceCategoryResult(deviceAnalyticsReport.rows));
  }, [deviceAnalyticsReport]);

  return (
    <VStack spacing="4" alignItems="flex-start" w="100%">
      <Heading
        as="h4"
        fontFamily="poppins"
        fontSize="20px"
        fontWeight="semibold"
      >
        Device Analytics
      </Heading>

      <Box pt="2" w="100%">
        <Pie
          height={200}
          width={200}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
          }}
          data={{
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [
              {
                label: 'Device Category',
                data: deviceCategories.map((c) => c.count),
                backgroundColor: ['#D0677F', '#75C6E7', '#ECDB73'],
                borderColor: ['#D0677F', '#75C6E7', '#ECDB73'],
                borderWidth: 1,
              },
            ],
          }}
        />
      </Box>

      <Box w="100%">
        <TableContainer fontSize="12px">
          <Table>
            <Thead>
              <Tr>
                <Th>Device Category</Th>
                <Th isNumeric>Number of Users</Th>
              </Tr>
            </Thead>
            <Tbody>
              {deviceCategories.map((entry, index) => (
                <Tr key={index}>
                  <Td>{entry.category}</Td>
                  <Td isNumeric>{entry.count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
};

export default DeviceAnalytics;
