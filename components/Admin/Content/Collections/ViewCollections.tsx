import { useMemo, useState } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

import {
    Box, Button, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement,
    Text, useBreakpointValue, VStack
} from '@chakra-ui/react';

import { Collection } from '../../../../models';
import { SearchIcon } from '../../../Icons/SearchIcon';
import CollectionCard from './CollectionCard';
import CollectionsHeader from './CollectionsHeader';

const ViewCollections = ({
  collections = [],
  onCreateCollection,
  onManageCollections,
  onViewCollection,
}: {
  collections: Collection[];
  onCreateCollection: () => void;
  onManageCollections: () => void;
  onViewCollection: (collection: Collection) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const filteredCollections = useMemo(() => {
    if (!searchTerm) {
      return collections;
    }

    return [...collections].filter((collection) => {
      return collection.label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  if (!collections.length) {
    return (
      <VStack spacing="8" pt="20">
        <Icon as={SearchIcon} width="42px" height="54px" />
        <Text
          fontSize="14px"
          fontWeight="normal"
          fontFamily="poppins"
          color="brand.black70"
        >
          Kamu belum memiliki koleksi produk.
        </Text>
        <Button
          fontFamily="poppins"
          minWidth="280px"
          onClick={onCreateCollection}
        >
          Buat koleksi pertamaku
        </Button>
      </VStack>
    );
  }

  return (
    <Box>
      {isMobile && (
        <Button
          color="brand.green"
          textColor="white"
          onClick={onCreateCollection}
          size="md"
          width="100%"
          fontFamily="poppins"
          fontSize="14px"
          mb="4"
          display={{ base: 'none', sm: 'flex', md: 'none' }}
        >
          Tambah koleksi baru
        </Button>
      )}
      <CollectionsHeader
        mode={'view'}
        collectionsCount={filteredCollections.length}
        onManage={onManageCollections}
        onAddNewCollection={onCreateCollection}
      />
      <HStack pt="2" width="100%">
        <InputGroup w={{ base: '100%', md: '220px', lg: '450px' }} h="8">
          <InputLeftElement pointerEvents="none" h="10">
            <Icon as={HiSearch} color="brand.gray" boxSize="5" />
          </InputLeftElement>
          <Input
            placeholder="Cari koleksi disini"
            fontSize="xs"
            lineHeight="12px"
            h="10"
            spellCheck="false"
            id="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <InputRightElement h="10">
            <IconButton
              aria-label="Close"
              color="brand.gray"
              icon={<HiX />}
              variant="link"
              _focus={{ outline: 'none' }}
              visibility={searchTerm ? 'visible' : 'hidden'}
              onClick={() => {
                setSearchTerm('');
              }}
            ></IconButton>
          </InputRightElement>
        </InputGroup>
      </HStack>
      <VStack py="6" width="100%" spacing="4">
        {filteredCollections.map((collection) => (
          <Box
            key={collection.id}
            width="100%"
            cursor="pointer"
            onClick={() => {
              onViewCollection(collection);
            }}
          >
            <CollectionCard collection={collection} editMode={false} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ViewCollections;
