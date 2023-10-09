import { useMemo, useState } from 'react';

import { Box, Button, Flex, Heading, HStack, Spacer, Stack, Text, VStack } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { addToCart } from '../../../../features/cart/cart-slice';
import { showModal } from '../../../../features/items/items-slice';
import { formatPrice } from '../../../../libs/formatPrice';
import { getShopItemLink } from '../../../../libs/getLinks';
import { parseJSONSafely } from '../../../../libs/parseJSONSafely';
import {
    getPriceRange, getTotalCustomizedItemPrice, Item, ItemAddOn, ItemStatus, ItemVariant
} from '../../../../models';
import ShareButton from '../../../ShareButton/ShareButton';
import Price from '../Price';
import Gallery from './Gallery';
import ItemAddonsPicker from './ItemAddonsPicker';
import ItemLinks from './ItemLinks';
import ItemNote from './ItemNote';
import ItemVariantPicker from './ItemVariantPicker';
import { QuantityPicker } from './QuantityPicker';
import UnavailableItemMessage from './UnavailableItemMessage';

const ItemPreview = ({ item }: { item: Item }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState<string>();
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(
    item.variants?.length ? item.variants[0] : null
  );
  const [selectedAddons, setSelectedAddons] = useState<ItemAddOn[]>([]);

  const hasAddonsOrVariants = useMemo(
    () => item.addOns?.length || item.variants?.length,
    [item.addOns, item.variants]
  );

  const hasSubscription = useAppSelector((state) => state.shop.hasSubscription);
  const dispatch = useAppDispatch();

  const addItem = () => {
    dispatch(
      addToCart({
        item,
        quantity,
        note,
        variant: selectedVariant,
        addOns: selectedAddons,
      })
    );
  };

  const priceRange = useMemo(() => {
    return getPriceRange(item);
  }, [item]);

  return (
    <>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: '4', lg: '8' }}
        pt={{ base: '4', sm: '0', md: '4', lg: '2' }}
        px={{ base: '2', sm: '2', md: '2' }}
      >
        <Flex justifyContent="center">
          <Gallery
            images={hasSubscription ? item.imageUrls : [item.imageUrls?.[0]]}
          />
        </Flex>

        <Box
          width="100%"
          maxHeight={{ base: '400px', sm: '100%', md: '400px' }}
        >
          <Stack spacing={{ base: '4', md: '4' }} height="100%">
            <Heading
              as="h3"
              fontSize="lg"
              fontWeight="medium"
              fontFamily="poppins"
              lineHeight="22px"
            >
              {item.title}
            </Heading>
            <VStack spacing="1" align="baseline" justify="space-between">
              <HStack spacing="4" alignSelf="baseline">
                <HStack spacing="1">
                  <Price
                    price={priceRange.min}
                    priceProps={{
                      fontSize: '20px',
                      color: 'brand.black',
                      fontFamily: 'poppins',
                    }}
                  />

                  {priceRange.min !== priceRange.max && (
                    <>
                      <Text fontSize="20px"> - </Text>

                      <Price
                        price={priceRange.max}
                        priceProps={{
                          fontSize: '20px',
                          color: 'brand.black',
                          fontFamily: 'poppins',
                        }}
                      />
                    </>
                  )}
                </HStack>
                <Box>
                  <ShareButton
                    link={getShopItemLink(item.id)}
                    title={item.title}
                  />
                </Box>
              </HStack>
            </VStack>

            {item.status === ItemStatus.disabled && <UnavailableItemMessage />}

            <Box flex="1" overflow="auto">
              <VStack
                spacing="4"
                overflow="hidden"
                alignItems="flex-start"
                pl="1"
              >
                {item.externalLinks?.length > 0 && (
                  <ItemLinks links={item.externalLinks} />
                )}

                {hasAddonsOrVariants && (
                  <HStack
                    width="100%"
                    spacing="4"
                    pb="2"
                    alignItems="flex-start"
                  >
                    {' '}
                    {item.variants?.length > 0 && (
                      <Box
                        borderRightColor="brand.gray"
                        borderRightWidth={item.addOns?.length ? '1px' : '0px'}
                        pr="8"
                        width="100%"
                      >
                        <ItemVariantPicker
                          variants={item.variants}
                          onSelectVariant={setSelectedVariant}
                          selectedVariant={selectedVariant}
                        />
                      </Box>
                    )}
                    {item.addOns?.length > 0 && (
                      <ItemAddonsPicker
                        addons={item.addOns}
                        onChange={setSelectedAddons}
                      />
                    )}
                  </HStack>
                )}

                <Text
                  fontWeight="normal"
                  color="brand.black"
                  fontSize="14px"
                  whiteSpace="pre-wrap"
                >
                  {parseJSONSafely(item.description)}
                </Text>
              </VStack>
            </Box>

            <Box>
              <ItemNote
                note={note}
                onChange={(value: string) => {
                  if (value?.length <= 60) {
                    setNote(value);
                  }
                }}
                expanded
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
      <HStack pt="4" display={{ base: 'flex', sm: 'none', md: 'flex' }}>
        <Spacer
          flex={{ base: '0 0 340px', sm: 0, md: '0 0 340px' }}
          ml="7"
        ></Spacer>
        <Stack
          direction={{ base: 'row', sm: 'column', lg: 'row' }}
          spacing={{ base: '4', md: '3', lg: '6' }}
          align="flex-end"
          justify="space-evenly"
          alignItems="center"
          flex="1"
          pr="7"
        >
          <Box flex="0.5" width={{ base: '100%', sm: '40%', lg: '100%' }}>
            <QuantityPicker
              disabled={item.status === ItemStatus.disabled}
              value={quantity}
              onChange={setQuantity}
            />
          </Box>
          <Box flex="1">
            <Button
              width="full"
              size="md"
              disabled={item.status === ItemStatus.disabled}
              onClick={() => {
                addItem();
                dispatch(showModal(false));
              }}
            >
              {`+ Keranjang - ${formatPrice(
                getTotalCustomizedItemPrice({
                  item,
                  variant: selectedVariant,
                  addOns: selectedAddons,
                  quantity,
                })
              )}`}
            </Button>
          </Box>
        </Stack>
      </HStack>
    </>
  );
};

export default ItemPreview;
