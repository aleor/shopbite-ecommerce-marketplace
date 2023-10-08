import { useState } from 'react';
import { HiMinusCircle } from 'react-icons/hi';

import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import { Collection, getThumbnailUrl } from '../../../../models';
import CharCounter from '../../../CharCounter';
import { adminSettings } from '../../adminSettings';

const CollectionCard = ({
  collection,
  editMode,
  onChange,
  onDelete,
}: {
  collection: Collection;
  editMode: boolean;
  onChange?: ({
    collectionId,
    label,
  }: {
    collectionId: string;
    label: string;
  }) => void;
  onDelete?: () => void;
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [collectionLabel, setCollectionLabel] = useState(collection.label);

  const onChangeLabel = (label: string) => {
    setCollectionLabel(label);
    onChange?.({ collectionId: collection.id, label });
  };

  return (
    <>
      <Box
        boxShadow="md"
        borderRadius="lg"
        borderColor="brand.lightBlue"
        px={{ base: '4', md: '4' }}
        py="2"
        width="100%"
        overflowX="hidden"
      >
        <VStack
          alignItems="flex-start"
          spacing={collection.itemList.length > 0 ? '4' : '0'}
          w="100%"
        >
          <HStack overflowX="auto" spacing="4" w="100%">
            {collection.itemList
              .sort((a, b) => a.ordering - b.ordering)
              .map((item, index) => (
                <Box
                  key={index}
                  position="relative"
                  cursor="pointer"
                  display="flex"
                  flexShrink={0}
                >
                  <Box
                    bgImg={`linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.5) 100%), url(${getThumbnailUrl(
                      item
                    )})`}
                    bgRepeat="no-repeat"
                    bgPosition="center center"
                    width="100px"
                    height="100px"
                    bgSize="cover"
                    borderRadius="5px"
                  />

                  <Text
                    fontSize="12px"
                    fontFamily="source"
                    fontWeight="semibold"
                    position="absolute"
                    bottom="6px"
                    left="6px"
                    right="6px"
                    lineHeight="14px"
                    color="white"
                    noOfLines={2}
                  >
                    {item.title}
                  </Text>
                </Box>
              ))}
          </HStack>
          <HStack
            w="100%"
            justifyContent="space-between"
            py={collection.itemList?.length > 0 ? '0' : '3'}
          >
            {!editMode ? (
              <Text fontFamily="poppins" fontWeight="semibold">
                {collection.label}
              </Text>
            ) : (
              <InputGroup size="sm" maxWidth="75%">
                <Input
                  borderRadius="8px"
                  maxLength={adminSettings.collection.maxTitleLength}
                  value={collectionLabel}
                  onChange={(e) => onChangeLabel(e.target.value)}
                  borderRight="none"
                  _focus={{ outline: 'none' }}
                  _hover={{ borderColor: 'inherit' }}
                  placeholder="Nama Koleksi"
                  fontSize="12px"
                />
                <InputRightAddon
                  borderRightRadius="8px"
                  backgroundColor="white"
                  borderLeft="none"
                  children={
                    <CharCounter
                      value={collectionLabel}
                      maxLength={adminSettings.collection.maxTitleLength}
                    />
                  }
                />
              </InputGroup>
            )}
            <Box display="contents">
              {collection.itemList?.length === 0 && (
                <Text
                  fontFamily="poppins"
                  fontSize={{ base: '14px', sm: '12px', lg: '14px' }}
                >
                  Koleksi ini masih kosong
                </Text>
              )}

              {collection.itemList?.length > 0 && (
                <Text
                  fontFamily="poppins"
                  fontSize={{ base: '14px', sm: '12px', lg: '14px' }}
                >
                  {collection.itemList.length}
                  {' produk'}
                </Text>
              )}
            </Box>
          </HStack>
        </VStack>
      </Box>
      {editMode && (
        <IconButton
          icon={<HiMinusCircle size="24px" />}
          aria-label="Remove collection"
          color="brand.red"
          variant="ghost"
          position="absolute"
          top="0"
          right="20px"
          display={{ base: 'none', sm: 'flex', md: 'none' }}
          onClick={() => onDelete?.()}
          _focus={{ outline: 'none' }}
        />
      )}
    </>
  );
};

export default CollectionCard;
