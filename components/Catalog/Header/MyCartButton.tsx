import { Box, Button, Text } from '@chakra-ui/react';

import { useAppDispatch } from '../../../app/hooks';
import { openCart } from '../../../features/cart/cart-slice';
import { formatPrice } from '../../../libs/formatPrice';
import { getCartTotalPrice } from '../../../libs/getTotal';

const MyCartButton = ({ cartItems }) => {
  const dispatch = useAppDispatch();

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="flex-start"
      pt="4"
    >
      <Button size="md" width="100%" onClick={() => dispatch(openCart())}>
        <Text color="white">{`
                My cart - ${formatPrice(
                  getCartTotalPrice(cartItems)
                )}`}</Text>
      </Button>
    </Box>
  );
};

export default MyCartButton;
