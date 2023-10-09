import { format } from 'date-fns';
import { useCallback } from 'react';

import {
    Avatar, Box, Divider, HStack, Icon, Link, Show, Stack, Text, VStack
} from '@chakra-ui/react';

import { getOrderLink } from '../../libs/getLinks';
import { Order, Shop } from '../../models';
import CopyLinkButton from '../CopyLinkButton';
import { Logo } from '../Icons/Logo';

const OrderHeader = ({ order, shop }: { order: Order; shop: Shop }) => {
  const renderOrderId = useCallback(() => {
    return (
      <>
        <Text whiteSpace="nowrap">Order Number</Text>
        <Text
          color="brand.black70"
          noOfLines={1}
          textAlign="right"
          wordBreak="break-all"
        >
          {order.id.toUpperCase()}
        </Text>
      </>
    );
  }, [order.id]);

  const renderOrderDate = useCallback(() => {
    return (
      <>
        <Text>Order date</Text>
        <Text color="brand.black70">
          {format(order.createdAt, 'dd MMM, yyyy; HH:mm OOOO')}
        </Text>
      </>
    );
  }, [order.createdAt]);

  return (
    <Box>
      <HStack
        spacing="4"
        justify="space-between"
        display={{ base: 'none', sm: 'flex', md: 'none' }}
      >
        <Box>
          <Text fontSize="16px" fontWeight="semibold" fontFamily="poppins">
            Order Details
          </Text>
        </Box>
        <Box>
          <a href="/">
            <Icon as={Logo} w="72px" h="16px" />
          </a>
        </Box>
      </HStack>

      <Stack
        spacing={{ base: '4', md: '4' }}
        direction={{ base: 'column', md: 'row' }}
        paddingTop={{ base: '0', sm: '4', md: '0' }}
        justify="flex-start"
      >
        <HStack spacing="4" flex="1" alignItems="flex-start">
          <Box paddingTop="2">
            <Avatar
              src={shop.profilePictureUrl}
              name={shop.profileName}
              boxSize={{ base: '12', sm: '14' }}
            />
          </Box>
          <VStack spacing="1" alignItems="flex-start">
            <HStack justify="flex-start">
              <Text fontSize="lg" fontWeight="semibold">
                {shop.profileName}
              </Text>
            </HStack>

            <Link
              fontSize="md"
              fontWeight="normal"
              href={shop.websiteUrl}
              isExternal
            >
              {shop.websiteUrl}
            </Link>

            <Show above="lg">
              <VStack
                alignItems="flex-start"
                fontSize="12px"
                fontWeight="normal"
                fontFamily="poppins"
                pt="2"
                maxWidth={{ base: '100%', md: '70%', lg: '100%' }}
              >
                <HStack w="100%" justifyContent="space-between">
                  <HStack spacing="20">{renderOrderId()}</HStack>

                  <CopyLinkButton link={getOrderLink(order.id)} size="xs" />
                </HStack>

                <HStack
                  w="100%"
                  justifyContent="space-between"
                  paddingRight="32px"
                >
                  {renderOrderDate()}
                </HStack>
              </VStack>
            </Show>
          </VStack>
        </HStack>

        <VStack
          direction="column"
          spacing={{ base: '3', sm: '0', md: '3' }}
          alignItems="flex-end"
        >
          <Box display={{ base: 'none', md: 'flex' }}>
            <a href="/">
              <Icon as={Logo} w="72px" h="16px" />
            </a>
          </Box>
        </VStack>
      </Stack>

      <Show below="md">
        <VStack
          alignItems="flex-start"
          fontSize="12px"
          fontWeight="normal"
          fontFamily="poppins"
          pt="1"
        >
          <HStack w="100%" spacing={0}>
            <HStack spacing={6} w="100%" justifyContent="space-between">
              {renderOrderId()}
            </HStack>

            <CopyLinkButton link={getOrderLink(order.id)} size="xs" />
          </HStack>

          <HStack w="100%" justifyContent="space-between">
            {renderOrderDate()}
          </HStack>
          <Divider
            pt="1"
            color="brand.gray"
            display={{ base: 'none', sm: 'flex', md: 'none' }}
          />
        </VStack>
      </Show>
    </Box>
  );
};

export default OrderHeader;
