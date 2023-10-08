import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

const DeleteItemModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text
            pt="6"
            fontSize="14px"
            fontFamily="poppins"
            width="100%"
            textAlign="center"
          >
            Apakah Anda yakin ingin menghapus produk ini dari keranjang belanja?
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack width="100%" spacing="4">
            <Button
              flex="1"
              size="md"
              variant="outline"
              borderWidth="2px"
              borderColor="brand.green"
              _focus={{ outline: 'none' }}
              onClick={onClose}
            >
              <Text fontFamily="poppins" fontSize="14px" color="brand.green">
                Batalkan
              </Text>
            </Button>
            <Button
              onClick={onDelete}
              flex="1"
              size="md"
              _focus={{ outline: 'none' }}
            >
              <Text fontFamily="poppins" fontSize="14px" color="white">
                Hapus
              </Text>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteItemModal;
