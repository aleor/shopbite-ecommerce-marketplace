import { useMemo } from 'react';

import { Box, Text, VStack } from '@chakra-ui/react';

import { Collection } from '../../../../models';
import { CheckboxFilterPopover } from './CheckboxFilter/CheckboxFilterPopover';

const CollectionsSelector = ({
  collections,
  preselectedCollections,
  onChange,
}: {
  collections: Collection[];
  preselectedCollections?: string[];
  onChange: (collectionsIds: string[]) => void;
}) => {
  const collectionsFilterData = useMemo(
    () =>
      collections.map((collection) => ({
        label: collection.label,
        value: collection.id,
        count: collection.itemList.length,
      })),
    [collections]
  );

  return (
    <VStack alignItems="flex-start" width="100%">
      <Text
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize={{ base: '16px', sm: '14px', md: '16px' }}
      >
        Collection
      </Text>

      <Box maxWidth="fit-content">
        <Text fontFamily="poppins" fontSize="12px" color="brand.black70">
          You can put a product into multiple collections. By
          default all products in your shop will be displayed in the
          "All Products" collection.
        </Text>
      </Box>

      <Box width="100%" pt="2">
        <CheckboxFilterPopover
          data={collectionsFilterData}
          preselectedValues={preselectedCollections}
          onChange={onChange}
        />
      </Box>
    </VStack>
  );
};

export default CollectionsSelector;
