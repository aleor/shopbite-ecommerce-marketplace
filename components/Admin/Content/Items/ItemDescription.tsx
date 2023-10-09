import { Box, FormControl, FormLabel, HStack, Text, Textarea } from '@chakra-ui/react';

import CharCounter from '../../../CharCounter';
import { adminSettings } from '../../adminSettings';

const ItemDescription = ({
  description,
  onChange,
}: {
  description: string;
  onChange: (value: string) => void;
}) => {
  return (
    <FormControl maxWidth="100%" pt="4">
      <FormLabel
        htmlFor="label"
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize={{ base: '16px', sm: '14px', md: '16px' }}
      >
        <HStack>
          <Text>Description</Text>
          <Text fontFamily="source" fontWeight="normal" color="brand.black40">
            (Optional)
          </Text>
        </HStack>
      </FormLabel>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        maxLength={adminSettings.item.maxDescriptionLength}
        lineHeight="14px"
      />
      <Box pt="1">
        <CharCounter
          value={description}
          maxLength={adminSettings.item.maxDescriptionLength}
          textProps={{ textAlign: 'right' }}
        />
      </Box>
    </FormControl>
  );
};

export default ItemDescription;
