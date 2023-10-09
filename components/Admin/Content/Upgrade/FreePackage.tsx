import { BsClipboardData, BsGlobe, BsSignpost, BsWifi } from 'react-icons/bs';

import { Box, Button, Stack, VStack } from '@chakra-ui/react';

import BenefitCard from './BenefitCard';
import UpgradePageHeader from './UpgradePageHeader';

const FreePackage = ({ onClose }: { onClose: () => void }) => {
  return (
    <VStack width="100%" alignItems="flex-start" spacing="4">
      <UpgradePageHeader mode="view_free_package" onClose={onClose} canGoBack />
      <Box width="100%" pt="8">
        <VStack spacing={{ base: '20', sm: '12', md: '20' }}>
          <Stack
            spacing={{ base: '20', sm: '12', md: '20' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
          >
            <BenefitCard
              iconType={BsWifi}
              text="Free website and store management system for up to 30 types of products"
            />
            <BenefitCard
              iconType={BsSignpost}
              text="Connect your customers directly to your shop admin contact when placing an order"
            />
          </Stack>
          <Stack
            spacing={{ base: '20', sm: '12', md: '20' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
          >
            <BenefitCard
              iconType={BsGlobe}
              text="Links for social media links, e-commerce, online food delivery, and others"
            />
            <BenefitCard
              iconType={BsClipboardData}
              text="Shop analytic data invluding customer behavior up to 7 days back"
            />
          </Stack>
        </VStack>
      </Box>

      <VStack spacing="8" py="12" width="100%" alignItems="center">
        <Button width="328px" onClick={onClose}>
          See the benefits of a Premium Account
        </Button>
      </VStack>
    </VStack>
  );
};

export default FreePackage;
