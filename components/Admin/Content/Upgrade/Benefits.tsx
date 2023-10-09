import format from 'date-fns/format';
import { useContext, useEffect } from 'react';
import { BsClipboardData, BsEmojiLaughing, BsImages, BsWindowSidebar } from 'react-icons/bs';

import { Box, Button, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react';

import { useToast } from '../../../../libs/useToast';
import { ShopContext } from '../../hooks/shopContext';
import { useSubscription } from '../../hooks/useSubscription';
import ActiveSubscriptionHeader from './ActiveSubscriptionHeader';
import BenefitCard from './BenefitCard';
import { DiamondIcon } from './Icons/DiamondIcon';
import UpgradePageHeader from './UpgradePageHeader';

const Benefits = ({
  paymentResult,
  onShowPackage,
  onSelectPlan,
}: {
  paymentResult?: 'success' | 'failure';
  onShowPackage: () => void;
  onSelectPlan: () => void;
}) => {
  const { showToast } = useToast();

  const shop = useContext(ShopContext);

  useEffect(() => {
    if (paymentResult === 'failure') {
      showToast({
        status: 'error',
        title: 'Payment failed',
        description: 'Please try again or contact us',
      });
    }
  }, [paymentResult]);

  const hasActiveSubscription = useSubscription();

  return (
    <VStack width="100%" alignItems="flex-start" spacing="4">
      {hasActiveSubscription || paymentResult === 'success' ? (
        <ActiveSubscriptionHeader
          type={hasActiveSubscription ? shop.subscriptionBillingType : null}
        />
      ) : (
        <UpgradePageHeader mode="view_all_benefits" />
      )}

      <Box width="100%" pt="8">
        <VStack spacing={{ base: '20', sm: '12', md: '20' }}>
          <Stack
            spacing={{ base: '20', sm: '12', md: '20' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
          >
            <BenefitCard
              iconType={BsEmojiLaughing}
              text={
                <Text fontFamily="source" fontSize="16px" fontWeight="normal">
                  All the benefits of a Standard Account. See the benefits of a Standard Account{' '}
                  <Link onClick={onShowPackage}>here</Link>
                </Text>
              }
            />
            <BenefitCard
              iconType={BsWindowSidebar}
              text="Free website and shop management system with unlimited number of product types"
            />
            <BenefitCard
              iconType={BsClipboardData}
              text="Data analytics from the first day of store publication"
            />
          </Stack>
          <Stack
            spacing={{ base: '20', sm: '12', md: '20' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
          >
            <BenefitCard
              iconType={BsImages}
              text="Upload multiple images for each item"
            />
            <BenefitCard
              icon={<DiamondIcon boxSize={8} />}
              text="Get priority support"
            />
          </Stack>
        </VStack>
      </Box>

      <VStack spacing="8" py="12" width="100%" alignItems="center">
        <Text
          fontFamily="poppins"
          fontSize="16px"
          fontWeight="semibold"
          color="brand.green"
        >
          Also get up to 28% off!
        </Text>

        <Button width="328px" onClick={onSelectPlan}>
          {hasActiveSubscription
            ? 'Extend Premium Status'
            : `I'm interested`}
        </Button>
      </VStack>

      {hasActiveSubscription && (
        <HStack py="4" w="100%" justifyContent="space-between">
          <VStack spacing="4" alignItems="flex-start">
            <Text fontFamily="poppins" fontSize="20px" fontWeight="semibold">
              Premium status end date
            </Text>
            <Text fontFamily="source" fontSize="16px" fontWeight="semibold">
              {format(shop.subscriptionEndDate, 'MMMM dd, yyyy')}
            </Text>
          </VStack>
        </HStack>
      )}
    </VStack>
  );
};

export default Benefits;
