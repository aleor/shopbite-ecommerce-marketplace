import { HiMinus, HiPlus } from 'react-icons/hi';

import {
    Center, Flex, FormControl, FormControlProps, IconButton, IconButtonProps, Text,
    UseControllableStateProps
} from '@chakra-ui/react';

const defaultMin = 1;
const defaultMax = 99;
const defaultValue = 1;

interface QuantityPickerProps extends UseControllableStateProps<number> {
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value?: number;
  disabled?: boolean;
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg';
  rootProps?: FormControlProps;
  removalAllowed?: boolean;
  onRemove?: () => void;
}

export const QuantityPicker = (props: QuantityPickerProps) => {
  const {
    min = defaultMin,
    max = defaultMax,
    onChange,
    value = props.value || defaultValue,
    disabled,
    rootProps,
    buttonSize = 'md',
    removalAllowed = false,
    onRemove,
    ...rest
  } = props;

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value === 1 && removalAllowed) {
      onRemove();
      return;
    }

    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <FormControl {...rootProps}>
      <Flex px="2" py="0.45rem" justifyContent="space-between">
        <QuantityPickerButton
          onClick={handleDecrement}
          icon={<HiMinus />}
          isDisabled={disabled || (value === min && !removalAllowed)}
          aria-label="Decrement"
          size={buttonSize}
        />
        <Center minW="8">
          <Text as="span" userSelect="none">
            {value}
          </Text>
        </Center>
        <QuantityPickerButton
          onClick={handleIncrement}
          icon={<HiPlus />}
          isDisabled={disabled || value === max}
          aria-label="Increment"
          size={buttonSize}
        />
      </Flex>
    </FormControl>
  );
};

const QuantityPickerButton = (props: IconButtonProps) => (
  <IconButton
    size="sm"
    fontSize="lg"
    fontWeight="semibold"
    color="brand.green"
    variant="outline"
    borderColor="brand.green"
    _focus={{ outline: 'none' }}
    {...props}
  />
);
