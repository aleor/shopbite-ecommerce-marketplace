import { Box, Text } from '@chakra-ui/react';

const ItemCount = ({ count }) => {
  return (
    <Box border="1px solid" borderColor="brand.green" borderRadius="5px">
      <Text fontSize="16px" fontWeight="medium" color="brand.green" px="2">
        {count}x
      </Text>
    </Box>
  );
};

export default ItemCount;
