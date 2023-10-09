import { useState } from 'react';

import { Checkbox, Text, VStack } from '@chakra-ui/react';

import { useAppSelector } from '../../../../app/hooks';
import { formatPrice } from '../../../../libs/formatPrice';
import { ItemAddOn } from '../../../../models';

const ItemAddonsPicker = ({
  addons = [],
  onChange,
}: {
  addons: ItemAddOn[];
  onChange: (addOns: ItemAddOn[]) => void;
}) => {
  const shop = useAppSelector((state) => state.shop);
  const [selectedAddons, setSelectedAddons] = useState<ItemAddOn[]>([]);

  const onAddonSelected = (id: string, checked: boolean) => {
    const updatedAddons = checked
      ? [...selectedAddons, addons.find((addon) => addon.id === id)]
      : selectedAddons.filter((addon) => addon.id !== id);

    setSelectedAddons(updatedAddons);
    onChange(updatedAddons);
  };

  if (!addons.length) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" w="100%">
      <Text fontFamily="poppins" fontSize="12px" fontWeight="medium">
        Select Add-on
      </Text>

      <VStack alignItems="flex-start">
        {addons.map((addon) => (
          <Checkbox
            isChecked={selectedAddons.map((a) => a.id).includes(addon.id)}
            key={addon.id}
            onChange={(e) => onAddonSelected(addon.id, e.target.checked)}
          >
            <Text
              as="span"
              fontFamily="source"
              fontSize="16px"
              fontWeight="normal"
            >
              {addon.label}
              <Text as="span" color="brand.green" ml="2">
                + {formatPrice(addon.price, { currency: shop.currency })}
              </Text>
            </Text>
          </Checkbox>
        ))}
      </VStack>
    </VStack>
  );
};

export default ItemAddonsPicker;
