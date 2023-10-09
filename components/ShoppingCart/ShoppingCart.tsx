import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useHttpsCallable } from 'react-firebase-hooks/functions';
import { HiArrowLeft, HiOutlineExclamationCircle } from 'react-icons/hi';

import {
    Box, Button, Drawer, DrawerContent, DrawerOverlay, HStack, Icon, IconButton, Link, Stack, Text,
    useDisclosure, VStack
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeCart, removeFromCart } from '../../features/cart/cart-slice';
import { getAppFunctions } from '../../firebase/functions';
import { logBeginCheckout, logPurchase } from '../../libs/analytics/logEvents';
import { convertToOrder } from '../../libs/converters';
import { formatPrice } from '../../libs/formatPrice';
import { getOrderLink } from '../../libs/getLinks';
import { getCartTotalPrice, getTotalItems } from '../../libs/getTotal';
import { notifyShopOwner } from '../../libs/notifyShopOwner';
import { CartItem, CustomerInfo, Order } from '../../models';
import CopyLinkButton from '../CopyLinkButton';
import ShareButton from '../ShareButton/ShareButton';
import { creatingOrderHtml } from './creatingOrderHtml';
import DeleteItemModal from './DeleteItemModal';
import ShoppingCartItem from './ShoppingCartItem';

const ShoppingCart = () => {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const shop = useAppSelector((state) => state.shop);

  const [activeItem, setActiveItem] = useState<CartItem | null>(null);
  const [orderLink, setLink] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phoneNr: '',
    address: '',
  });
  const [customerInfoErrors, setCustomerInfoErrors] = useState<{
    name: boolean;
    phoneNr: boolean;
    address: boolean;
  }>({ name: false, phoneNr: false, address: false });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [executeCallable, executing, error] = useHttpsCallable<
    Order,
    { orderId: string }
  >(getAppFunctions(), 'createOrder');

  useEffect(() => {
    if (cartItems.length === 0) {
      dispatch(closeCart());
    }
  }, [cartItems]);

  useEffect(() => {
    if (!isCartOpen || !window) {
      return;
    }

    const onBack = (e) => {
      e.preventDefault();

      if (isCartOpen) {
        dispatch(dispatch(closeCart()));
        return false;
      }

      return true;
    };

    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate', onBack);

    return () => {
      if (window.history.state === null) {
        window.history.back();
      }
      window.removeEventListener('popstate', onBack);
    };
  }, [isCartOpen]);

  const canPlaceOrder = (): boolean => {
    return true; // temporary until order list dashboard developed
    const errors = {
      name: !customerInfo?.name?.length,
      phoneNr: customerInfo?.phoneNr?.length < 8,
      address: !customerInfo?.address?.length,
    };

    setCustomerInfoErrors(errors);

    return !Object.values(errors).some((error) => error);
  };

  const placeOrder = async (chatWindow: Window) => {
    const order: Order = convertToOrder(cartItems, shop, customerInfo);

    logBeginCheckout(order);

    const result = await executeCallable(order);

    if (result?.data) {
      const { orderId } = result.data;
      const orderLink = getOrderLink(orderId);
      setLink(orderLink);
      logPurchase(order, orderId);
      notifyShopOwner(shop, orderLink, chatWindow);
    }
  };

  const orderCreationResult = () => {
    if (!error && !orderLink) {
      return null;
    }

    if (error) {
      return (
        <HStack fontFamily="poppins" fontSize="14px">
          <Icon
            as={HiOutlineExclamationCircle}
            color="brand.error"
            w="20px"
            h="20px"
          />
          <Text color="brand.error">
            An error occurred, please try again.
          </Text>
        </HStack>
      );
    }

    return (
      <HStack>
        <VStack
          fontFamily="poppins"
          fontSize="12px"
          fontWeight="normal"
          alignItems="flex-start"
          lineHeight="14px"
        >
          <Text>Link to order details:</Text>

          <NextLink href={orderLink}>
            <Link noOfLines={1} wordBreak="break-all">
              {orderLink}
            </Link>
          </NextLink>
        </VStack>

        <CopyLinkButton link={orderLink} />
        <ShareButton link={orderLink} title={'My order'} />
      </HStack>
    );
  };

  return (
    <>
      <Box height="100vh" display={isCartOpen ? 'inherit' : 'none'}>
        <Drawer
          isOpen={isCartOpen}
          onClose={() => void 0}
          size="sm"
          allowPinchZoom
          onOverlayClick={() => dispatch(closeCart())}
        >
          <DrawerOverlay />

          <DrawerContent bg="white" overflowY="auto">
            <HStack spacing="2" pl="4" pt="1">
              <IconButton
                icon={<HiArrowLeft />}
                onClick={() => dispatch(closeCart())}
                aria-label="Close"
                variant="ghost"
                _focus={{ outline: 'none' }}
                size="md"
              />

              <Text fontSize="16px" fontFamily="poppins" fontWeight="semibold">
                My Cart
              </Text>
            </HStack>

            <Stack
              paddingX={{ base: '6', sm: '6' }}
              paddingY="2"
              height="full"
              spacing="6"
              overflowY="auto"
            >
              {cartItems.map((cartItem) => (
                <ShoppingCartItem
                  key={`${cartItem.item.id}-${
                    cartItem.variant?.id || 0
                  }-${cartItem.addOns?.map((a) => a.label).join('+')}-${
                    cartItem.note
                  }`}
                  cartItem={cartItem}
                  onRemove={() => {
                    setActiveItem(cartItem);
                    onOpen();
                  }}
                  disabled={executing}
                />
              ))}
            </Stack>
            <Stack
              boxShadow={'0px -4px 15px rgba(0, 0, 0, 0.04);'}
              px={{ base: '6', sm: '6', md: '6' }}
              py="4"
              spacing="5"
            >
              {/* temporary until order list dashboard developed
              <CustomerInfoForm
                onChange={(c) => {
                  setCustomerInfoErrors({
                    name: false,
                    phoneNr: false,
                    address: false,
                  });
                  setCustomerInfo(c);
                }}
                isDisabled={executing || !!orderLink}
                errors={customerInfoErrors}
                customerInfo={customerInfo}
              /> */}

              {orderCreationResult()}

              <HStack fontSize="md" fontWeight="normal">
                <Text flex="1" color="brand.black">
                  Total {getTotalItems(cartItems)}
                  {' item(s)'}
                </Text>
                <Text
                  color="brand.black"
                  fontWeight="semibold"
                  fontFamily="poppins"
                  fontSize="16px"
                >
                  {formatPrice(getCartTotalPrice(cartItems))}
                </Text>
              </HStack>

              <Button
                size="md"
                fontSize="md"
                onClick={() => {
                  if (!canPlaceOrder()) {
                    return;
                  }

                  const chatWindow = window.open('', '_blank');
                  chatWindow.document.write(creatingOrderHtml);
                  placeOrder(chatWindow);
                }}
                isDisabled={executing || !!orderLink}
                isLoading={executing}
                loadingText="Creating order..."
              >
                {orderLink ? 'Order successfully created' : 'Create an order'}
              </Button>
            </Stack>
          </DrawerContent>
        </Drawer>
      </Box>

      <DeleteItemModal
        isOpen={isOpen}
        onClose={onClose}
        onDelete={() => {
          dispatch(removeFromCart(activeItem));
          onClose();
        }}
      />
    </>
  );
};

export default ShoppingCart;
