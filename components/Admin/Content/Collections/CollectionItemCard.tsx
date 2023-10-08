import { useMemo } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Skeleton,
  VStack,
} from '@chakra-ui/react';

import {
  getLowestPrice,
  getThumbnailUrl,
  Item,
  ItemStatus,
} from '../../../../models';
import Price from '../../../Catalog/Item/Price';

const CollectionItemCard = ({
  item,
  isEditable,
  onEdit,
}: {
  item: Item;
  isEditable?: boolean;
  onEdit?: (item: Item) => void;
}) => {
  const lowestPrice = useMemo(() => {
    return getLowestPrice(item);
  }, [item]);

  return (
    <Box
      bg="white"
      height="max-content"
      p={{ base: '4', sm: '0', md: '4' }}
      rounded={{ base: 'lg', sm: 'none', md: 'lg' }}
      shadow={{ md: 'base' }}
      display="flex-column"
      minWidth="fit-content"
      width={{ base: '100%', md: '60%' }}
    >
      <HStack alignItems="flex-start" spacing="4" height="full">
        <Box
          width="100px"
          height="100px"
          flexShrink={0}
          filter={
            item.status === ItemStatus.disabled ? 'grayscale(100%)' : 'none'
          }
        >
          <Image
            borderRadius="15px"
            src={getThumbnailUrl(item)}
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
          alignItems="flex-start"
          justifyContent={{
            base: 'space-between',
            sm: 'space-evenly',
            md: 'space-between',
          }}
          height="100px"
          width="100%"
        >
          <Box textOverflow="ellipsis" width="full" textAlign="start">
            <Heading
              as="h3"
              fontSize={{ base: 'lg', sm: '15px', md: 'lg' }}
              fontWeight="semibold"
              noOfLines={2}
              wordBreak="break-all"
              color={
                item.status === ItemStatus.disabled ? 'gray.500' : 'brand.black'
              }
            >
              {item.title}
            </Heading>
          </Box>

          <HStack width="100%" justifyContent="space-between">
            <Box
              filter={
                item.status === ItemStatus.disabled ? 'grayscale(100%)' : 'none'
              }
            >
              <Price price={lowestPrice} />
            </Box>
            {isEditable && (
              <IconButton
                icon={<HiOutlinePencil size="20px" />}
                onClick={() => {
                  onEdit?.(item);
                }}
                aria-label="Edit item"
                variant="ghost"
                color="brand.green"
                _focus={{ outline: 'none' }}
                size="sm"
              />
            )}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CollectionItemCard;
