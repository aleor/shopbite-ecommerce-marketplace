import { Box, HStack, Text } from '@chakra-ui/react';

import { formatPrice } from '../../libs/formatPrice';
import { getOrderTotalPrice, getTotalItems } from '../../libs/getTotal';
import { OrderItem } from '../../models/orderItem';

const OrderFooter = ({ items = [] }: { items: OrderItem[] }) => {
  return (
    <Box
      bg="white"
      paddingY="6"
      boxShadow={{
        base: 'none',
        sm: '0px -4px 15px rgba(0, 0, 0, 0.04)',
        lg: 'none',
      }}
    >
      <HStack
        spacing={{ base: '8', sm: '8', md: '40' }}
        width="100%"
        justifyContent={{
          base: 'space-between',
          sm: 'space-between',
          md: 'flex-end',
        }}
        alignItems="flex-end"
        paddingX={{ base: '20', sm: '6', md: '20' }}
      >
        <Text fontFamily="poppins" fontWeight="normal" fontSize="12px">
          Total {getTotalItems(items)} item(s)
        </Text>
        <Text fontFamily="poppins" fontWeight="semibold" fontSize="16px">
          {formatPrice(getOrderTotalPrice(items))}
        </Text>
      </HStack>
    </Box>
  );
};

export default OrderFooter;
