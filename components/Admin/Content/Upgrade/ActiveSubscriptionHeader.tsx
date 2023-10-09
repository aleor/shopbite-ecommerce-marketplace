import { Box, Heading, HStack, Text } from '@chakra-ui/react';

import { SubscriptionBillingType } from '../../../../models';

const ActiveSubscriptionHeader = ({
  type,
}: {
  type: SubscriptionBillingType | null;
}) => {
  return (
    <>
      <HStack justifyContent="space-between" pb="2">
        <Heading
          as="h4"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '24px', sm: '16px', md: '24px' }}
        >
          <Text>
            You are currently enjoying the benefits of
            <Text as="span" color="brand.green">
              {' '}
              Premium Package!
            </Text>
          </Text>
        </Heading>
      </HStack>
      <Box>
        <Text fontFamily="poppins" fontSize="16px">
          Premium Package benefits that you can enjoy:
        </Text>
      </Box>
    </>
  );
};

export default ActiveSubscriptionHeader;
