import { useEffect, useMemo, useRef, useState } from 'react';
import { HiX } from 'react-icons/hi';

import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { addToCart } from '../../../../features/cart/cart-slice';
import { showModal } from '../../../../features/items/items-slice';
import { formatPrice } from '../../../../libs/formatPrice';
import { getShopItemLink } from '../../../../libs/getLinks';
import { parseJSONSafely } from '../../../../libs/parseJSONSafely';
import {
  getPriceRange,
  getTotalCustomizedItemPrice,
  Item,
  ItemAddOn,
  ItemStatus,
  ItemVariant,
} from '../../../../models';
import ShareButton from '../../../ShareButton/ShareButton';
import Price from '../Price';
import ItemAddonsPicker from './ItemAddonsPicker';
import ItemLinks from './ItemLinks';
import ItemNote from './ItemNote';
import ItemVariantPicker from './ItemVariantPicker';
import { QuantityPicker } from './QuantityPicker';
import { Slider } from './Slider';
import UnavailableItemMessage from './UnavailableItemMessage';

const StickyFooter = ({
  item,
  addOns,
  variant,
}: {
  item: Item;
  addOns: ItemAddOn[];
  variant: ItemVariant | null;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState<string>();
  const dispatch = useAppDispatch();

  const onAdd = ({ note, quantity }: { note: string; quantity: number }) => {
    dispatch(
      addToCart({
        item,
        quantity,
        note,
        variant,
        addOns,
      })
    );
  };

  return (
    <Box
      boxShadow={'0px -4px 15px rgba(0, 0, 0, 0.04)'}
      position="fixed"
      bottom="0px"
      backgroundColor="white"
      width="100%"
      px="4"
      py="2"
    >
      <VStack
        spacing={2}
        align="flex-end"
        justify="space-evenly"
        alignItems="center"
        flex="1"
      >
        <HStack spacing="4" width="100%">
          <Box width="60%">
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
          <Box width="40%">
            <QuantityPicker
              disabled={item.status === ItemStatus.disabled}
              value={quantity}
              onChange={setQuantity}
              buttonSize="sm"
            />
          </Box>
        </HStack>

        <Box width="100%">
          <Button
            width="full"
            size="md"
            disabled={item.status === ItemStatus.disabled}
            onClick={() => {
              onAdd({ note, quantity });
              dispatch(showModal(false));
            }}
          >
            {`${'Tambah ke Keranjang'} - ${formatPrice(
              getTotalCustomizedItemPrice({ item, variant, addOns, quantity })
            )}`}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

const ItemPreviewMobile = ({ item }: { item: Item }) => {
  const dispatch = useAppDispatch();
  const [headerPinned, setHeaderPinned] = useState(false);
  const headerRef = useRef(null);

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(
    item.variants?.[0] || null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<ItemAddOn[]>([]);

  const priceRange = useMemo(() => {
    return getPriceRange(item);
  }, [item]);

  const hasSubscription = useAppSelector((state) => state.shop.hasSubscription);

  useEffect(() => {
    const cachedRef = headerRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setHeaderPinned(e.intersectionRatio < 1),
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    observer.observe(cachedRef);

    return () => observer.unobserve(cachedRef);
  }, []);

  return (
    <Box>
      <Box pb="2">
        <Slider
          images={hasSubscription ? item.imageUrls : [item.imageUrls?.[0]]}
          onClose={() => dispatch(showModal(false))}
        />
      </Box>
      <VStack spacing={2} height="100%" px="4" alignItems="flex-start">
        <Box
          position="sticky"
          top="0"
          backgroundColor="white"
          py="2"
          width="100%"
          ref={headerRef}
        >
          <HStack alignSelf="baseline" spacing={0}>
            <Box display={headerPinned ? 'inherit' : 'none'} pr="4">
              <IconButton
                icon={<HiX size="22px" />}
                variant="ghost"
                color="brand.black"
                aria-label="Close"
                onClick={() => dispatch(showModal(false))}
                _focus={{ outline: 'none' }}
                size="xs"
              />
            </Box>
            <Box pr="6">
              <Heading
                as="h3"
                fontSize="lg"
                fontWeight="medium"
                fontFamily="poppins"
                noOfLines={3}
                lineHeight="22px"
              >
                {item.title}
              </Heading>
            </Box>

            <ShareButton link={getShopItemLink(item.id)} title={item.title} />
          </HStack>
        </Box>

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

        <VStack spacing="6" width="100%" alignItems="flex-start">
          {item.externalLinks?.length > 0 && (
            <ItemLinks links={item.externalLinks} />
          )}
          {item.variants?.length > 0 && (
            <ItemVariantPicker
              variants={item.variants}
              onSelectVariant={setSelectedVariant}
              selectedVariant={selectedVariant}
            />
          )}
          {item.addOns?.length > 0 && (
            <ItemAddonsPicker
              addons={item.addOns}
              onChange={setSelectedAddOns}
            />
          )}
        </VStack>

        {item.status === ItemStatus.disabled && <UnavailableItemMessage />}

        <Box flex="1" overflow="scroll" py="4">
          <Text
            fontWeight="normal"
            color="brand.black"
            fontSize="14px"
            whiteSpace="pre-wrap"
          >
            {parseJSONSafely(item.description)}
          </Text>
        </Box>
      </VStack>
      <StickyFooter
        item={item}
        addOns={selectedAddOns}
        variant={selectedVariant}
      />
    </Box>
  );
};

export default ItemPreviewMobile;
