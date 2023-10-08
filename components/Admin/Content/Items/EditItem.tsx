import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useState } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';

import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import firebaseApp from '../../../../firebase/clientApp';
import { db } from '../../../../firebase/firestore';
import { parseJSONSafely } from '../../../../libs/parseJSONSafely';
import { useToast } from '../../../../libs/useToast';
import {
  Collection,
  collectionConverter,
  Item,
  ItemStatus,
  ItemUploadImage,
  ItemVariant,
} from '../../../../models';
import { adminSettings } from '../../adminSettings';
import ConfirmationModal from '../../ConfirmationModal';
import SpinnerOverlay from '../../SpinnerOverlay';
import CollectionsSelector from './CollectionsSelector';
import ItemAddOns from './ItemAddons';
import ItemDescription from './ItemDescription';
import ItemImages from './ItemImages';
import ItemLinks from './ItemLinks';
import ItemStatusGroup from './ItemStatusGroup';
import ItemTitle from './ItemTitle';
import ItemVariants from './ItemVariants';

const EditItem = ({
  item,
  collections,
  shopId,
  onSaved,
  onClose,
  canAddNonHiddenItems,
}: {
  item: Item;
  collections: Collection[];
  shopId: string;
  onSaved: () => void;
  onClose: () => void;
  canAddNonHiddenItems: boolean;
}) => {
  const { showToast } = useToast();
  const {
    isOpen: isDeleteItemModalOpen,
    onOpen: onDeleteItemOpen,
    onClose: onDeleteItemClose,
  } = useDisclosure();

  const {
    isOpen: isGoBackWithoutChangesModalOpen,
    onClose: onGoBackWithoutChangesModalClose,
    onOpen: onGoBackWithoutChangesModalOpen,
  } = useDisclosure();

  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(
    parseJSONSafely(item.description)
  );
  const [price, setPrice] = useState(item.price);
  const [images, setImages] = useState([] as ItemUploadImage[]);
  const [predefinedImages, setPredefinedImages] = useState(
    item.imageUrls || []
  );
  const [selectedCollectionIds, setSelectedCollectionIds] = useState(
    item.collectionIds
  );
  const [itemStatus, setItemStatus] = useState(item.status);
  const [uploadFile, uploadError] = useUploadFile();
  const [itemLinks, setItemLinks] = useState(item.externalLinks || []);
  const [itemVariants, setItemVariants] = useState(item.variants || []);
  const [itemAddOns, setItemAddOns] = useState(item.addOns || []);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const storage = getStorage(firebaseApp);
  const saveEnabled =
    title?.trim().length > 0 && (price > 0 || itemVariants.length > 0);

  const getRemovedImageUrls = (): string[] => {
    return item.imageUrls.filter((url) => !predefinedImages.includes(url));
  };

  const removeFromCollections = async (collectionIds: string[]) => {
    if (!collectionIds?.length) {
      return;
    }

    const tasks = collectionIds.map(async (collectionId) => {
      const collectionDocRef = doc(
        db,
        `shops/${shopId}/collections/${collectionId}`
      ).withConverter(collectionConverter);

      const collection = await getDoc(collectionDocRef);
      const itemsList = collection.data()?.itemList || [];

      const updatedItemsList = [...itemsList].filter(
        (collectionItem) => collectionItem.id !== item.id
      );

      return updateDoc(collectionDocRef, {
        itemList: updatedItemsList,
      });
    });

    return Promise.all(tasks);
  };

  const removeFromExcludedCollections = async () => {
    const removedFrom = item.collectionIds.filter(
      (id) => !selectedCollectionIds.includes(id)
    );

    return removeFromCollections(removedFrom);
  };

  const getUpdatedItem = (newImageUrls: string[]): Item => {
    const updatedItem = {
      id: item.id,
      title,
      description,
      price: price ? price : null,
      imageUrls: predefinedImages.concat(newImageUrls),
      status: itemStatus,
      collectionIds: selectedCollectionIds,
      thumbnailUrl: item.thumbnailUrl || null,
      externalLinks: itemLinks || [],
      variants: itemVariants || [],
      addOns: itemAddOns || [],
    };

    return updatedItem;
  };

  const trackChanges = () => {
    const removedImages = getRemovedImageUrls();

    return {
      title: title !== item.title,
      description: description !== parseJSONSafely(item.description),
      price: price !== item.price,
      status: canAddNonHiddenItems ? itemStatus !== item.status : false,
      hasNewImages: images.length > 0,
      hasRemovedImages: removedImages.length > 0,
      hasChangedCollections:
        item.collectionIds.length !== selectedCollectionIds.length ||
        item.collectionIds.some((id) => !selectedCollectionIds.includes(id)),
      hasChangedLinks:
        itemLinks.length !== item.externalLinks?.length ||
        itemLinks.some(
          (link, index) =>
            link.type !== item.externalLinks[index]?.type ||
            link.url !== item.externalLinks[index]?.url
        ),
      hasChangedVariants:
        itemVariants.length !== item.variants?.length ||
        itemVariants.some(
          (variant, index) => variant.id !== item.variants[index]?.id
        ),
      hasChangedAddOns:
        itemAddOns.length !== item.addOns?.length ||
        itemAddOns.some((addOn, index) => addOn.id !== item.addOns[index]?.id),
    };
  };

  const uploadNewImages = async (): Promise<string[]> => {
    const tasks = images.map(async (image) => {
      const file = image.file;
      const ext = file.name.split('.').pop();
      const fileName = `${image.timestamp}.${ext}`;

      const imageRef = ref(storage, `shops/${shopId}/images/${fileName}`);

      return uploadFile(imageRef, file, {
        cacheControl: adminSettings.imageCacheSettings.cacheControl,
      }).then(() => getDownloadURL(imageRef));
    });

    const urls = await Promise.all(tasks);

    return urls;
  };

  const onItemVariantsChange = (
    basePrice: number | null,
    variants: ItemVariant[]
  ) => {
    setPrice(basePrice);
    setItemVariants(variants);
  };

  const onSave = async () => {
    const changes = trackChanges();

    if (Object.values(changes).every((value) => value === false)) {
      onClose();
      return;
    }

    setIsSaving(true);

    try {
      const newImageUrls = await uploadNewImages();
      const updatedItem = getUpdatedItem(newImageUrls);
      await saveUpdatedItem(updatedItem);
      await updateCollections(updatedItem);
      setIsSaving(false);
      onSaved();
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Gagal menyimpan perubahan produk',
        description: 'Terjadi kesalahan dalam menyimpan, harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const onDelete = async () => {
    setIsSaving(true);

    try {
      await removeFromCollections(item.collectionIds);
      await deleteDoc(doc(db, `shops/${shopId}/items/${item.id}`));
      setIsSaving(false);
      onSaved();
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Gagal menghapus produk',
        description: 'Terjadi kesalahan dalam menghapus, harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const saveUpdatedItem = async (item: Item) => {
    const docRef = doc(db, `shops/${shopId}/items/${item.id}`);
    await updateDoc(docRef, {
      title: item.title,
      description: JSON.stringify(item.description),
      price: item.price,
      imageUrls: item.imageUrls,
      status: item.status,
      collectionIds: item.collectionIds,
      externalLinks: item.externalLinks,
      variants: item.variants,
      addOns: item.addOns,
    });
  };

  const updateCollections = async (updatedItem: Item) => {
    await removeFromExcludedCollections();

    if (selectedCollectionIds.length === 0) {
      return;
    }

    const tasks = selectedCollectionIds.map(async (collectionId) => {
      const collectionDocRef = doc(
        db,
        `shops/${shopId}/collections/${collectionId}`
      ).withConverter(collectionConverter);

      const collection = await getDoc(collectionDocRef);
      const itemsList = collection.data()?.itemList || [];

      const originalItem = itemsList.find((item) => item.id === updatedItem.id);
      const updatedItemList = itemsList.filter(
        (item) => item.id !== updatedItem.id
      );

      const ordering = originalItem
        ? originalItem.ordering
        : itemsList.length
        ? Math.max(...itemsList.map((item) => item.ordering)) + 1
        : 0;

      return updateDoc(collectionDocRef, {
        itemList: [...updatedItemList, { ...updatedItem, ordering }],
      });
    });

    await Promise.all(tasks);
  };

  const onGoBack = () => {
    const changes = trackChanges();

    if (Object.values(changes).some((value) => value)) {
      onGoBackWithoutChangesModalOpen();
      return;
    }

    onClose();
  };

  if (!item) {
    return null;
  }

  return (
    <>
      <SpinnerOverlay visible={isSaving} message="Menyimpan perubahan..." />
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
                size={isMobile ? 'xs' : 'md'}
                _focus={{ outline: 'none' }}
              />
              <Text
                fontFamily="source"
                fontWeight="semibold"
                fontSize={{ base: '24px', sm: '18px', md: '24px' }}
                noOfLines={1}
                wordBreak="break-all"
              >
                Edit: {item.title}
              </Text>
            </HStack>
            <Box py="2" display={{ base: 'flex', sm: 'none', md: 'flex' }}>
              <HStack spacing={4}>
                <IconButton
                  icon={<HiOutlineTrash size="24px" />}
                  onClick={onDeleteItemOpen}
                  aria-label="Hapus Produk"
                  variant="ghost"
                  color="brand.red"
                  _focus={{ outline: 'none' }}
                />
                <Button
                  color="brand.green"
                  textColor="white"
                  onClick={onSave}
                  minWidth={{ base: '230px', md: '170px', lg: '200px' }}
                  size="md"
                  isDisabled={!saveEnabled || isSaving}
                >
                  Simpan
                </Button>
              </HStack>
            </Box>
          </HStack>
          <Divider borderColor="brand.green" />
        </Box>
        <Box px={{ base: '4', sm: '2', md: '4' }} py="4">
          <Stack
            spacing={{ base: '12', sm: '4', md: '12' }}
            pb={{ base: '0', sm: '24', md: '0' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
            width="100%"
          >
            <VStack
              alignItems="flex-start"
              spacing={{ base: '12', sm: '6', md: '12' }}
              width={{ base: '70%', sm: '100%', lg: '70%' }}
            >
              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <ItemImages
                  onImageChange={setImages}
                  onPredefinedImageChange={setPredefinedImages}
                  imageUrls={item.imageUrls}
                />
              </Box>

              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <VStack
                  width="100%"
                  py={{ base: '4', sm: '0', md: '4' }}
                  alignItems="flex-start"
                >
                  <ItemTitle title={title} onChange={setTitle} />

                  <ItemDescription
                    description={description}
                    onChange={setDescription}
                  />
                </VStack>
              </Box>

              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <ItemVariants
                  itemVariants={itemVariants}
                  basePrice={price}
                  onChange={onItemVariantsChange}
                />
              </Box>

              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <ItemAddOns addons={itemAddOns} onChange={setItemAddOns} />
              </Box>
            </VStack>

            <VStack
              alignItems="flex-start"
              pt={{ base: '0', sm: '2', md: '0' }}
              spacing={{ base: '12', sm: '6', md: '12' }}
              width={{ base: '70%', sm: '100%', lg: '70%' }}
            >
              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <ItemLinks
                  links={item.externalLinks}
                  onItemLinksUpdated={setItemLinks}
                />
              </Box>

              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <ItemStatusGroup
                  onChange={setItemStatus}
                  disabledStatuses={
                    canAddNonHiddenItems
                      ? []
                      : [ItemStatus.available, ItemStatus.disabled]
                  }
                  defaultStatus={
                    canAddNonHiddenItems ? item.status : ItemStatus.hidden
                  }
                />
              </Box>

              <Box
                boxShadow={{ base: 'md', sm: 'none', md: 'md' }}
                borderRadius="10px"
                padding={{ base: '6', sm: '0', md: '6' }}
                width="100%"
              >
                <CollectionsSelector
                  collections={collections}
                  preselectedCollections={item.collectionIds}
                  onChange={setSelectedCollectionIds}
                />
              </Box>
            </VStack>
          </Stack>
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
        >
          <Button
            size="md"
            width="100%"
            isDisabled={!saveEnabled || isSaving}
            onClick={onSave}
            _focus={{ outline: 'none' }}
          >
            <Text color="white">Simpan</Text>
          </Button>

          <Button
            variant="ghost"
            mt="3"
            size="md"
            width="100%"
            onClick={onDeleteItemOpen}
            _focus={{ outline: 'none' }}
          >
            <Text color="brand.red" fontFamily="poppins" fontWeight="medium">
              Hapus Produk
            </Text>
          </Button>
        </Box>
      )}

      <ConfirmationModal
        isOpen={isDeleteItemModalOpen}
        onClose={onDeleteItemClose}
        onConfirm={() => {
          onDelete();
          onDeleteItemClose();
        }}
        title="Apakah kamu yaking ingin menghapus produk ini?"
        message="Produk yang sudah dihapus tidak dapat dikembalikan kembali."
        confirmButtonLabel="Hapus"
        cancelButtonLabel="Batal"
      />

      <ConfirmationModal
        isOpen={isGoBackWithoutChangesModalOpen}
        onClose={onGoBackWithoutChangesModalClose}
        onConfirm={() => {
          onGoBackWithoutChangesModalClose();
          onClose();
        }}
        title="Apakah kamu yakin ingin kembali tanpa menyimpan perubahan?"
        message="Perubahan yang tidak disimpan akan hilang"
        confirmButtonLabel="Iya"
        cancelButtonLabel="Lanjut edit"
      />
    </>
  );
};

export default EditItem;
