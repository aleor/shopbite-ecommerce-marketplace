import { FormControl, FormLabel, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';

import CharCounter from '../../../CharCounter';
import { adminSettings } from '../../adminSettings';

const ItemTitle = ({
  title,
  onChange,
}: {
  title: string;
  onChange: (value: string) => void;
}) => {
  return (
    <FormControl>
      <FormLabel
        htmlFor="label"
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize={{ base: '16px', sm: '14px', md: '16px' }}
      >
        Nama Produk<sup>*</sup>
      </FormLabel>
      <InputGroup size="md">
        <Input
          id="label"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          maxLength={adminSettings.item.maxTitleLength}
          noOfLines={2}
          lineHeight="14px"
          resize="none"
          borderRight="none"
          _focus={{ outline: 'none' }}
          _hover={{ borderColor: 'inherit' }}
        />
        <InputRightAddon
          borderRightRadius="8px"
          backgroundColor="white"
          borderLeft="none"
          children={
            <CharCounter
              value={title}
              maxLength={adminSettings.item.maxTitleLength}
            />
          }
        />
      </InputGroup>
    </FormControl>
  );
};

export default ItemTitle;
