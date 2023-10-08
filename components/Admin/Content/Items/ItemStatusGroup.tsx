import {
  Box,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import { ItemStatus } from '../../../../models';

const productStatuses: { label: string; value: string; hint?: string }[] = [
  { label: 'Tersedia', value: ItemStatus.available },
  {
    label: 'Tidak tersedia',
    hint: '(Akan ditampilkan di etalase tetapi tidak dapat dibeli pelanggan)',
    value: ItemStatus.disabled,
  },
  {
    label: 'Tersembunyi',
    hint: '(Tidak ditampilkan di etalase)',
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
          Status akan mempengaruhi apakah produk ini akan ditampilkan dan dapat dipesan.
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
                label={`Anda telah mencapai batas limit jumlah produk. Upgrade dengan Paket Premium untuk menambah jumlah produk hingga tidak terbatas`}
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
