import { BiBasket } from 'react-icons/bi';

import { Box, Icon, Text } from '@chakra-ui/react';

import { ShopStatusLayout } from './ShopStatusLayout';

const NoCollections = () => {
  return (
    <ShopStatusLayout>
      <Icon as={BiBasket} width="54px" height="54px" />

      <Box textAlign="center">
        <Text color="brand.black70">The store does not have any products yet.</Text>
        <Text color="brand.black70">
          Please try to come back later.
        </Text>
      </Box>
    </ShopStatusLayout>
  );
};

export default NoCollections;
