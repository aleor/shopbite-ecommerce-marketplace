import NextHeader from 'next/head';
import { useMemo } from 'react';

import { Box, Button, Text } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openCart } from '../../features/cart/cart-slice';
import { formatPrice } from '../../libs/formatPrice';
import { getCartTotalPrice, getTotalItems } from '../../libs/getTotal';
import { useIsMobile } from '../../libs/useIsMobile';
import { Collection, Shop, shopInactive } from '../../models';
import { colors } from '../../theme/foundations/colors';
import Collections from '../Catalog/Collections/Collections';
import CollectionsDropdown from '../Catalog/Collections/CollectionsDropdown';
import Header from '../Catalog/Header/CatalogHeader';
import CollectionLinks from '../Catalog/Header/CollectionLinks';
import ShopEmailUnverfied from '../ShopStatus/EmailUnverified';
import ShopInactive from '../ShopStatus/Inactive';
import NoCollections from '../ShopStatus/NoCollections';

const ShopPage = ({
  shop,
  collections,
}: {
  shop: Shop;
  collections: Collection[];
}) => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const bgColor = isMobile ? colors.brand.white : colors.brand.backgroundColor;

  const nonEmptyCollections = useMemo(() => {
    if (!collections) return [];

    return collections
      .filter((collection) => collection.itemList.length)
      .sort((a, b) => a.ordering - b.ordering);
  }, [collections]);

  const renderContent = () => {
    if (shopInactive(shop)) {
      return <ShopInactive />;
    }

    if (!shop.isVerified) {
      return <ShopEmailUnverfied />;
    }

    if (!collections?.length) {
      return <NoCollections />;
    }

    return <Collections collections={nonEmptyCollections} />;
  };

  const renderCartButton = () => {
    return (
      <Box
        boxShadow={'0px -4px 15px rgba(0, 0, 0, 0.04);'}
        bottom="0"
        position="fixed"
        width="100%"
        px="4"
        py="3"
        backgroundColor="white"
      >
        <Button
          size="md"
          width="100%"
          onClick={() => dispatch(openCart())}
          justifyContent="space-between"
        >
          <Text color="white">{`Items in cart: ${getTotalItems(
            cartItems
          )}`}</Text>
          <Text color="white">{formatPrice(getCartTotalPrice(cartItems))}</Text>
        </Button>
      </Box>
    );
  };

  return (
    <>
      <NextHeader>
        <style>{`body { background-color:  ${bgColor} !important; }`}</style>
      </NextHeader>
      <Header shop={shop} />
      <Box
        display={{
          base: 'block',
          sm: 'none',
          md: 'block',
        }}
        backgroundColor="white"
        paddingY="3"
        position={{ base: 'sticky', md: 'sticky' }}
        px={{ base: 20, sm: 0, md: 8, lg: 20 }}
        zIndex="999"
        top="0"
        width="100%"
      >
        <CollectionLinks collections={nonEmptyCollections} />
      </Box>
      <Box
        display={{
          base: 'none',
          sm: 'block',
          md: 'none',
        }}
        position={{ base: 'sticky', md: 'sticky' }}
        zIndex="999"
        top="0"
        width="100%"
      >
        <CollectionsDropdown collections={nonEmptyCollections} />
      </Box>

      {renderContent()}

      {isMobile && cartItems?.length > 0 && renderCartButton()}
    </>
  );
};

export default ShopPage;
