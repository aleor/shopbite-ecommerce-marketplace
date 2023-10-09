import { doc, getDoc, updateDoc } from 'firebase/firestore';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { HiOutlineArrowLeft, HiSearch, HiX } from 'react-icons/hi';

import {
    Box, Button, Divider, Flex, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement,
    InputRightElement, Link, Text, useBreakpointValue, Wrap, WrapItem
} from '@chakra-ui/react';

import { db } from '../../../../firebase/firestore';
import { useToast } from '../../../../libs/useToast';
import { Collection, getUpdateData, Item } from '../../../../models';
import { useNavigation } from '../../hooks/useNavigation';
import SpinnerOverlay from '../../SpinnerOverlay';
import CollectionItem from './CollectionItem';

const EditCollection = ({
  collection,
  shopId,
  onSaved,
  onClose,
  items,
}: {
  collection: Collection;
  onSaved: (numberOfChanges: number) => void;
  onClose: () => void;
  shopId: string;
  items: Item[];
}) => {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [allItems, setAllItems] = useState(
    items.filter((i) => !collection.itemList.map((i) => i.id).includes(i.id))
  );

  const [collectionItems, setCollectionItems] = useState(
    collection.itemList as Item[]
  );
  const [term, setTerm] = useState('');

  const { getLink } = useNavigation();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const filteredItems = useMemo(() => {
    if (term.length === 0) {
      return allItems;
    }

    return allItems.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  }, [allItems, term]);

  const onItemSelected = (item: Item, isSelected: boolean) => {
    if (isSelected) {
      setCollectionItems([...collectionItems, item]);
      setAllItems(allItems.filter((i) => i.id !== item.id));
    } else {
      setAllItems([...allItems, item]);
      setCollectionItems(collectionItems.filter((i) => i.id !== item.id));
    }
  };

  const trackChanges = () => {
    const newItemIds = collectionItems.map((i) => i.id);
    const oldItemIds = collection.itemList.map((i) => i.id);
    const removedItemIds = oldItemIds.filter((i) => !newItemIds.includes(i));
    const addedItemIds = newItemIds.filter((i) => !oldItemIds.includes(i));

    return { addedItemIds, removedItemIds };
  };

  const updateCollection = async () => {
    const collectionRef = doc(
      db,
      `shops/${shopId}/collections/${collection.id}`
    );

    const items = collectionItems.map((item, ordering) =>
      getUpdateData({ ...item, ordering })
    );

    await updateDoc(collectionRef, {
      itemList: items,
    });
  };

  const updateItems = async (changes: {
    addedItemIds: string[];
    removedItemIds: string[];
  }) => {
    const updatedItems = changes.addedItemIds.concat(changes.removedItemIds);

    const updateItemTasks = updatedItems.map(async (itemId) => {
      const itemRef = doc(db, `shops/${shopId}/items/${itemId}`);
      const item = await getDoc(itemRef);

      const collectionIds = item.data()?.collectionIds || [];
      const updatedCollectionsList = changes.addedItemIds.includes(itemId)
        ? [...collectionIds, collection.id]
        : [...collectionIds].filter((c) => c !== collection.id);

      return updateDoc(itemRef, {
        collectionIds: updatedCollectionsList,
      });
    });

    await Promise.all(updateItemTasks);
  };

  const saveChanges = async () => {
    const changes = trackChanges();

    const totalChanges = changes.addedItemIds.concat(
      changes.removedItemIds
    ).length;

    if (totalChanges === 0) {
      onClose();
      return;
    }

    setIsSaving(true);

    try {
      await updateCollection();
      await updateItems(changes);
      setIsSaving(false);
      onSaved(totalChanges);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      showToast({
        title: 'Failed to save changes',
        description:
          'An error occurred during save, please try again',
        status: 'error',
      });
    }
  };

  return (
    <>
      <SpinnerOverlay visible={isSaving} message="Saving changes..." />
      <Box pointerEvents={isSaving ? 'none' : 'all'}>
        <HStack justifyContent="space-between" pb="2">
          <HStack>
            <IconButton
              icon={<HiOutlineArrowLeft size={isMobile ? '14px' : '18px'} />}
              onClick={onClose}
              aria-label="Close"
              variant="ghost"
              color="brand.green"
              size={isMobile ? 'xs' : 'md'}
            />
            <Text
              fontFamily="source"
              fontWeight="semibold"
              fontSize={{ base: '24px', sm: '16px', md: '24px' }}
              noOfLines={1}
              wordBreak="break-all"
            >
              {collection.label}
            </Text>
          </HStack>
          (
          <Flex>
            <Button
              color="brand.green"
              textColor="white"
              onClick={saveChanges}
              minWidth={{ base: '230px', md: '170px', lg: '230px' }}
              display={{ base: 'flex', sm: 'none', md: 'flex' }}
              size="md"
              fontFamily="poppins"
              fontSize="14px"
            >
              Save changes
            </Button>
          </Flex>
          )
        </HStack>
        <Divider borderColor="brand.green" />

        <Box pt="6" maxWidth={{ base: '75%', sm: '100%', lg: '75%' }}>
          <Box>
            <Text
              fontFamily="poppins"
              fontSize={{ base: '14px', sm: '12px', md: '14px' }}
              fontWeight="normal"
              color="brand.black40"
            >
              All Products
            </Text>
          </Box>
          <Box pt="2">
            {collectionItems.length === 0 ? (
              <Text fontFamily="source" color="brand.black70" fontSize="14px">
                No products have been added yet
              </Text>
            ) : (
              <Wrap spacing="4">
                {collectionItems.map((item) => (
                  <WrapItem key={item.id}>
                    <CollectionItem
                      item={item}
                      isSelected={true}
                      onSelect={onItemSelected}
                    />
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Box>
        </Box>
      </Box>

      <Box pt="6">
        <Box>
          <Text
            fontFamily="poppins"
            fontSize={{ base: '14px', sm: '12px', md: '14px' }}
            fontWeight="normal"
            color="brand.black40"
          >
            All Products
          </Text>
        </Box>

        <Box py="2">
          <InputGroup
            w={{ base: '40%', sm: '100%', md: '70%', lg: '40%' }}
            h="8"
          >
            <InputLeftElement pointerEvents="none" h="10">
              <Icon as={HiSearch} color="brand.gray" boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder="Search products"
              fontSize="md"
              lineHeight="14px"
              h="10"
              spellCheck="false"
              id="search-input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <InputRightElement h="10">
              <IconButton
                aria-label="Close"
                color="brand.gray"
                icon={<HiX />}
                variant="link"
                _focus={{ outline: 'none' }}
                onClick={() => setTerm('')}
                visibility={term ? 'visible' : 'hidden'}
              ></IconButton>
            </InputRightElement>
          </InputGroup>
        </Box>

        {items.length === 0 && (
          <HStack pt="4">
            <Text fontFamily="source" color="brand.black70" fontSize="14px">
            You haven't added products to your shop yet. Please{' '}
              <NextLink href={getLink('items')}>
                <Link>add new product here</Link>
              </NextLink>
            </Text>
          </HStack>
        )}

        <Box
          pt="4"
          pb={{ base: '4', sm: '20', md: '4' }}
          maxWidth={{ base: '75%', sm: '95%', lg: '75%' }}
        >
          <Wrap spacing="4">
            {filteredItems.map((item) => (
              <WrapItem key={item.id}>
                <CollectionItem item={item} onSelect={onItemSelected} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>

      {isMobile && (
        <Box
          boxShadow={'0px -4px 15px rgba(0, 0, 0, 0.04);'}
          bottom="0"
          position="fixed"
          width="100%"
          py="3"
          mx="-4"
          px="4"
          textAlign="center"
          backgroundColor="white"
          zIndex="100"
        >
          <Button
            size="md"
            width="100%"
            onClick={saveChanges}
            justifyContent="center"
          >
            Save Changes
          </Button>
        </Box>
      )}
    </>
  );
};

export default EditCollection;
