import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiOutlineMenuAlt4, HiOutlineTrash } from 'react-icons/hi';

import {
  Box,
  chakra,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

import { db } from '../../../../firebase/firestore';
import { useToast } from '../../../../libs/useToast';
import { Collection } from '../../../../models';
import ConfirmationModal from '../../ConfirmationModal';
import SpinnerOverlay from '../../SpinnerOverlay';
import CollectionCard from './CollectionCard';
import CollectionsHeader from './CollectionsHeader';

const List = chakra(Reorder.Group);
const ListItem = chakra(Reorder.Item);

type CollectionChange = {
  label?: string;
  ordering?: number;
};

type CollectionChangeMap = Map<string, CollectionChange>;

const ManageCollections = ({
  collections = [],
  shopId,
  onClose,
  onSaved,
}: {
  collections: Collection[];
  shopId: string;
  onClose: () => void;
  onSaved: (numberOfChanges: number) => void;
}) => {
  const {
    isOpen: isDeleteCollectionModalOpen,
    onOpen: onDeleteCollectionModalOpen,
    onClose: onDeleteCollectionModalClose,
  } = useDisclosure();
  const {
    isOpen: isGoBackWithoutChangesModalOpen,
    onClose: onGoBackWithoutChangesModalClose,
    onOpen: onGoBackWithoutChangesModalOpen,
  } = useDisclosure();

  const { showToast } = useToast();

  const [order, setOrder] = useState(collections.map((c) => c.ordering));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSaving) {
      setOrder(collections.map((coll) => coll.ordering));
    }
  }, [collections]);

  const [batchedCollectionChanges, setBatchedCollectionChanges] =
    useState<CollectionChangeMap>(new Map());
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      trackOrderChanges();
      const numberOfChanges = await writeChanges();
      setIsSaving(false);
      onSaved(numberOfChanges);
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Gagal menyimpan perubahan',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.log(error);
    }
  };

  const onGoBack = () => {
    trackOrderChanges();

    if (batchedCollectionChanges.size > 0) {
      onGoBackWithoutChangesModalOpen();
      return;
    }

    onClose();
  };

  const writeChanges = async (): Promise<number> => {
    if (batchedCollectionChanges.size === 0) {
      return 0;
    }

    const allTasks = Array.from(batchedCollectionChanges.keys()).map(
      (collectionId) => {
        const collectionDocRef = doc(
          db,
          `shops/${shopId}/collections/${collectionId}`
        );
        return updateDoc(
          collectionDocRef,
          batchedCollectionChanges.get(collectionId)
        );
      }
    );

    const numberOfSavedChanges = allTasks.length;

    await Promise.all(allTasks);

    setBatchedCollectionChanges(new Map());

    return numberOfSavedChanges;
  };

  const onChangeCollectionLabel = ({
    collectionId,
    label,
  }: {
    collectionId: string;
    label: string;
  }) => {
    if (batchedCollectionChanges.has(collectionId)) {
      const changes = batchedCollectionChanges.get(collectionId);
      batchedCollectionChanges.set(collectionId, {
        ...changes,
        label,
      });
    } else {
      batchedCollectionChanges.set(collectionId, { label });
    }

    setBatchedCollectionChanges(batchedCollectionChanges);
  };

  const onDeleteCollection = async () => {
    if (!selectedCollection) {
      return;
    }

    try {
      const collectionDoc = doc(
        db,
        `shops/${shopId}/collections/${selectedCollection.id}`
      );
      await deleteDoc(collectionDoc);
    } catch (error) {
      console.log(error);
      showToast({
        title: 'Gagal menghapus koleksi',
        description: 'Terjadi kesalahan dalam menghapus, harap mencoba kembali',
        status: 'error',
      });
    }
  };

  const trackOrderChanges = async () => {
    if (order.length === 0) {
      return;
    }

    const changes = order.map((value, index) => {
      const collection = collections.find((c) => c.ordering === value);

      if (collection?.ordering !== index) {
        return {
          collectionId: collection.id,
          ordering: index,
        };
      }
    });

    changes
      .filter((c) => c)
      .forEach((change) => {
        if (batchedCollectionChanges.has(change.collectionId)) {
          const existingChanges = batchedCollectionChanges.get(
            change.collectionId
          );
          batchedCollectionChanges.set(change.collectionId, {
            ...existingChanges,
            ordering: change.ordering,
          });
        } else {
          batchedCollectionChanges.set(change.collectionId, {
            ordering: change.ordering,
          });
        }
      });
  };

  if (!collections.length) {
    return null;
  }

  return (
    <>
      <SpinnerOverlay visible={isSaving} />
      <Box pointerEvents={isSaving ? 'none' : 'all'} w="100%">
        <CollectionsHeader
          mode={'edit'}
          collectionsCount={collections.length}
          onSave={saveChanges}
          onCancel={onGoBack}
        />
        <List
          values={order}
          onReorder={setOrder}
          listStyleType="none"
          width="100%"
          py="2"
        >
          {order
            .map((item) =>
              collections.find((collection) => collection.ordering === item)
            )
            .map((collection) =>
              collection ? (
                <ListItem
                  key={collection.id}
                  value={collection.ordering}
                  bg="transparent"
                  position="relative"
                  cursor="grab"
                  whileDrag={{ cursor: 'grabbing', scale: 1.1 }}
                  width="100%"
                  py="4"
                >
                  <Box key={collection.id} width="100%">
                    <HStack
                      width="100%"
                      justifyContent="space-between"
                      bg="white"
                    >
                      <HStack
                        spacing={{ base: '4', sm: '2', md: '4' }}
                        width={{ base: '85%', sm: '100%', md: '85%' }}
                      >
                        <Box w="90%">
                          <CollectionCard
                            collection={collection}
                            editMode={true}
                            onChange={onChangeCollectionLabel}
                            onDelete={() => {
                              setSelectedCollection(collection);
                              onDeleteCollectionModalOpen();
                            }}
                          />
                        </Box>
                        <IconButton
                          icon={<HiOutlineMenuAlt4 size="18px" />}
                          aria-label="Change Collection Order"
                          variant="ghost"
                          color="brand.green"
                          _focus={{ outline: 'none' }}
                          size="sm"
                        />
                      </HStack>
                      <IconButton
                        icon={<HiOutlineTrash size="24px" />}
                        aria-label="Delete Collection"
                        variant="ghost"
                        color="brand.red"
                        _focus={{ outline: 'none' }}
                        display={{ base: 'flex', sm: 'none', md: 'flex' }}
                        onClick={() => {
                          setSelectedCollection(collection);
                          onDeleteCollectionModalOpen();
                        }}
                        size="sm"
                      />
                    </HStack>
                  </Box>
                </ListItem>
              ) : null
            )}
        </List>
      </Box>

      <ConfirmationModal
        isOpen={isDeleteCollectionModalOpen}
        onClose={onDeleteCollectionModalClose}
        onConfirm={() => {
          onDeleteCollection();
          onDeleteCollectionModalClose();
        }}
        title="Apakah kamu yakin ingin menghapus koleksi ini?"
        message="Koleksi yang dihapus tidak dapat dikembalikan."
        confirmButtonLabel="Hapus"
        cancelButtonLabel="Batalkan"
      />

      <ConfirmationModal
        isOpen={isGoBackWithoutChangesModalOpen}
        onClose={onGoBackWithoutChangesModalClose}
        onConfirm={() => {
          onGoBackWithoutChangesModalClose();
          onClose();
        }}
        title="Apakah kamu yakin ingin keluar tanpa menyimpan perubahan?"
        message="Perubahan yang tidak tersimpan akan hilang"
        confirmButtonLabel="Iya"
        cancelButtonLabel="Lanjut edit"
      />
    </>
  );
};

export default ManageCollections;
