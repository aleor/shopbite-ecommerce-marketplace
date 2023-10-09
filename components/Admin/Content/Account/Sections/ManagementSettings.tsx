import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';

import { Button, Text, useBreakpointValue, useDisclosure, VStack } from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { shopConverter } from '../../../../../models';
import ConfirmationModal from '../../../ConfirmationModal';
import { ShopContext } from '../../../hooks/shopContext';
import SectionHeader from './SectionHeader';

const ManagementSettings = () => {
  const shop = useContext(ShopContext);

  const { showToast } = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const onSwitchState = async () => {
    setIsSaving(true);

    try {
      const docRef = doc(db, 'shops', shop.id).withConverter(shopConverter);
      const currentState = await getDoc(docRef);

      await updateDoc(docRef, {
        isActive: !currentState.data().isActive,
      });
      setIsSaving(false);
      showToast({
        status: 'success',
        title: 'Your store status was successfully changed',
      });
    } catch (error) {
      setIsSaving(false);
      showToast({
        status: 'error',
        title: 'Your store status was not updated',
        description: 'An error occurred during save, please try again',
      });
    }
  };

  if (!shop) {
    return null;
  }

  return (
    <>
      <VStack spacing="3" alignItems="flex-start" w="100%">
        <SectionHeader title="Shop Management">
          {isMobile ? (
            <Button
              fontFamily="poppins"
              fontSize="12px"
              variant="outline"
              borderColor="brand.green"
              color="brand.green"
              borderRadius="20px"
              px="8px"
              size="sm"
              height="1.5"
              isDisabled={isSaving}
              _focus={{ outline: 'none' }}
              onClick={onOpen}
            >
              {isSaving
                ? 'Saving...'
                : shop.isActive
                ? 'Temporarily Close Shop'
                : 'Reopen Shop'}
            </Button>
          ) : (
            <Button
              fontFamily="poppins"
              minWidth="200px"
              size="sm"
              onClick={onOpen}
              isDisabled={isSaving}
            >
              {isSaving
                ? 'Saving...'
                : shop.isActive
                ? 'Temporarily Close Shop'
                : 'Reopen Shop'}
            </Button>
          )}
        </SectionHeader>

        <Text
          fontFamily="source"
          fontSize="16px"
          fontWeight="normal"
          color="brand.black40"
        >{`Your shop is ${shop.isActive ? 'active' : 'closed'}.`}</Text>
      </VStack>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        onConfirm={() => {
          onClose();
          onSwitchState();
        }}
        title=""
        message={
          shop.isActive
            ? 'Are you sure you want to close your shop for a while?'
            : 'Are you sure you want to reopen the shop?'
        }
        confirmButtonLabel={shop?.isActive ? 'Temporarily Close' : 'Reopen Shop'}
        cancelButtonLabel={'Cancel'}
      />
    </>
  );
};

export default ManagementSettings;
