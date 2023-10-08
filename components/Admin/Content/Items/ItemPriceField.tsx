import { useCallback } from 'react';

import { NumberInput, NumberInputField } from '@chakra-ui/react';

import { adminSettings } from '../../adminSettings';

const ItemPriceField = ({
  price,
  placeholder,
  onChange,
}: {
  price: number | null;
  placeholder?: string | null;
  onChange: (value: number | null) => void;
}) => {
  const formatPrice = useCallback(
    (value: number | null) => {
      if (!value) {
        return '';
      }

      const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
      });
      return formatter.format(value);
    },
    [price]
  );

  const onPriceChanged = (value: number | null) => {
    if (isNaN(value)) {
      onChange(null);
      return;
    }

    if (value > adminSettings.item.maxPrice) {
      return;
    }

    onChange(value);
  };

  return (
    <NumberInput
      min={0}
      max={adminSettings.item.maxPrice}
      id="price"
      onChange={(_, valueAsNumber) => onPriceChanged(valueAsNumber)}
      value={price || 0}
      format={formatPrice}
    >
      <NumberInputField placeholder={placeholder} />
    </NumberInput>
  );
};

export default ItemPriceField;
