import {
    addDoc, collection, doc, DocumentData, DocumentReference, getDoc, updateDoc
} from 'firebase/firestore';
import NextLink from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { HiOutlineArrowLeft, HiSearch, HiX } from 'react-icons/hi';

import {
    Box, Button, Divider, FormControl, FormLabel, HStack, Icon, IconButton, Input, InputGroup,
    InputLeftElement, InputRightAddon, InputRightElement, Link, Text, useBreakpointValue,
    useDisclosure, Wrap, WrapItem
} from '@chakra-ui/react';

import { db } from '../../../../firebase/firestore';
import { getUpdateData, Item, itemConverter } from '../../../../models';
import CharCounter from '../../../CharCounter';
import { adminSettings } from '../../adminSettings';
import ConfirmationModal from '../../ConfirmationModal';
import { useNavigation } from '../../hooks/useNavigation';
import SpinnerOverlay from '../../SpinnerOverlay';
import CollectionItem from './CollectionItem';

const NewCollection = ({
  items = [],
  shopId,
  ordering,
  onClose,
}: {
  items: Item[];
  shopId: string;
  ordering: number;
  onClose: () => void;
}) => {
  const [label, setLabel] = useState('');
  const [allItems, setAllItems] = useState(items);
  const [collectionItems, setCollectionItems] = useState([]);
  const [term, setTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);

  const { getLink } = useNavigation();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const {
    isOpen: isEmptyCollectionModalOpen,
    onClose: onEmptyCollectionModalClose,
    onOpen: onEmptyCollectionModalOpen,
  } = useDisclosure();

  const {
    isOpen: isGoBackWithoutChangesModalOpen,
    onClose: onGoBackWithoutChangesModalClose,
    onOpen: onGoBackWithoutChangesModalOpen,
  } = useDisclosure();

  useEffect(() => {
    setSaveEnabled(label?.trim().length > 0);
  }, [label]);

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

  const createCollection = async (): Promise<string> => {
    const docRef: DocumentReference<DocumentData> = await addDoc(
      collection(db, `shops/${shopId}/collections`),
      {
        label,
        ordering,
      }
    );

    const collectionId = docRef.id;
    const collectionRef = doc(
      db,
      `shops/${shopId}/collections/${collectionId}`
    );

    const items = collectionItems.map((item: Item, index) =>
      getUpdateData({ ...item, ordering: index })
    );

    await updateDoc(collectionRef, {
      itemList: items,
    });

    return collectionId;
  };

  const updateItems = async (collectionId: string) => {
    if (collectionItems.length === 0) {
      return;
    }

    const tasks = collectionItems.map(async (item) => {
      const itemDocRef = doc(
        db,
        `shops/${shopId}/items/${item.id}`
      ).withConverter(itemConverter);

      const itemDoc = await getDoc(itemDocRef);
      const collectionIds = itemDoc.data()?.collectionIds || [];

      return updateDoc(itemDocRef, {
        collectionIds: [...collectionIds, collectionId],
      });
    });

    await Promise.all(tasks);
  };

  const save = async () => {
    setIsSaving(true);

    try {
      const collectionId = await createCollection();
      await updateItems(collectionId);
      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const onSave = async () => {
    if (collectionItems.length === 0) {
      onEmptyCollectionModalOpen();
      return;
    }

    await save();
  };

  const onGoBack = () => {
    if (saveEnabled) {
      onGoBackWithoutChangesModalOpen();
      return;
    }

    onClose();
  };

  return (
    <>
      <SpinnerOverlay visible={isSaving} />
      <Box pointerEvents={isSaving ? 'none' : 'all'}>
        <Box>
          <HStack justifyContent="space-between">
            <HStack>
              <IconButton
                icon={<HiOutlineArrowLeft size={isMobile ? '14px' : '18px'} />}
                onClick={onGoBack}
                aria-label="Close"
                variant="ghost"
                color="brand.green"
                size="md"
                _focus={{ outline: 'none' }}
              />
              <Text
                fontFamily="source"
                fontWeight="semibold"
                fontSize={{ base: '24px', sm: '16px', md: '24px' }}
              >
                Add New Collection
              </Text>
            </HStack>
            <Box py="2" display={{ base: 'flex', sm: 'none', md: 'flex' }}>
              <Button
                color="brand.green"
                textColor="white"
                onClick={onSave}
                minWidth={{ base: '230px', md: '170px', lg: '230px' }}
                size="md"
                isDisabled={!saveEnabled || isSaving}
              >
                Save
              </Button>
            </Box>
          </HStack>
          <Divider borderColor="brand.green" />
        </Box>
        <Box px={{ base: '4', sm: '2', md: '4' }}>
          <Box pt="6">
            <FormControl
              maxWidth={{ base: '50%', sm: '100%', md: '70%', lg: '50%' }}
            >
              <FormLabel
                htmlFor="label"
                fontFamily="poppins"
                fontWeight="semibold"
                fontSize={{ base: '16px', sm: '12px', md: '16px' }}
              >
                Collection Title<sup>*</sup>
              </FormLabel>
              <InputGroup>
                <Input
                  id="label"
                  value={label}
                  placeholder="cth. Recommended"
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={adminSettings.collection.maxTitleLength}
                  lineHeight="14px"
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
                      value={label}
                      maxLength={adminSettings.collection.maxTitleLength}
                    />
                  }
                />
              </InputGroup>
            </FormControl>

            <Box pt="6" maxWidth={{ base: '75%', sm: '100%', lg: '75%' }}>
              <Box>
                <Text
                  fontFamily="poppins"
                  fontSize={{ base: '14px', sm: '12px', md: '14px' }}
                  fontWeight="normal"
                  color="brand.black40"
                >
                  Included Products
                </Text>
              </Box>
              <Box pt="2" maxWidth={{ base: '75%', sm: '100%', lg: '75%' }}>
                {collectionItems.length === 0 ? (
                  <Text
                    fontFamily="source"
                    color="brand.black70"
                    fontSize="14px"
                  >
                    No products added yet
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
                w={{ base: '40%', sm: '100%', md: '70%', lg: '50%' }}
                h="8"
              >
                <InputLeftElement pointerEvents="none" h="10">
                  <Icon as={HiSearch} color="brand.gray" boxSize="5" />
                </InputLeftElement>
                <Input
                  placeholder="Cari produk disini"
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

            {allItems.length === 0 && (
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
              maxWidth={{ base: '75%', sm: '100%', lg: '75%' }}
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
        </Box>
      </Box>

      {isMobile && (
        <Box
          boxShadow={'0px -4px 15px rgba(0, 0, 0, 0.04);'}
          bottom="0"
          position="fixed"
          width="100%"
          mx="-4"
          px="4"
          textAlign="center"
          py="3"
          backgroundColor="white"
          zIndex="100"
        >
          <Button
            size="md"
            width="100%"
            isDisabled={!saveEnabled || isSaving}
            onClick={onSave}
          >
            <Text color="white">Save</Text>
          </Button>
        </Box>
      )}

      <ConfirmationModal
        isOpen={isEmptyCollectionModalOpen}
        onClose={onEmptyCollectionModalClose}
        onConfirm={() => {
          save();
          onEmptyCollectionModalClose();
        }}
        title="Are you sure you want to create an empty collection?"
        message="Only collections that are not empty will be displayed on the storefront page"
        confirmButtonLabel="Continue"
        cancelButtonLabel="Back"
      />

      <ConfirmationModal
        isOpen={isGoBackWithoutChangesModalOpen}
        onClose={onGoBackWithoutChangesModalClose}
        onConfirm={() => {
          onGoBackWithoutChangesModalClose();
          onClose();
        }}
        title="Are you sure you want to leave without saving changes?"
        message="Unsaved changes will be lost"
        confirmButtonLabel="Leave"
        cancelButtonLabel="Cancel"
      />
    </>
  );
};

export default NewCollection;
