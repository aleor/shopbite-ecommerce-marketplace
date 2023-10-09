import { Box, SimpleGrid, VStack } from '@chakra-ui/react';

import { Order, Shop } from '../../models';
import OrderFooter from './OrderFooter';
import OrderHeader from './OrderHeader';
import PurchasedItem from './PurchasedItem';

const ShoppingList = ({ order, shop }: { order: Order; shop: Shop }) => {
  if (!order || !shop) {
    return null;
  }

  return (
    <Box>
      <VStack height="100vh" width="100vw" alignItems="normal" spacing="0">
        <Box px={{ base: '4', md: '20' }} paddingY="2">
          <OrderHeader order={order} shop={shop} />
        </Box>
        <Box
          backgroundColor={{
            base: 'brand.backgroundColor',
            sm: 'white',
            md: 'brand.backgroundColor',
          }}
          px={{ base: '4', md: '20' }}
          py={{ base: '4', sm: '4', md: '8' }}
          flex="1"
        >
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacing={{ base: 10, sm: 6, md: 6, lg: 10 }}
          >
            {order.itemList.map((item, index) => (
              <Box key={index}>
                <PurchasedItem item={item} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        <OrderFooter items={order.itemList} />
      </VStack>
    </Box>
  );
};

export default ShoppingList;
