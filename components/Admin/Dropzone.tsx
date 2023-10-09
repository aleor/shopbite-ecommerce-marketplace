import { useRef, useState } from 'react';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import { Center, IconButton, Input, Square, Tooltip, VStack } from '@chakra-ui/react';

export const Dropzone = ({
  onImageAdded,
  isProUser,
  canAdd = true,
}: {
  onImageAdded: (file: File) => void;
  isProUser: boolean;
  canAdd?: boolean;
}) => {
  const fileRef = useRef(null);
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const handleChange = (e) => {
    const [file] = e.target.files;

    if (!file) return;

    onImageAdded(file);
    e.target.value = null;
  };

  return (
    <Tooltip
      hasArrow
      label={
        isProUser
          ? 'The product images limit reached'
          : 'You can only upload one image per product as a Standard Account user.'
      }
      bg="gray.600"
      color="white"
      fontWeight="normal"
      borderRadius="8px"
      fontFamily="poppins"
      fontSize="12px"
      p="2"
      textAlign="center"
      maxWidth="250px"
      isOpen={isTooltipShown}
      isDisabled={canAdd}
    >
      <Center
        borderWidth="3px"
        borderRadius="8px"
        borderStyle="dashed"
        px="6"
        py="4"
        bg="white"
        width="100%"
        height="100%"
        onClick={() =>
          canAdd ? fileRef.current?.click() : setIsTooltipShown(true)
        }
        cursor={canAdd ? 'pointer' : 'not-allowed'}
        onMouseEnter={() => setIsTooltipShown(true)}
        onMouseLeave={() => setIsTooltipShown(false)}
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
              disabled={!canAdd}
              _active={
                canAdd ? { color: 'gray.700' } : { color: 'brand.black40' }
              }
            />
          </Square>
        </VStack>
        <Input
          ref={fileRef}
          onChange={handleChange}
          multiple={false}
          type="file"
          accept="image/jpg, image/jpeg, image/png"
          hidden
        />
      </Center>
    </Tooltip>
  );
};
