import { useCallback } from 'react';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';

import { CustomerInfo } from '../../models';

const CustomerInfoForm = ({
  onChange,
  customerInfo,
  errors,
  isDisabled = false,
}: {
  onChange: (customerInfo: CustomerInfo) => void;
  customerInfo: CustomerInfo;
  errors: {
    name: boolean;
    phoneNr: boolean;
    address: boolean;
  };
  isDisabled: boolean;
}) => {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...customerInfo, name: e.target.value });
    },
    [customerInfo, onChange]
  );

  const handlePhoneNrChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (/^\+?[0-9]*$/.test(e.target.value)) {
        onChange({ ...customerInfo, phoneNr: e.target.value });
      }
    },
    [customerInfo, onChange]
  );

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...customerInfo, address: e.target.value });
    },
    [customerInfo, onChange]
  );

  const renderError = useCallback(() => {
    return (
      <FormErrorMessage
        fontFamily="source"
        fontSize="12px"
        fontWeight="normal"
        color="brand.error"
        m="0"
      >
        (Wajib diisi)
      </FormErrorMessage>
    );
  }, []);

  const renderLabel = useCallback((label: string) => {
    return (
      <FormLabel
        fontFamily="poppins"
        fontSize="12px"
        fontWeight="normal"
        variant="inline"
        whiteSpace="nowrap"
        minWidth="75px"
      >
        {label}
        <sup>*</sup>
      </FormLabel>
    );
  }, []);

  return (
    <Stack spacing="2" w="100%">
      <FormControl isInvalid={!!errors.name} isDisabled={isDisabled}>
        <HStack
          spacing="4"
          justifyContent="space-between"
          alignItems="baseline"
        >
          {renderLabel('Nama Anda')}
          <Input
            borderRadius="8px"
            size="sm"
            placeholder="cth. Andi"
            _focus={{ outline: 'none' }}
            value={customerInfo.name}
            onChange={handleNameChange}
          />
        </HStack>
        {!!errors.name && renderError()}
      </FormControl>

      <FormControl isInvalid={!!errors.phoneNr} isDisabled={isDisabled}>
        <HStack
          spacing="4"
          justifyContent="space-between"
          alignItems="baseline"
        >
          {renderLabel('No HP')}
          <Input
            size="sm"
            placeholder="+6281234567890"
            borderRadius="8px"
            type="tel"
            minLength={7}
            _focus={{ outline: 'none' }}
            value={customerInfo.phoneNr}
            onChange={handlePhoneNrChange}
            onFocus={(e) =>
              customerInfo.phoneNr?.trim().length
                ? null
                : handlePhoneNrChange({
                    ...e,
                    target: { ...e.target, value: '+62' },
                  })
            }
          />
        </HStack>
        {!!errors.phoneNr && renderError()}
      </FormControl>

      <FormControl isInvalid={!!errors.address} isDisabled={isDisabled}>
        <HStack
          spacing="4"
          justifyContent="space-between"
          alignItems="baseline"
        >
          {renderLabel('Alamat')}
          <Input
            size="sm"
            placeholder="cth. Jl. Kemerdekaan no 50, Jakarta Barat"
            borderRadius="8px"
            _focus={{ outline: 'none' }}
            value={customerInfo.address}
            onChange={handleAddressChange}
          />
        </HStack>
        {!!errors.address && renderError()}
      </FormControl>
    </Stack>
  );
};

export default CustomerInfoForm;
