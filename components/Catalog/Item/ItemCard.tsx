import Image from 'next/image';
import { useCallback } from 'react';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import { Box, Flex, Heading, HStack, IconButton, Text, VStack } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addToCart } from '../../../features/cart/cart-slice';
import { parseJSONSafely } from '../../../libs/parseJSONSafely';
import { useIsMobile } from '../../../libs/useIsMobile';
import { getLowestPrice, getThumbnailUrl, Item, ItemStatus } from '../../../models';
import Price from './Price';

export const ItemCard = ({
  item,
  onClick,
}: {
  item: Item;
  onClick: (item: Item) => void;
}) => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const itemsInCart = cartItems
    .filter((cartItem) => cartItem.item.id === item.id)
    .reduce((acc, cartItem) => acc + cartItem.quantity, 0);

  const isMobile = useIsMobile();

  const onAdd = () => {
    if (item.variants?.length > 0) {
      onClick(item);
      return;
    }

    dispatch(addToCart({ item, quantity: 1 }));
  };

  const lowestPrice = useCallback(() => {
    return getLowestPrice(item);
  }, [item]);

  return (
    <>
      {isMobile && itemsInCart > 0 && (
        <Flex
          width="3px"
          height="100px"
          backgroundColor="brand.blue"
          position="absolute"
          left="0px"
        ></Flex>
      )}
      <Box
        bg="white"
        opacity={item.status === ItemStatus.disabled ? '50%' : '100%'}
        height={{ base: '174px', sm: 'max-content', md: '174px' }}
        p={{ base: '4', sm: '0', md: '4' }}
        rounded={{ base: 'lg', sm: 'none', md: 'lg' }}
        shadow={{ md: 'base' }}
        display="flex-column"
        minWidth="fit-content"
        onClick={() => onClick(item)}
        cursor="pointer"
        borderLeftWidth={itemsInCart > 0 && !isMobile ? '6px' : '0'}
        borderLeftColor="brand.blue"
        filter={
          item.status === ItemStatus.disabled ? 'grayscale(100%)' : 'none'
        }
      >
        <HStack alignItems="flex-start" spacing="4" height="full">
          <Box width="100px" height="100px" flexShrink={0}>
            <Image
              style={{ borderRadius: '15px' }}
              src={getThumbnailUrl(item)}
              alt={item.title}
              width="100px"
              height="100px"
              objectFit="cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8cP16PQAH/AL/E3vBSgAAAABJRU5ErkJggg=="
            />
          </Box>

          <VStack
            flex={1}
            alignItems="flex-start"
            justifyContent="space-between"
            height={{ base: '100%', sm: '100px', md: '100%' }}
          >
            <VStack
              flex={{ base: '1', sm: '0', md: '1' }}
              alignItems="flex-start"
            >
              <Box textOverflow="ellipsis" width="full" textAlign="start">
                <Heading
                  as="h3"
                  fontSize={{ base: 'lg', sm: '15px', md: 'lg' }}
                  fontWeight="semibold"
                  noOfLines={2}
                  color={
                    item.status === ItemStatus.disabled
                      ? 'gray.500'
                      : 'brand.black'
                  }
                >
                  <Box as="span" color="brand.blue">
                    {itemsInCart > 0 ? `${itemsInCart}x` : null}
                  </Box>{' '}
                  {item.title}
                </Heading>
              </Box>

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  color="brand.black40"
                  noOfLines={{ base: 3, sm: 1, md: 3 }}
                  whiteSpace="pre-wrap"
                >
                  {parseJSONSafely(item.description)}
                </Text>
              </Box>
            </VStack>

            <HStack
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Price price={lowestPrice()} />

              {item.status !== ItemStatus.disabled && (
                <Box display="flex">
                  <IconButton
                    variant="link"
                    color="brand.green"
                    _focus={{ outline: 'none' }}
                    icon={<HiOutlinePlusCircle size="24px" />}
                    aria-label="Add to Cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd();
                    }}
                  />
                </Box>
              )}
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </>
  );
};
