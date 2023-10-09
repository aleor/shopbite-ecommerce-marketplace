import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useContext, useRef, useState } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import {
    Box, Button, Center, HStack, IconButton, Image, Input, Skeleton, Spinner, Square, Text,
    useDisclosure, VStack
} from '@chakra-ui/react';

import firebaseApp from '../../../../../firebase/clientApp';
import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { shopConverter } from '../../../../../models';
import { adminSettings } from '../../../adminSettings';
import ConfirmationModal from '../../../ConfirmationModal';
import { ShopContext } from '../../../hooks/shopContext';

const ProfilePhoto = ({ mode }: { mode: 'view' | 'edit' }) => {
  const shop = useContext(ShopContext);
  const fileRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const storage = getStorage(firebaseApp);
  const [uploadFile, uploadError] = useUploadFile();

  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    const profileImageRef = ref(
      storage,
      `shops/${shop.id}/images/profile/${shop.username}_img`
    );

    await uploadFile(profileImageRef, file, {
      cacheControl: adminSettings.imageCacheSettings.cacheControl,
    });
    const url = await getDownloadURL(profileImageRef);

    return url;
  };

  const savePictureUrl = async (file: File) => {
    setIsSaving(true);

    try {
      let imageUrl = null;

      if (file) {
        imageUrl = await uploadProfilePhoto(file);
      }

      const docRef = doc(db, 'shops', shop.id).withConverter(shopConverter);

      await updateDoc(docRef, {
        profilePictureUrl: imageUrl,
      });

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Profile image is not saved',
        description:
          'An error occurred during save, please try again',
        status: 'error',
      });
    }
  };

  const onImageDelete = async () => {
    await savePictureUrl(null);
  };

  const onImageAdded = async (file: File) => {
    if (file?.size > adminSettings.profile.maxProfileImageSize) {
      showToast({
        title: 'Photo file size is too large',
        description: 'Photo file size should not exceed 2MB',
        status: 'error',
      });
      return;
    }

    await savePictureUrl(file);
  };

  const handleChange = (e) => {
    const [file] = e.target.files;

    if (!file) return;

    onImageAdded(file);
    e.target.value = null;
  };

  const renderImage = () => {
    return (
      <Box width="100px" height="100px">
        <Image
          borderRadius="50%"
          src={shop?.profilePictureUrl || '/images/no_photo_small.png'}
          alt="Profile picture"
          fallback={
            <Skeleton width="100px" height="100px" borderRadius="50%" />
          }
          width="100px"
          height="100px"
          objectFit="cover"
        />
      </Box>
    );
  };

  if (mode === 'view') {
    return renderImage();
  }

  return (
    <HStack spacing="8">
      <Box width="100px" height="100px">
        {shop?.profilePictureUrl ? (
          renderImage()
        ) : (
          <Center
            borderWidth="2px"
            borderRadius="50%"
            borderStyle="dashed"
            px="6"
            py="4"
            bg="white"
            width="100%"
            height="100%"
            onClick={() => fileRef.current?.click()}
            cursor="pointer"
          >
            <VStack spacing="3">
              <Square size="10" bg="bg-subtle" borderRadius="lg">
                <IconButton
                  icon={<HiOutlinePlusCircle size="24" />}
                  boxSize="5"
                  color="brand.black40"
                  aria-label="Add photo"
                  variant="link"
                  _focus={{ outline: 'none' }}
                />
              </Square>
            </VStack>
          </Center>
        )}
        <Input
          ref={fileRef}
          onChange={handleChange}
          multiple={false}
          type="file"
          accept="image/jpg, image/jpeg, image/png"
          hidden
        />
      </Box>

      {shop?.profilePictureUrl && (
        <VStack spacing="4" alignItems="flex-start">
          <Button
            variant="link"
            color="brand.green"
            onClick={() => fileRef.current?.click()}
            _focus={{ outline: 'none' }}
            isDisabled={isSaving}
          >
            Change Picture
          </Button>
          <Button
            variant="link"
            color="brand.red"
            onClick={onOpen}
            _focus={{ outline: 'none' }}
            isDisabled={isSaving}
          >
            Delete Picture
          </Button>

          {isSaving && (
            <HStack>
              <Spinner color="brand.blue" size="sm" />
              <Text fontFamily="source" fontSize="14px" color="brand.black40">
                Updating profile picture...
              </Text>
            </HStack>
          )}
        </VStack>
      )}

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          onImageDelete();
          onClose();
        }}
        title="Are you sure you want to delete your profile picture?"
        message="Photos that have been deleted cannot be restored"
        confirmButtonLabel="Delete"
        cancelButtonLabel="Cancel"
      />
    </HStack>
  );
};

export default ProfilePhoto;
