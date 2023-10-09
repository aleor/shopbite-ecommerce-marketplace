import { doc } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

import { Box, Heading, HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { formatPrice } from '../../../../../libs/formatPrice';
import { getThumbnailUrl, Item, itemConverter, Shop } from '../../../../../models';
import { ItemAnalyticsResult } from '../../../../../models/analytics';
import ReportTextRow from '../ReportTextRow';

const ItemAnalytics = ({
  item,
  shop,
}: {
  item: ItemAnalyticsResult;
  shop: Shop;
}) => {
  const [itemData] = useDocumentDataOnce<Item>(
    shop &&
      item &&
      doc(db, `shops/${shop.id}/items/${item.itemId}`).withConverter(
        itemConverter
      )
  );

  return (
    <VStack w="100%" spacing="4" alignItems="flex-start">
      <Box
        bg="white"
        height="100px"
        width="100%"
        display="flex-column"
        minWidth="fit-content"
      >
        <HStack alignItems="flex-start" spacing="6" height="full">
          <Box width="100px" height="100px" flexShrink={0}>
            <Image
              borderRadius="15px"
              src={getThumbnailUrl(itemData)}
              alt={item.itemName}
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
            justifyContent="space-between"
            height="100px"
          >
            <Box textOverflow="ellipsis" width="full" textAlign="start">
              <Heading
                as="h3"
                fontSize={{ base: 'lg', sm: '15px', md: 'lg' }}
                fontWeight="semibold"
                noOfLines={2}
              >
                {item.itemName}
              </Heading>
            </Box>

            {itemData?.price && (
              <Box>
                <Text
                  as="span"
                  fontWeight="semibold"
                  fontSize="md"
                  color="brand.green"
                >
                  {formatPrice(itemData.price, shop)}
                </Text>
              </Box>
            )}
          </VStack>
        </HStack>
      </Box>

      <VStack w="100%" spacing="2">
        <ReportTextRow
          label="Added to cart"
          value={item.addToCartCount}
        />
        <ReportTextRow label="Product Details Viewed" value={item.viewCount} />
        <ReportTextRow label="Ordered" value={item.purchasedItemsCount} />
        <ReportTextRow
          label="Product Sales"
          value={formatPrice(item.itemRevenue)}
        />
      </VStack>
    </VStack>
  );
};

export default ItemAnalytics;
