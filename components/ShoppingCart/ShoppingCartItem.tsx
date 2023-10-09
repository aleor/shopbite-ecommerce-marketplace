import { HiOutlineTrash } from 'react-icons/hi';

import { Box, Flex, HStack, IconButton, Image, Link, Stack, Text } from '@chakra-ui/react';

import { useAppDispatch } from '../../app/hooks';
import { updateCartItemNote, updateCartItemQuantity } from '../../features/cart/cart-slice';
import { selectAndShowDetails } from '../../features/items/items-slice';
import { CartItem, getThumbnailUrl, getTotalCustomizedItemPrice, Item } from '../../models';
import { QuantityPicker } from '../Catalog/Item/ItemPreview/QuantityPicker';
import Price from '../Catalog/Item/Price';
import CartItemNote from './CartItemNote';

const ShoppingCartItem = ({
  cartItem,
  onRemove,
  disabled,
}: {
  cartItem: CartItem;
  onRemove: (item: Item) => void;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { item, quantity, note, variant, addOns } = cartItem;

  const openItemDetails = () => {
    dispatch(selectAndShowDetails(item));
  };

  return (
    <>
      <Stack direction="row" spacing="5">
        <Image
          rounded="md"
          width="100px"
          height="100px"
          fit="cover"
          src={getThumbnailUrl(item)}
          alt={item.title}
          draggable="false"
          loading="lazy"
          borderRadius="8px"
          cursor="pointer"
          onClick={openItemDetails}
          flexShrink={0}
        />

        <Stack width="full" spacing="3">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing="3"
            alignItems="flex-start"
          >
            <Stack spacing="1" width="100%">
              <Link onClick={openItemDetails}>
                <Text
                  fontWeight="normal"
                  fontFamily="source"
                  fontSize="16px"
                  noOfLines={1}
                >
                  {item.title}
                </Text>
              </Link>
              <Price
                price={getTotalCustomizedItemPrice(cartItem)}
                priceProps={{
                  color: 'brand.black',
                  fontSize: '14px',
                  fontWeight: 'medium',
                  fontFamily: 'poppins',
                }}
              />

              {variant && (
                <HStack fontFamily="source" fontSize="12px" spacing="4px" fontWeight="normal">
                  <Text color="brand.black40">Variant: </Text>
                  <Text>{variant.label}</Text>
                </HStack>
              )}

              {addOns?.length > 0 && (
                <HStack fontFamily="source" fontSize="12px" spacing="4px" fontWeight="normal">
                  <Text color="brand.black40" flexShrink={0}>
                    Add-ons:{' '}
                  </Text>
                  <Text>{addOns.map((a) => a.label).join(' + ')}</Text>
                </HStack>
              )}

              <Box pt="1">
                <CartItemNote
                  note={note}
                  disabled={disabled}
                  onChange={(updatedNote: string) => {
                    if (updatedNote?.length <= 60) {
                      dispatch(
                        updateCartItemNote({
                          item,
                          quantity,
                          note: updatedNote,
                          variant,
                          addOns,
                        })
                      );
                    }
                  }}
                />
              </Box>
            </Stack>
          </Stack>
          <Flex width="full" justifyContent="space-between" alignItems="center">
            <Box width="50%">
              <QuantityPicker
                value={quantity}
                buttonSize="xs"
                removalAllowed={!!quantity}
                onRemove={() => onRemove(item)}
                disabled={disabled}
                onChange={(updatedQuantity) => {
                  dispatch(
                    updateCartItemQuantity({
                      item,
                      quantity: updatedQuantity,
                      note,
                      variant,
                      addOns,
                    })
                  );
                }}
              />
            </Box>

            <IconButton
              icon={<HiOutlineTrash size="18px" />}
              aria-label="Remove item"
              variant="ghost"
              color="brand.green"
              disabled={disabled}
              _focus={{ outline: 'none' }}
              onClick={() => onRemove(item)}
            />
          </Flex>
        </Stack>
      </Stack>
    </>
  );
};

export default ShoppingCartItem;
