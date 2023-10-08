import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
} from '@chakra-ui/react';

import { ItemVariant } from '../../../../models';
import CharCounter from '../../../CharCounter';
import { adminSettings } from '../../adminSettings';
import ItemPriceField from './ItemPriceField';

const ItemVariantForm = ({
  onSubmit,
  onBack,
  onChange,
  variant,
}: {
  onSubmit: () => void;
  onBack: () => void;
  onChange: (variant: ItemVariant) => void;
  variant?: ItemVariant | null;
}) => {
  return (
    <VStack w="100%" spacing="4">
      <FormControl>
        <FormLabel
          htmlFor="label"
          fontFamily="poppins"
          fontWeight="medium"
          fontSize="12px"
          mb="1"
        >
          Nama Varian
        </FormLabel>

        <InputGroup size="md">
          <Input
            id="label"
            size="md"
            value={variant?.label || ''}
            onChange={(e) => {
              onChange({
                ...variant,
                label: e.target.value,
              });
            }}
            maxLength={adminSettings.item.maxVariantTitleLength}
            noOfLines={1}
            borderRight="none"
            placeholder="cth. Ukuran XL"
            lineHeight="14px"
            resize="none"
            _focus={{ outline: 'none' }}
            _hover={{ borderColor: 'inherit' }}
            spellCheck={false}
            autoComplete="off"
            isInvalid={false}
          />
          <InputRightAddon
            borderRightRadius="8px"
            backgroundColor="white"
            borderLeft="none"
            children={
              <CharCounter
                value={variant?.label || ''}
                maxLength={adminSettings.item.maxVariantTitleLength}
              />
            }
          />
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel
          htmlFor="price"
          fontFamily="poppins"
          fontWeight="medium"
          fontSize="12px"
          mb="1"
        >
          Harga
        </FormLabel>

        <ItemPriceField
          price={variant?.price || 0}
          onChange={(price) => {
            onChange({
              ...variant,
              price,
            });
          }}
        />
      </FormControl>

      <HStack w="100%" spacing="4" justifyContent="flex-end">
        <Button
          variant="link"
          fontFamily="poppins"
          fontWeight="medium"
          fontSize="14px"
          _focus={{ outline: 'none' }}
          color="brand.green"
          onClick={onBack}
        >
          Kembali
        </Button>

        <Button
          fontFamily="poppins"
          fontWeight="medium"
          fontSize="14px"
          _focus={{ outline: 'none' }}
          onClick={onSubmit}
        >
          Simpan
        </Button>
      </HStack>
    </VStack>
  );
};

export default ItemVariantForm;
