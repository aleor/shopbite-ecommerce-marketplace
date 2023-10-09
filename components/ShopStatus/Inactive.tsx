import { Box, Icon, Text } from '@chakra-ui/react';

import { StoreIcon } from '../Icons/StoreIcon';
import { ShopStatusLayout } from './ShopStatusLayout';

const ShopInactive = () => {
  return (
    <ShopStatusLayout>
      <Icon as={StoreIcon} width="64px" height="64px" />

      <Box textAlign="center">
        <Text color="brand.black70">This shop is temporarily closed.</Text>
        <Text color="brand.black70">
          Please try to come back later.
        </Text>
      </Box>
    </ShopStatusLayout>
  );
};

export default ShopInactive;
