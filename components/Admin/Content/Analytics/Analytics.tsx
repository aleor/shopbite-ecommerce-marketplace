import {
    ArcElement, BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale,
    LineElement, PointElement, Title, Tooltip
} from 'chart.js';

import { Box, Divider, VStack } from '@chakra-ui/react';

import LifetimeAnalytics from './LifetimeAnalytics';
import PeriodAnalytics from './PeriodAnalytics';

const Analytics = () => {
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
  );

  return (
    <Box p="4" width="100%">
      <VStack spacing="6" alignItems="flex-start" w="100%">
        <LifetimeAnalytics />
        <Divider borderColor="brand.green" />
        <PeriodAnalytics />
      </VStack>
    </Box>
  );
};

export default Analytics;
