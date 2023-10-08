import { Box, Icon, Text } from '@chakra-ui/react';

import { StoreIcon } from '../Icons/StoreIcon';
import { ShopStatusLayout } from './ShopStatusLayout';

const ShopInactive = () => {
  return (
    <ShopStatusLayout>
      <Icon as={StoreIcon} width="64px" height="64px" />

      <Box textAlign="center">
        <Text color="brand.black70">Toko ini sementara sedang tutup.</Text>
        <Text color="brand.black70">
          Anda dapat mencoba datang kembali nanti.
        </Text>
      </Box>
    </ShopStatusLayout>
  );
};

export default ShopInactive;
