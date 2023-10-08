import {
    Button, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text
} from '@chakra-ui/react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonLabel,
  cancelButtonLabel,
  size,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size={size ?? 'xs'}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
          <Text fontFamily="poppins" fontSize="14px" textAlign="center">
            {title}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text
            fontSize="14px"
            fontFamily="poppins"
            width="100%"
            textAlign="center"
          >
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack width="100%" spacing="4">
            <Button
              onClick={onClose}
              variant="outline"
              borderColor="brand.green"
              borderWidth="2px"
              flex="1"
              size="md"
              _focus={{ outline: 'none' }}
            >
              <Text fontFamily="poppins" fontSize="14px" color="brand.green">
                {cancelButtonLabel}
              </Text>
            </Button>
            <Button
              flex="1"
              size="md"
              _focus={{ outline: 'none' }}
              onClick={onConfirm}
            >
              <Text fontFamily="poppins" fontSize="14px" color="white">
                {confirmButtonLabel}
              </Text>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
