import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineMenuAlt4 } from 'react-icons/hi';

import {
    Box, Button, chakra, Divider, Flex, HStack, IconButton, Text, useBreakpointValue, VStack
} from '@chakra-ui/react';

import { db } from '../../../../firebase/firestore';
import { useToast } from '../../../../libs/useToast';
import { Collection, collectionConverter } from '../../../../models';
import SpinnerOverlay from '../../SpinnerOverlay';
import CollectionItemCard from './CollectionItemCard';

const List = chakra(Reorder.Group);
const ListItem = chakra(Reorder.Item);

const CollectionDetails = ({
  collection,
  shopId,
  onClose,
  onSaved,
  onEdit,
}: {
  collection: Collection;
  shopId: string;
  onClose: () => void;
  onSaved: (numberOfChanges: number) => void;
  onEdit: () => void;
}) => {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [sortedItems, setSortedItems] = useState(
    collection.itemList.sort((a, b) => a.ordering - b.ordering)
  );
  const [itemsOrder, setItemsOrder] = useState(
    sortedItems.map((c) => c.ordering)
  );
  const [reorderMode, setReorderMode] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!isSaving) {
      setSortedItems(
        collection.itemList.sort((a, b) => a.ordering - b.ordering)
      );
    }
  }, [collection]);

  const trackOrderChanges = () => {
    if (itemsOrder.length === 0) {
      return;
    }

    const changes = itemsOrder
      .map((value, index) => {
        const item = sortedItems.find((i) => i.ordering === value);

        if (item?.ordering !== index) {
          return {
            itemId: item.id,
            ordering: index,
          };
        }
      })
      .filter((c) => c);

    return changes;
  };

  const writeChanges = async (
    changes: { itemId: string; ordering: number }[]
  ) => {
    if (!changes.length) {
      return;
    }

    const collectionDocRef = doc(
      db,
      `shops/${shopId}/collections/${collection.id}`
    ).withConverter(collectionConverter);

    const collectionDoc = await getDoc(collectionDocRef);

    if (!collectionDoc.exists()) {
      throw new Error('Collection not found');
    }

    const collectionData = collectionDoc.data();

    const updateItemTasks = changes.map((change) => {
      const item = collectionData.itemList.find((i) => i.id === change.itemId);

      if (!item) {
        return;
      }

      const updatedItem = { ...item, ordering: change.ordering };

      const removeItemTask = updateDoc(collectionDocRef, {
        itemList: arrayRemove(item),
      });
      const addUpdatedItemTask = updateDoc(collectionDocRef, {
        itemList: arrayUnion(updatedItem),
      });

      return Promise.all([removeItemTask, addUpdatedItemTask]);
    });

    await Promise.all(updateItemTasks);
  };

  const onSave = async () => {
    setIsSaving(true);

    try {
      const changes = trackOrderChanges();
      await writeChanges(changes);
      onSaved(changes.length);
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Gagal mengurutkan ulang koleksi',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  if (!collection) {
    return null;
  }

  return (
    <>
      <SpinnerOverlay visible={isSaving} message="Menyimpan perubahan..." />
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
          {!reorderMode && (
            <HStack spacing="4">
              <Button
                variant="ghost"
                color="brand.green"
                borderColor="brand.green"
                minWidth={{ base: '200px', sm: 'auto', md: '200px' }}
                fontFamily="poppins"
                fontWeight={{ base: 'medium', sm: 'normal', md: 'medium' }}
                _focus={{ outline: 'none' }}
                size="md"
                onClick={() => {
                  setReorderMode(!reorderMode);
                }}
                disabled={collection.itemList?.length < 2}
              >
                Atur urutan produk
              </Button>
              <Button
                color="brand.green"
                textColor="white"
                onClick={onEdit}
                minWidth={{ base: '230px', md: '170px', lg: '230px' }}
                size="md"
                fontFamily="poppins"
                fontSize="14px"
                display={{ base: 'flex', sm: 'none', lg: 'flex' }}
              >
                Tambah atau edit pilihan produk
              </Button>
            </HStack>
          )}

          {reorderMode && (
            <Flex>
              <Button
                color="brand.green"
                textColor={{ base: 'white', sm: 'brand.green', md: 'white' }}
                onClick={onSave}
                minWidth={{
                  base: '230px',
                  sm: 'auto',
                  md: '170px',
                  lg: '230px',
                }}
                size="md"
                fontWeight={isMobile ? 'normal' : 'medium'}
                fontFamily="poppins"
                fontSize={isMobile ? '12px' : '14px'}
                variant={isMobile ? 'link' : 'primary'}
                _focus={{ outline: 'none' }}
              >
                Simpan perubahan
              </Button>
            </Flex>
          )}
        </HStack>

        <Button
          color="brand.green"
          textColor="white"
          onClick={onEdit}
          size="md"
          width="100%"
          fontFamily="poppins"
          fontSize="14px"
          my="2"
          display={{ base: 'none', sm: 'flex', lg: 'none' }}
          isDisabled={reorderMode}
        >
          Tambah atau edit pilihan produk
        </Button>

        <Divider
          borderColor="brand.green"
          display={{ base: 'flex', sm: 'none', md: 'flex' }}
        />

        <VStack spacing="6" alignItems="flex-start" py="4" width="100%">
          {!reorderMode &&
            sortedItems.map((item) => (
              <Box width="100%" key={item.id}>
                <CollectionItemCard item={item} />
              </Box>
            ))}

          {reorderMode && (
            <List
              values={itemsOrder}
              onReorder={setItemsOrder}
              listStyleType="none"
              width="100%"
            >
              {itemsOrder
                .map((order) =>
                  sortedItems.find((item) => item.ordering === order)
                )
                .map((item) =>
                  item ? (
                    <ListItem
                      key={item.id}
                      value={item.ordering}
                      bg="transparent"
                      position="relative"
                      cursor="grab"
                      whileDrag={{ cursor: 'grabbing', scale: 1.1 }}
                      width="100%"
                      pb="6"
                    >
                      <Box key={item.id} width="100%">
                        <HStack
                          spacing={{ base: '4', sm: '2', md: '4' }}
                          width="100%"
                        >
                          <CollectionItemCard item={item} />
                          <IconButton
                            icon={<HiOutlineMenuAlt4 size="18px" />}
                            aria-label="Change Item Order"
                            variant="ghost"
                            color="brand.green"
                            _focus={{ outline: 'none' }}
                            size="sm"
                          />
                        </HStack>
                      </Box>
                    </ListItem>
                  ) : null
                )}
            </List>
          )}
        </VStack>
      </Box>
    </>
  );
};

export default CollectionDetails;
