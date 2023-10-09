import { format } from 'date-fns';
import { useContext } from 'react';

import { FormControl, FormLabel, Text, VStack } from '@chakra-ui/react';

import { ShopContext } from '../../../hooks/shopContext';
import { useSubscription } from '../../../hooks/useSubscription';

const SubscriptionSettings = () => {
  const shop = useContext(ShopContext);
  const hasActiveSubscription = useSubscription();

  return (
    <>
      <VStack spacing="6" alignItems="flex-start" w="100%">
        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="currentPlan"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Shopbite Account Types
          </FormLabel>

          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {hasActiveSubscription ? 'Premium' : 'Standar'}
          </Text>
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="validUntil"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Premium Status End Date
          </FormLabel>

          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {hasActiveSubscription
              ? format(shop.subscriptionEndDate, 'MMMM dd, yyyy')
              : '-'}
          </Text>
        </FormControl>
      </VStack>
    </>
  );
};

export default SubscriptionSettings;
