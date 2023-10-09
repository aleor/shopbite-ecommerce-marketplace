import { useEffect, useState } from 'react';

import {
    Box, Button, Checkbox, CheckboxGroup, Drawer, DrawerContent, DrawerOverlay, HStack, Input,
    NumberInput, NumberInputField, Radio, RadioGroup, Stack, Text, VStack
} from '@chakra-ui/react';

import { FilterOptions, ItemStatus } from '../../../../models';

type SortingOptions = {
  label: string;
  value: FilterOptions['sortBy'];
};

const sortingOptions: SortingOptions[] = [
  { label: 'Name (A -> Z)', value: 'nameAsc' },
  { label: 'Name (Z -> A)', value: 'nameDesc' },
  { label: 'Price: low to high', value: 'priceAsc' },
  { label: 'Price: high to low', value: 'priceDesc' },
];

const statusFilteringOptions: { label: string; value: ItemStatus }[] = [
  { label: 'Available', value: ItemStatus.available },
  { label: 'Not available', value: ItemStatus.disabled },
  { label: 'Hidden', value: ItemStatus.hidden },
];

const formatPrice = (value: number) => {
  if (value === 0) {
    return '';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

const ItemsFilter = ({
  isOpen,
  onClose,
  onApply,
  filterOptions,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filterOptions: FilterOptions) => void;
  filterOptions: FilterOptions;
}) => {
  const [minPrice, setMinPrice] = useState(
    filterOptions.filterBy?.minPrice || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    filterOptions.filterBy?.maxPrice || 0
  );
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>(
    filterOptions.sortBy || 'nameAsc'
  );
  const [statuses, setStatuses] = useState<ItemStatus[]>(
    filterOptions.filterBy?.status || []
  );

  useEffect(() => {
    if (!filterOptions) return;

    setMinPrice(filterOptions.filterBy?.minPrice || 0);
    setMaxPrice(filterOptions.filterBy?.maxPrice || 0);
    setSortBy(filterOptions.sortBy || 'nameAsc');
    setStatuses(filterOptions.filterBy?.status || []);
  }, [filterOptions]);

  return (
    <Box height="100vh" display={isOpen ? 'inherit' : 'none'}>
      <Drawer
        isOpen={isOpen}
        onClose={() => void 0}
        size="xs"
        allowPinchZoom
        onOverlayClick={onClose}
      >
        <DrawerOverlay />

        <DrawerContent bg="white" overflowY="auto">
          <VStack
            paddingX={{ base: '6', sm: '6' }}
            paddingY="4"
            height="full"
            spacing="8"
            overflowY="auto"
            alignItems="flex-start"
          >
            <VStack alignItems="flex-start" spacing="4">
              <Text fontSize="16px" fontFamily="poppins" fontWeight="medium">
                Sort by:
              </Text>

              <RadioGroup
                value={sortBy}
                size="md"
                onChange={(value: FilterOptions['sortBy']) => setSortBy(value)}
              >
                <Stack spacing={3} direction="column">
                  {sortingOptions.map((option) => (
                    <Radio value={option.value} key={option.label}>
                      <Text
                        fontFamily="source"
                        fontSize="14px"
                        fontWeight="normal"
                      >
                        {option.label}
                      </Text>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </VStack>
            <VStack alignItems="flex-start" spacing="4">
              <Text fontSize="16px" fontFamily="poppins" fontWeight="medium">
                Filter by:
              </Text>

              <Stack spacing="3">
                <Text fontFamily="poppins" fontSize="12px" fontWeight="medium">
                  Product price range
                </Text>

                <HStack spacing="2">
                  <NumberInput
                    min={minPrice}
                    max={maxPrice}
                    id="min-price"
                    size="sm"
                    onChange={(_, valueAsNumber) =>
                      setMinPrice(isNaN(valueAsNumber) ? 0 : valueAsNumber)
                    }
                    value={minPrice}
                    format={formatPrice}
                  >
                    <NumberInputField borderRadius="8px" />
                  </NumberInput>

                  <Text
                    fontFamily="poppins"
                    fontSize="12px"
                    fontWeight="normal"
                  >
                    -
                  </Text>

                  <NumberInput
                    min={minPrice}
                    max={maxPrice}
                    value={maxPrice}
                    id="max-price"
                    size="sm"
                    onChange={(_, valueAsNumber) =>
                      setMaxPrice(isNaN(valueAsNumber) ? 0 : valueAsNumber)
                    }
                    format={formatPrice}
                  >
                    <NumberInputField borderRadius="8px" />
                  </NumberInput>
                </HStack>
              </Stack>

              <Stack spacing="3" pt="3">
                <Text fontFamily="poppins" fontSize="12px" fontWeight="medium">
                  Product status
                </Text>
                <CheckboxGroup
                  value={statuses}
                  onChange={(value: ItemStatus[]) => {
                    setStatuses(value);
                  }}
                >
                  {statusFilteringOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      value={option.value}
                      colorScheme="blue"
                    >
                      <Text
                        fontFamily="source"
                        fontSize="14px"
                        fontWeight="normal"
                      >
                        {option.label}
                      </Text>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </Stack>
            </VStack>
          </VStack>
          <Box
            boxShadow={'0px -4px 15px rgba(0, 0, 0, 0.04);'}
            px={{ base: '6', sm: '6', md: '6' }}
            py="4"
            width="100%"
          >
            <Button
              size="md"
              fontSize="md"
              width="100%"
              onClick={() => {
                onApply({
                  sortBy,
                  filterBy: {
                    minPrice,
                    maxPrice,
                    status: statuses,
                  },
                });
              }}
            >
              Add
            </Button>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ItemsFilter;
