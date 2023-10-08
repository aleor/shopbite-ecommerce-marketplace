import { Box, Divider, VStack } from '@chakra-ui/react';

import GeneralSettings from './Sections/GeneralSettings';
import ManagementSettings from './Sections/ManagementSettings';
import ShopSettings from './Sections/ShopSettings';
import SubscriptionSettings from './Sections/SubscriptionSettings';

const Account = () => {
  return (
    <Box p="4" width="100%">
      <VStack spacing="4" alignItems="flex-start" w="100%" pb="6">
        <GeneralSettings />
        <Divider borderColor="brand.green" />
        <ShopSettings />
        <Divider borderColor="brand.green" />
        <SubscriptionSettings />
        <Divider borderColor="brand.green" />
        <ManagementSettings />
      </VStack>
    </Box>
  );
};

export default Account;
