import { Box, StackProps, Text, TextProps } from '@chakra-ui/react';

import { useAppSelector } from '../../../app/hooks';
import { formatPrice } from '../../../libs/formatPrice';

interface PriceProps {
  price: number;
  rootProps?: StackProps;
  priceProps?: TextProps;
}

const Price = (props: PriceProps) => {
  const { price, priceProps } = props;
  const { currency } = useAppSelector((state) => state.shop);

  return (
    <Box>
      <Text
        as="span"
        fontWeight="semibold"
        fontSize="md"
        color="brand.green"
        {...priceProps}
      >
        {formatPrice(price, { currency })}
      </Text>
    </Box>
  );
};

export default Price;
