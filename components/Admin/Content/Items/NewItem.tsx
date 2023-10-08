import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useState } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { HiOutlineArrowLeft } from 'react-icons/hi';

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
import { useToast } from '../../../../libs/useToast';
import {
  Collection,
  collectionConverter,
  ItemAddOn,
  ItemLink,
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

const NewItem = ({
  collections,
  onClose,
  onSaved,
  shopId,
  canAddNonHiddenItems,
}: {
  collections: Collection[];
  onClose: () => void;
  onSaved: () => void;
  shopId: string;
  canAddNonHiddenItems: boolean;
}): JSX.Element => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [price, setPrice] = useState(null);
  const [images, setImages] = useState([] as ItemUploadImage[]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState(
    [] as string[]
  );
  const [itemStatus, setItemStatus] = useState(`${ItemStatus.available}`);
  const [itemLinks, setItemLinks] = useState<ItemLink[]>([]);
  const [itemVariants, setItemVariants] = useState<ItemVariant[]>([]);
  const [itemAddOns, setItemAddOns] = useState<ItemAddOn[]>([]);

  const saveEnabled =
    title?.trim().length > 0 && (price > 0 || itemVariants.length > 0);

  const storage = getStorage(firebaseApp);
  const [uploadFile, uploadError] = useUploadFile();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const {
    isOpen: isGoBackWithoutChangesModalOpen,
    onClose: onGoBackWithoutChangesModalClose,
    onOpen: onGoBackWithoutChangesModalOpen,
  } = useDisclosure();

  const onItemVariantsChange = (
    basePrice: number | null,
    variants: ItemVariant[]
  ) => {
    setPrice(basePrice);
    setItemVariants(variants);
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      const imageUrls = await uploadImages();
      const item = await saveItem(imageUrls);
      await updateCollections(item);
      setIsSaving(false);
      onSaved();
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Gagal menyimpan produk',
        description: 'Terjadi kesalahan dalam menyimpan, harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
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

  const saveItem = async (imageUrls: string[]) => {
    const item = {
      title,
      description: JSON.stringify(description),
      price: price ? price : null,
      imageUrls: imageUrls || [],
      status: itemStatus,
      collectionIds: selectedCollectionIds,
      externalLinks: itemLinks || [],
      variants: itemVariants || [],
      addOns: itemAddOns || [],
    };

    const docRef = await addDoc(collection(db, `shops/${shopId}/items`), item);

    return { id: docRef.id, ...item };
  };

  const updateCollections = async (item) => {
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
      const nextOrdering =
        Math.max(...itemsList.map((item) => item.ordering)) + 1;

      const nextItem = {
        ...item,
        ordering: nextOrdering,
      };

      return updateDoc(collectionDocRef, {
        itemList: [...itemsList, nextItem],
      });
    });

    await Promise.all(tasks);
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
      <SpinnerOverlay visible={isSaving} message="Saving item..." />
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
              >
                Add item
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
                Simpan
              </Button>
            </Box>
          </HStack>
          <Divider borderColor="brand.green" />
        </Box>

        <Box px={{ base: '4', sm: '2', md: '4' }} py="4">
          <Stack
            spacing={{ base: '12', sm: '4', md: '12' }}
            alignItems="flex-start"
            pb={{ base: '0', sm: '20', md: '0' }}
            direction={{ base: 'row', sm: 'column', md: 'row' }}
            width={{ base: '100%', sm: '100%', md: '100%' }}
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
                <ItemImages onImageChange={setImages} />
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
                  links={itemLinks}
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
                    canAddNonHiddenItems
                      ? ItemStatus.available
                      : ItemStatus.hidden
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
          py="3"
          backgroundColor="white"
          mx="-4"
          px="4"
          textAlign="center"
        >
          <Button
            size="md"
            isDisabled={!saveEnabled || isSaving}
            onClick={onSave}
            width="100%"
          >
            <Text color="white">Simpan</Text>
          </Button>
        </Box>
      )}

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

export default NewItem;
