import { doc, updateDoc } from 'firebase/firestore';
import { title } from 'process';
import { useContext, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

import {
    Box, Button, FormControl, FormLabel, IconButton, Input, InputGroup, InputLeftAddon,
    InputRightAddon, Text, Textarea, VStack
} from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { shopConverter } from '../../../../../models';
import CharCounter from '../../../../CharCounter';
import { adminSettings } from '../../../adminSettings';
import { ShopContext } from '../../../hooks/shopContext';
import ProfilePhoto from './ProfilePhoto';
import SectionHeader from './SectionHeader';

const GeneralSettings = () => {
  const shop = useContext(ShopContext);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [profileName, setProfileName] = useState(shop?.profileName);
  const [profileDescription, setProfileDescription] = useState(
    JSON.parse(shop?.profileDescription) || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const onSave = async () => {
    setIsSaving(true);

    try {
      const docRef = doc(db, 'shops', shop.id).withConverter(shopConverter);

      await updateDoc(docRef, {
        profileDescription: JSON.stringify(
          profileDescription.substring(
            0,
            adminSettings.profile.maxDescriptionLength
          )
        ),
        profileName: profileName || '',
      });

      setIsSaving(false);
      setMode('view');
      showToast({
        status: 'success',
        title: 'Perubahan berhasil disimpan',
        description: 'Perubahan data akun Anda berhasil disimpan',
      });
    } catch (error) {
      setIsSaving(false);
      showToast({
        status: 'error',
        title: 'Perubahan gagal disimpan',
        description:
          'Terjadi kesalahan dalam menyimpan, harap mencoba kembali',
      });
    }
  };

  return (
    <VStack spacing="6" alignItems="flex-start" w="100%">
      <SectionHeader title="Pengaturan Akun">
        {mode === 'view' ? (
          <IconButton
            icon={<HiOutlinePencil size="20px" />}
            onClick={() => {
              setMode('edit');
            }}
            aria-label={`Edit ${title}`}
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
              _focus={{ outline: 'none' }}
              onClick={onSave}
              loadingText="Menyimpan..."
              display={{ base: 'none', sm: 'flex', md: 'none' }}
            >
              Simpan Perubahan
            </Button>
          </>
        )}
      </SectionHeader>

      <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
        <FormLabel
          htmlFor="profileName"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        >
          Foto Profil
        </FormLabel>

        <ProfilePhoto mode={mode} />
      </FormControl>

      <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
        <FormLabel
          htmlFor="profileName"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        >
          Nama Toko Tertampil
        </FormLabel>
        {mode === 'view' ? (
          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {profileName || '-'}
          </Text>
        ) : (
          <InputGroup size="md">
            <Input
              id="profileName"
              size="md"
              value={profileName}
              onChange={(e) => {
                setProfileName(e.target.value);
              }}
              maxLength={adminSettings.profile.maxNameLength}
              noOfLines={1}
              borderRight="none"
              placeholder="cth. Toko Makmur"
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
                  value={profileName}
                  maxLength={adminSettings.profile.maxNameLength}
                />
              }
            />
          </InputGroup>
        )}
      </FormControl>

      <FormControl>
        <FormLabel
          htmlFor="description"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        >
          Deskripsi Toko
        </FormLabel>
        {mode === 'view' ? (
          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
            as="pre"
            whiteSpace="pre-line"
            w="100%"
          >
            {JSON.parse(shop?.profileDescription) || '-'}
          </Text>
        ) : (
          <>
            <Textarea
              id="profileDescription"
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
              maxLength={adminSettings.profile.maxDescriptionLength}
              placeholder="cth. Menjual kue homemade sejak 2010"
              _focus={{ outline: 'none' }}
              width={{ base: '50%', sm: '100%', md: '50%' }}
            />
            <Box pt="1">
              <CharCounter
                value={profileDescription}
                maxLength={adminSettings.profile.maxDescriptionLength}
                textProps={{ textAlign: 'right' }}
              />
            </Box>
          </>
        )}
      </FormControl>
    </VStack>
  );
};

export default GeneralSettings;
