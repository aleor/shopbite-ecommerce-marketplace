import { useState } from 'react';
import { HiMinusCircle } from 'react-icons/hi';

import {
  Box,
  FormControl,
  IconButton,
  Image,
  Skeleton,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import { useToast } from '../../../../libs/useToast';
import { ItemUploadImage } from '../../../../models';
import { adminSettings } from '../../adminSettings';
import { Dropzone } from '../../Dropzone';
import { useSubscription } from '../../hooks/useSubscription';

const ItemImages = ({
  imageUrls,
  onImageChange,
  onPredefinedImageChange,
}: {
  onImageChange: (images: ItemUploadImage[]) => void;
  onPredefinedImageChange?: (imageUrls: string[]) => void;
  imageUrls?: string[];
}) => {
  const [images, setImages] = useState([] as ItemUploadImage[]);
  const [predefinedImages, setPredefinedImages] = useState(imageUrls || []);

  const hasActiveSubscription = useSubscription();

  const totalImages = images?.length + predefinedImages?.length;

  const canAddMoreImages = hasActiveSubscription
    ? totalImages < adminSettings.item.maxImages
    : totalImages < adminSettings.freePlanLimits.maxImages;

  const { showToast } = useToast();

  const onImageAdded = (file: File) => {
    if (file?.size > adminSettings.item.maxImageSize) {
      showToast({
        title: 'Ukuran file gambar terlalu besar',
        description: 'Ukuran file gambar tidak boleh melebihi 2MB',
        status: 'error',
      });
      return;
    }

    const timestamp = new Date().valueOf();
    const image = { file, timestamp };

    const updatedImages = [...images, image];

    setImages(updatedImages);
    onImageChange(updatedImages);
  };

  const onPredefinedImageDeleted = (imageUrl: string) => {
    const updatedPredefinedImages = predefinedImages.filter(
      (predefinedImage) => predefinedImage !== imageUrl
    );

    setPredefinedImages(updatedPredefinedImages);
    onPredefinedImageChange?.(updatedPredefinedImages);
  };

  const onImageDeleted = (timestamp: number) => {
    const updatedImages = [...images].filter(
      (image) => image.timestamp !== timestamp
    );

    setImages(updatedImages);
    onImageChange(updatedImages);
  };

  const renderImage = ({
    imageUrl,
    alt,
    onDelete,
  }: {
    imageUrl: string;
    alt: string;
    onDelete: () => void;
  }) => {
    return (
      <Box width="100px" height="100px" flexShrink={0} borderRadius="8px">
        <Image
          src={imageUrl}
          alt={alt}
          borderRadius="8px"
          fallback={
            <Skeleton width="100px" height="100px" borderRadius="8px" />
          }
          width="100px"
          height="100px"
          objectFit="cover"
        />
        <IconButton
          icon={<HiMinusCircle size="24px" />}
          aria-label="Remove image"
          color="brand.red"
          bg="white"
          variant="link"
          bottom="107px"
          left="87px"
          size="xs"
          width="24px"
          height="24px"
          minWidth="24px"
          borderRadius="50%"
          position="relative"
          onClick={onDelete}
          _focus={{ outline: 'none' }}
        />
      </Box>
    );
  };

  return (
    <VStack alignItems="flex-start" spacing="4">
      <Text
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize={{ base: '16px', sm: '14px', md: '16px' }}
      >
        Gambar Produk
      </Text>

      {!hasActiveSubscription && (
        <Box maxWidth="fit-content">
          <Text fontFamily="poppins" fontSize="12px" color="brand.black70">
            Upgrade akun kamu dengan Paket Premium dan nikmati keunggulan mengupload
            lebih dari satu gambar produk
          </Text>
        </Box>
      )}

      <Wrap spacing="4">
        <WrapItem>
          <FormControl id="file">
            <Box width="100px" height="100px">
              <Dropzone
                onImageAdded={onImageAdded}
                canAdd={canAddMoreImages}
                isProUser={hasActiveSubscription}
              />
            </Box>
          </FormControl>
        </WrapItem>
        {predefinedImages.map((imageUrl, index) => (
          <WrapItem key={imageUrl}>
            {renderImage({
              imageUrl,
              alt: `Item image # ${index + 1}`,
              onDelete: () => {
                onPredefinedImageDeleted(imageUrl);
              },
            })}
          </WrapItem>
        ))}
        {images.map((image) => (
          <WrapItem key={image.timestamp}>
            {renderImage({
              imageUrl: URL.createObjectURL(image.file),
              alt: image.file.name,
              onDelete: () => onImageDeleted(image.timestamp),
            })}
          </WrapItem>
        ))}
      </Wrap>
    </VStack>
  );
};
export default ItemImages;
