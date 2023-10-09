import Image from 'next/image';

import { Box, Text } from '@chakra-ui/react';

const OrdersDashboard = () => {
  return (
    <Box py="20" display="flex" justifyContent="center" position="relative">
      <Image
        src="/images/order_list_preview.png"
        alt="Coming Soon"
        objectFit="contain"
        width={1080}
        height={610}
      />
      <Box
        backgroundColor="#D6D6D699;"
        position="absolute"
        display="flex"
        justifyContent="center"
        alignItems="center"
        top="42%"
        h={{ base: '60px', sm: '40px', md: '60px' }}
        w="100%"
      >
        <Text fontFamily="poppins" fontSize="24px" fontWeight="semibold">
          Coming Soon
        </Text>
      </Box>
    </Box>
  );
};

export default OrdersDashboard;
