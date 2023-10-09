import { Box, Icon, Text } from '@chakra-ui/react';

import { QuestionMarkIcon } from '../Icons/QuestionMarkIcon';
import { ShopStatusLayout } from './ShopStatusLayout';

const ShopEmailUnverfied = () => {
  return (
    <ShopStatusLayout>
      <Icon as={QuestionMarkIcon} width="64px" height="64px" />

      <Box textAlign="center">
        <Text color="brand.black70">This shop email is unverified.</Text>
        <Text color="brand.black70">
          Please wait until its being verified
        </Text>
      </Box>
    </ShopStatusLayout>
  );
};

export default ShopEmailUnverfied;
