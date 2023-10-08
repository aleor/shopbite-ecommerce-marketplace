import { useCallback } from 'react';

import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';

import { OrderItem } from '../../models/orderItem';
import Price from '../Catalog/Item/Price';
import ItemCount from './ItemCount';

const PurchasedItem = ({ item }: { item: OrderItem }) => {
  const renderNote = useCallback(() => {
    return (
      <Box visibility={item.note ? 'visible' : 'hidden'}>
        <Text
          fontSize="xs"
          fontWeight="normal"
          color="brand.green"
          noOfLines={{ base: 2, sm: 1, md: 2 }}
        >
          Notes: {item.note}
        </Text>
      </Box>
    );
  }, [item]);

  return (
    <>
      <Box
        bg="white"
        height={{ base: '170px', sm: 'max-content', md: '170px' }}
        px={{ base: '4', sm: '0', md: '4' }}
        py={{ base: '4', sm: '2', md: '4' }}
        rounded={{ base: 'lg', sm: 'none', md: 'lg' }}
        shadow={{ md: 'base' }}
        display="flex-column"
        minWidth="fit-content"
      >
        <HStack alignItems="flex-start" spacing="4" height="full">
          <Box width="100px" height="100px" flexShrink={0}>
            <Image
              borderRadius="15px"
              src={item.imageUrl || '/images/no_photo_small.png'}
              alt={item.title}
              fallback={
                <Skeleton width="100px" height="100px" borderRadius="15px" />
              }
              width="100px"
              height="100px"
              objectFit="cover"
            />
          </Box>

          <VStack
            flex={1}
            alignItems="flex-start"
            justifyContent={{
              base: 'space-between',
              sm: 'flex-start',
              md: 'space-between',
            }}
            height={{ base: '100%', sm: '100px', md: '100%' }}
          >
            <HStack width="100%" justifyContent="space-between">
              <Flex flex={1}>
                <VStack
                  flex={{ base: '1', sm: '0', md: '1' }}
                  alignItems="flex-start"
                  width="100%"
                  minWidth="fit-content"
                >
                  <Box width="full" textAlign="start" w="100%">
                    <Heading
                      as="h3"
                      fontSize={{ base: 'lg', sm: '15px', md: 'lg' }}
                      fontWeight="semibold"
                      noOfLines={{ base: 2, sm: 1, md: 2 }}
                    >
                      {item.title}
                    </Heading>
                  </Box>

                  {item.variant && (
                    <HStack
                      fontFamily="source"
                      fontSize="12px"
                      spacing="4px" 
                      fontWeight="normal"
                    >
                      <Text color="brand.black40">Varian: </Text>
                      <Text>{item.variant}</Text>
                    </HStack>
                  )}

                  {item.addOns && (
                    <HStack
                      fontFamily="source"
                      fontSize="12px"
                      spacing="4px" 
                      fontWeight="normal"
                    >
                      <Text color="brand.black40" flexShrink={0}>
                        Tambahan:{' '}
                      </Text>
                      <Text>{item.addOns}</Text>
                    </HStack>
                  )}

                  <Box display={{ base: 'none', sm: 'flex', md: 'none' }}>
                    <Price
                      price={item.price}
                      priceProps={{
                        color: 'brand.black',
                        fontSize: '12px',
                        fontWeight: 'medium',
                      }}
                    />
                  </Box>

                  <Box display={{ base: 'none', sm: 'none', md: 'flex' }}>
                    {renderNote()}
                  </Box>
                </VStack>
              </Flex>
              <Box display={{ base: 'none', sm: 'flex', md: 'none' }}>
                <ItemCount count={item.quantity} />
              </Box>
            </HStack>

            <Box display={{ base: 'none', sm: 'flex', md: 'none' }}>
              {renderNote()}
            </Box>

            <Box
              display={{ base: 'none', sm: 'none', md: 'flex' }}
              width="100%"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Price price={item.price} />
                <ItemCount count={item.quantity} />
              </HStack>
            </Box>
          </VStack>
        </HStack>
      </Box>
    </>
  );
};

export default PurchasedItem;
