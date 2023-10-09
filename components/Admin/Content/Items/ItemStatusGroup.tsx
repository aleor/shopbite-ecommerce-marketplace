import { Box, HStack, Radio, RadioGroup, Stack, Text, Tooltip, VStack } from '@chakra-ui/react';

import { ItemStatus } from '../../../../models';

const productStatuses: { label: string; value: string; hint?: string }[] = [
  { label: 'Available', value: ItemStatus.available },
  {
    label: 'Not available',
    hint: '(Will be displayed on the storefront but cannot be purchased by customers)',
    value: ItemStatus.disabled,
  },
  {
    label: 'Hidden',
    hint: '(Not shown in the storefront)',
    value: ItemStatus.hidden,
  },
];

const ItemStatusGroup = ({
  defaultStatus,
  onChange,
  disabledStatuses,
}: {
  defaultStatus?: string;
  onChange: (state) => void;
  disabledStatuses?: string[];
}) => {
  return (
    <VStack alignItems="flex-start">
      <HStack>
        <Text
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        >
          Status
        </Text>
      </HStack>

      <Box maxWidth="fit-content">
        <Text fontFamily="poppins" fontSize="12px" color="brand.black70">
          The status will affect whether this product will be displayed and can be ordered.
        </Text>
      </Box>

      <RadioGroup
        defaultValue={defaultStatus ?? ItemStatus.available}
        name="status"
        pt={{ base: '2', sm: '1', md: '2' }}
        minWidth={{ base: 'unset', sm: 'unset', lg: 'max-content' }}
      >
        <Stack>
          {productStatuses.map((status) => (
            <Radio
              key={status.value}
              value={status.value}
              fontWeight="normal"
              spacing="1rem"
              fontFamily="source"
              pt={{ base: '2', sm: '1', md: '2' }}
              onChange={(e) => onChange(status.value)}
              isDisabled={disabledStatuses?.includes(status.value)}
            >
              <Tooltip
                label={`You have reached the limit on the number of products. Upgrade to the Premium Package to increase the number of products to unlimited.`}
                bg="gray.600"
                color="white"
                hasArrow
                fontWeight="normal"
                borderRadius="8px"
                fontFamily="poppins"
                fontSize="12px"
                p="2"
                textAlign="center"
                maxWidth="250px"
                isDisabled={!disabledStatuses?.includes(status.value)}
              >
                <HStack>
                  <Text fontSize="14px">{status.label}</Text>
                  {status.hint && (
                    <Text
                      fontSize={{ base: '11px', sm: '10px', md: '11px' }}
                      color="brand.black40"
                    >
                      {status.hint}
                    </Text>
                  )}
                </HStack>
              </Tooltip>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </VStack>
  );
};

export default ItemStatusGroup;
