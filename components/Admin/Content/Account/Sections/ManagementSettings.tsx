import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';

import {
  Button,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

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
        title: 'Status toko Anda berhasil diganti',
      });
    } catch (error) {
      setIsSaving(false);
      showToast({
        status: 'error',
        title: 'Status toko Anda tidak berhasil diganti',
        description: 'Terjadi kesalahan dalam menyimpan, harap mencoba kembali',
      });
    }
  };

  if (!shop) {
    return null;
  }

  return (
    <>
      <VStack spacing="3" alignItems="flex-start" w="100%">
        <SectionHeader title="Manajemen Toko">
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
                ? 'Menyimpan...'
                : shop.isActive
                ? 'Tutup Toko Sementara'
                : 'Buka Toko Kembali'}
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
                ? 'Menyimpan...'
                : shop.isActive
                ? 'Tutup Toko Sementara'
                : 'Buka Toko Kembali'}
            </Button>
          )}
        </SectionHeader>

        <Text
          fontFamily="source"
          fontSize="16px"
          fontWeight="normal"
          color="brand.black40"
        >{`Toko Anda sedang ${shop.isActive ? 'aktif' : 'tutup'}.`}</Text>
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
            ? 'Apakah Anda yakin ingin menutup toko untuk sementara waktu?'
            : 'Apakah Anda yakin ingin membuka toko kembali?'
        }
        confirmButtonLabel={shop?.isActive ? 'Tutup Sementara' : 'Buka Kembali'}
        cancelButtonLabel={'Batalkan'}
      />
    </>
  );
};

export default ManagementSettings;
