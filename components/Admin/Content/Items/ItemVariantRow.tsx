import { useContext } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';

import { HStack, IconButton, Text, VStack } from '@chakra-ui/react';

import { formatPrice } from '../../../../libs/formatPrice';
import { ItemVariant } from '../../../../models';
import { ShopContext } from '../../hooks/shopContext';

const ItemVariantRow = ({
  itemVariant,
  onDelete,
}: {
  itemVariant: ItemVariant;
  onDelete: (id: string) => void;
}) => {
  const shop = useContext(ShopContext);

  return (
    <HStack
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      spacing="4"
    >
      <VStack spacing="0" alignItems="flex-start">
        <Text fontFamily="poppins" fontSize="14px" fontWeight="normal">
          {itemVariant.label}
        </Text>

        <Text fontWeight="semibold" fontSize="14px" color="brand.green">
          {formatPrice(itemVariant.price, { currency: shop.currency })}
        </Text>
      </VStack>

      <IconButton
        icon={<HiOutlineTrash size="16px" />}
        aria-label="Hapus link"
        variant="ghost"
        color="brand.red"
        _focus={{ outline: 'none' }}
        size="sm"
        onClick={() => onDelete(itemVariant.id)}
      />
    </HStack>
  );
};

export default ItemVariantRow;
