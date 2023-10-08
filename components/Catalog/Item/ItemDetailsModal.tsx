import { useEffect } from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { showModal } from '../../../features/items/items-slice';
import { useIsMobile } from '../../../libs/useIsMobile';
import ItemPreview from './ItemPreview/ItemPreview';
import ItemPreviewMobile from './ItemPreview/ItemPreviewMobile';

const ItemDetailsModal = () => {
  const dispatch = useAppDispatch();

  const { selectedItem } = useAppSelector((state) => state.items);

  const isOpen = useAppSelector((state) => state.items.isModalOpen);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen || !window) {
      return;
    }

    const onBack = (e) => {
      e.preventDefault();

      if (isOpen) {
        dispatch(showModal(false));
        return false;
      }

      return true;
    };

    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate', onBack);

    return () => {
      if (window.history.state === null) {
        window.history.back();
      }
      window.removeEventListener('popstate', onBack);
    };
  }, [isOpen]);

  if (!selectedItem) {
    return null;
  }

  return (
    <Modal
      allowPinchZoom
      isOpen={isOpen && !!selectedItem}
      onClose={() => {}}
      size={isMobile ? 'full' : '4xl'}
      scrollBehavior="inside"
      isCentered
      onOverlayClick={() => dispatch(showModal(false))}
    >
      <ModalOverlay />
      <ModalContent
        top="0"
        borderRadius={isMobile ? '0px' : '20px'}
        mx={{ base: '2', sm: '0', md: '4' }}
        my={{ base: '2.5', sm: '0', md: '10' }}
      >
        {!isMobile && (
          <ModalCloseButton
            size="md"
            _focus={{ outline: 'none' }}
            onClick={() => dispatch(showModal(false))}
          />
        )}
        <ModalBody
          px={{ base: '5', sm: '0', lg: '8' }}
          pt={{ base: '12', sm: 0, md: '12' }}
          pb={{ base: '10', sm: '60', md: '8', lg: '8' }}
        >
          {isMobile ? (
            <ItemPreviewMobile item={selectedItem} />
          ) : (
            <ItemPreview item={selectedItem} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemDetailsModal;
