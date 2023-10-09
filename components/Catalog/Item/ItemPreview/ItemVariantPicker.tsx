import { Radio, RadioGroup, Stack, Text, VStack } from '@chakra-ui/react';

import { useAppSelector } from '../../../../app/hooks';
import { formatPrice } from '../../../../libs/formatPrice';
import { ItemVariant } from '../../../../models';

const ItemVariantPicker = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
}: {
  variants: ItemVariant[];
  selectedVariant: ItemVariant | null;
  onSelectVariant: (variant: ItemVariant) => void;
}) => {
  const shop = useAppSelector((state) => state.shop);

  if (!variants.length) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" width="100%">
      <Text fontFamily="poppins" fontSize="12px" fontWeight="medium">
        Select a Variant <sup>*</sup>
      </Text>
      <RadioGroup
        value={selectedVariant?.id}
        onChange={(value) => {
          const variant = variants.find((variant) => variant.id === value);
          if (variant) {
            onSelectVariant(variant);
          }
        }}
      >
        <Stack>
          {variants.map((variant) => (
            <Radio value={variant.id} key={variant.id}>
              <Text
                as="span"
                fontFamily="source"
                fontSize="16px"
                fontWeight="normal"
              >
                {variant.label}

                <Text as="span" color="brand.green" ml="2">
                  ({formatPrice(variant.price, { currency: shop.currency })})
                </Text>
              </Text>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </VStack>
  );
};

export default ItemVariantPicker;
