import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { AdminContactType, shopConverter } from '../../../../../models';
import CharCounter from '../../../../CharCounter';
import InfoButtonWithTooltip from '../../../../InfoButtonWithTooltip';
import { adminSettings } from '../../../adminSettings';
import { ShopContext } from '../../../hooks/shopContext';
import SectionHeader from './SectionHeader';

const ShopSettings = () => {
  const shop = useContext(ShopContext);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [contactCaption, setContactCaption] = useState(
    shop?.contactCaption || ''
  );
  const [contactType, setContactType] = useState<AdminContactType>(
    shop?.adminDestination || AdminContactType.WA
  );
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (!shop) {
      return;
    }

    if (shop.adminDestination === AdminContactType.WA) {
      const number = shop.adminContactId?.startsWith('+62')
        ? shop.adminContactId.slice(3)
        : shop.adminContactId;

      setContactNumber(number);
    }

    if (shop.adminDestination === AdminContactType.MAIL) {
      setContactEmail(shop.adminContactId);
    }
  }, [shop]);

  const renderAdminContact = useCallback(() => {
    if (!shop) {
      return null;
    }

    const destination =
      shop.adminDestination === AdminContactType.WA ? 'WhatsApp' : 'Email';

    return `${destination} ${shop.adminContactId}`;
  }, [shop]);

  const onSave = async () => {
    if (
      (contactType === AdminContactType.WA && !contactNumber?.length) ||
      (contactType === AdminContactType.MAIL && !contactEmail?.length)
    ) {
      showToast({
        title: 'Kontak admin toko wajib diisi',
        description:
          'Harap mengisi kontak admin toko agar pelanggan Anda dapat menghubungi Anda',
        status: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const docRef = doc(db, 'shops', shop.id).withConverter(shopConverter);

      await updateDoc(docRef, {
        adminDestination: contactType,
        adminContactId:
          contactType === AdminContactType.WA
            ? `+62${contactNumber}`
            : contactEmail,
        contactCaption,
      });

      showToast({
        title: 'Berhasil menyimpan pengaturan toko',
        description: 'Perubahan pada toko Anda telah berhasil disimpan',
        status: 'success',
      });

      setIsSaving(false);
      setMode('view');
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Gagal menyimpan pengaturan toko',
        description: 'Terjadi kesalahan dalam menyimpan, harap mencoba kembali',
        status: 'error',
      });
    }
  };

  const renderViewMode = useCallback(() => {
    return (
      <>
        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="shopAdmin"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Kontak Admin Toko<sup>*</sup>
          </FormLabel>

          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {renderAdminContact()}
          </Text>
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="contactCaption"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Pesan Pembelian dari Pelanggan
          </FormLabel>

          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {shop?.contactCaption || '-'}
          </Text>
        </FormControl>
      </>
    );
  }, [shop]);

  const renderEditMode = () => {
    return (
      <>
        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="shopAdmin"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Kontak Admin Toko<sup>*</sup>
          </FormLabel>

          <RadioGroup defaultValue={contactType} name="contactType" pt="2">
            <HStack spacing="8">
              <Radio
                value={AdminContactType.WA}
                fontWeight="normal"
                fontFamily="source"
                onChange={(e) =>
                  setContactType(e.target.value as AdminContactType)
                }
              >
                WhatsApp
              </Radio>

              <Radio
                value={AdminContactType.MAIL}
                fontWeight="normal"
                fontFamily="source"
                onChange={(e) =>
                  setContactType(e.target.value as AdminContactType)
                }
              >
                Mail
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="contactId"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            <HStack>
              <Text>
                {contactType === AdminContactType.WA
                  ? 'Nomor Telepon Whatsapp'
                  : 'Email'}
              </Text>
              <InfoButtonWithTooltip label="Pelanggan Anda akan diarahkan ke admin toko Anda setelah melakukan checkout pembelian" />
            </HStack>
          </FormLabel>

          {contactType === AdminContactType.WA ? (
            <InputGroup size="md">
              <InputLeftAddon children="+62" />
              <Input
                id="contactId"
                size="md"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                }}
                noOfLines={1}
                placeholder="812-3456-7890"
                lineHeight="14px"
                resize="none"
                _focus={{ outline: 'none' }}
                _hover={{ borderColor: 'inherit' }}
                spellCheck={false}
                autoComplete="off"
                type="tel"
              />
            </InputGroup>
          ) : (
            <Input
              id="contactId"
              size="md"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
              }}
              noOfLines={1}
              placeholder="cth. contoh@gmail.com"
              lineHeight="14px"
              resize="none"
              _focus={{ outline: 'none' }}
              _hover={{ borderColor: 'inherit' }}
              spellCheck={false}
              autoComplete="off"
              type="email"
            />
          )}
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="contactCaption"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            <HStack>
              <Text>Pesan Pembelian dari Pelanggan</Text>
              <Text
                fontFamily="source"
                fontWeight="normal"
                color="brand.black40"
                fontSize="14px"
              >
                (Opsional)
              </Text>
              <InfoButtonWithTooltip label="Ini adalah pesan yang akan dikirimkan pelanggan Anda ketika melakukan pembelian" />
            </HStack>
          </FormLabel>

          <InputGroup size="md">
            <Input
              id="contactCaption"
              size="md"
              value={contactCaption}
              onChange={(e) => {
                setContactCaption(e.target.value);
              }}
              maxLength={adminSettings.profile.maxContactCaptionLength}
              noOfLines={1}
              borderRight="none"
              placeholder="cth. Halo, saya ingin memesan barang ini, apakah tersedia?"
              lineHeight="14px"
              resize="none"
              _focus={{ outline: 'none' }}
              _hover={{ borderColor: 'inherit' }}
              spellCheck={false}
              autoComplete="off"
              isInvalid={false}
            />
            <InputRightAddon
              borderRightRadius="8px"
              backgroundColor="white"
              borderLeft="none"
              children={
                <CharCounter
                  value={contactCaption}
                  maxLength={adminSettings.profile.maxContactCaptionLength}
                />
              }
            />
          </InputGroup>
        </FormControl>
      </>
    );
  };

  return (
    <VStack spacing="6" alignItems="flex-start" w="100%">
      <SectionHeader title="Pengaturan Toko">
        {mode === 'view' ? (
          <IconButton
            icon={<HiOutlinePencil size="20px" />}
            onClick={() => {
              setMode('edit');
            }}
            aria-label="Ubah Pengaturan Toko"
            variant="ghost"
            color="brand.green"
            _focus={{ outline: 'none' }}
            size="sm"
          />
        ) : (
          <>
            <Button
              fontFamily="poppins"
              minWidth="200px"
              size="sm"
              onClick={onSave}
              display={{ base: 'flex', sm: 'none', md: 'flex' }}
              isDisabled={isSaving}
              isLoading={isSaving}
              loadingText="Menyimpan..."
            >
              Simpan Perubahan
            </Button>

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
              isLoading={isSaving}
              loadingText="Menyimpan..."
              _focus={{ outline: 'none' }}
              onClick={onSave}
              display={{ base: 'none', sm: 'flex', md: 'none' }}
            >
              Simpan Perubahan
            </Button>
          </>
        )}
      </SectionHeader>
      {mode === 'view' ? renderViewMode() : renderEditMode()}
    </VStack>
  );
};

export default ShopSettings;
