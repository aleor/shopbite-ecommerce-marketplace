import { useRouter } from 'next/router';
import Script from 'next/script';
import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';

import fetcher from '../../../../libs/fetcher';
import { useToast } from '../../../../libs/useToast';
import { Price, SubscriptionType } from '../../../../models';
import UpgradePageHeader from './UpgradePageHeader';

const PlanSelector = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType>();
  const [validationError, setValidationError] = useState<'none' | 'type'>(
    'none'
  );

  const router = useRouter();

  const makePayment = async () => {
    if (!selectedPlan) {
      setValidationError('type');
      return;
    }

    window['fbq']('track', 'Purchase', {
      value: selectedPlan === 'monthly' ? Price.Monthly : Price.Annually,
      currency: 'IDR',
    });

    setLoading(true);
    try {
      const response = await fetcher('/payment/create', {
        type: selectedPlan,
      });

      const { invoice_url } = response;

      if (!invoice_url) {
        throw Error('No invoice url found');
      }

      router.push(invoice_url);
    } catch (error) {
      setLoading(false);
      showToast({
        status: 'error',
        title: 'Failed to subscribe',
        description:
          'Subscription error occurred, please try again',
      });
      console.log(error);
    }
  };

  return (
    <>
      <VStack width="100%" alignItems="flex-start" spacing="4">
        <UpgradePageHeader mode={'select_plan'} onClose={onClose} canGoBack />
        <VStack width="100%" spacing="8">
          <Box
            bg="white"
            shadow="md"
            w="full"
            maxW="lg"
            mx="auto"
            rounded="lg"
            overflow="hidden"
            cursor="pointer"
            border={
              selectedPlan === SubscriptionType.Annually
                ? '4px solid #11A1FF'
                : 'none'
            }
            onClick={() => setSelectedPlan(SubscriptionType.Annually)}
          >
            <Box bg="#22B3F1" px="4" py="4">
              <HStack justifyContent="space-between">
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontSize="14px"
                    color="white"
                    fontFamily="poppins"
                  >
                    Annual
                  </Text>
                </Box>
                <Box bg="white" borderRadius="5px" px="8px" py="2px">
                  <Text
                    fontWeight="semibold"
                    fontSize="12px"
                    color="brand.error"
                    fontFamily="source"
                  >
                    Most Popular
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box px="8" py="6" borderBottomWidth="1px">
              <VStack spacing="4">
                <Text
                  fontFamily="poppins"
                  fontWeight="semibold"
                  fontSize="20px"
                >
                  IDR 468,000 (1 year)
                </Text>
                <Text
                  fontFamily="poppins"
                  fontWeight="semibold"
                  fontSize="16px"
                  color="brand.error"
                >
                  Save 28%
                </Text>
                <Text
                  fontFamily="source"
                  fontWeight="normal"
                  fontSize="14px"
                  width="190px"
                  align="center"
                >
                  Save more with costs around IDR 39,000/month
                </Text>
              </VStack>
            </Box>
          </Box>

          <Box
            bg="white"
            shadow="md"
            w="full"
            maxW="lg"
            mx="auto"
            rounded="lg"
            overflow="hidden"
            cursor="pointer"
            border={
              selectedPlan === SubscriptionType.Monthly
                ? '4px solid #11A1FF'
                : 'none'
            }
            onClick={() => setSelectedPlan(SubscriptionType.Monthly)}
          >
            <Box bg="#22B3F1" px="4" py="4">
              <Box>
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="white"
                  fontFamily="poppins"
                >
                  Monthly
                </Text>
              </Box>
            </Box>
            <Box px="8" py="6" borderBottomWidth="1px">
              <VStack spacing="6">
                <Text
                  fontFamily="poppins"
                  fontWeight="semibold"
                  fontSize="20px"
                >
                  IDR 54,000 (1 month)
                </Text>

                <Text
                  fontFamily="source"
                  fontWeight="normal"
                  fontSize="14px"
                  width="190px"
                  align="center"
                >
                  Enjoy Premium Account benefits and boost your store sales
                </Text>
              </VStack>
            </Box>
          </Box>

          {validationError === 'type' && (
            <HStack color="brand.error" fontSize="12px" pt="4" height="4">
              <Icon as={HiOutlineExclamationCircle} />
              <Text color="brand.error">
                Please choose a subscription plan first
              </Text>
            </HStack>
          )}

          <Button
            width="346px"
            disabled={loading}
            isLoading={loading}
            loadingText="Memproses..."
            onClick={makePayment}
          >
            Next
          </Button>
        </VStack>
      </VStack>

      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
           fbq('init', '7861557337250283'); 
          `,
        }}
      />
    </>
  );
};

export default PlanSelector;
