import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { Shop, shopConverter } from '../../../../../models';
import CharCounter from '../../../../CharCounter';
import { adminSettings } from '../../../adminSettings';
import ConfirmationModal from '../../../ConfirmationModal';
import { linkUrlIsAllowed } from '../validateExternalUrl';

type BioLinkPageMode = 'view' | 'set' | 'edit';

const BioLinks = ({
  shop,
  onSaveStart,
  onSaveEnd,
}: {
  shop: Shop;
  onSaveStart: () => void;
  onSaveEnd: () => void;
}) => {
  const [url, setUrl] = useState(shop.websiteUrl || '');
  const [label, setLabel] = useState(shop.websiteLabel || '');
  const [bioLinkPageMode, setBioLinkPageMode] = useState<BioLinkPageMode>(
    shop.websiteUrl ? 'view' : 'set'
  );
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [isSaveEnabled, setIsSaveEnabled] = useState(
    url?.length > 0 && isUrlValid
  );

  const { showToast } = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const urlIsAllowed = useCallback(
    (value: string) => {
      return linkUrlIsAllowed(value || url);
    },
    [url]
  );

  useEffect(() => {
    const isValid = urlIsAllowed(url);
    setIsSaveEnabled(url?.length > 0 && isValid);
  }, [url]);

  const save = async ({ url, label }: { url: string; label: string }) => {
    const docRef = doc(db, 'shops', shop.id).withConverter(shopConverter);

    await updateDoc(docRef, {
      websiteUrl: url,
      websiteLabel: label,
    });
  };

  const onSave = async () => {
    try {
      onSaveStart();
      await save({ url: url, label: label });
      onSaveEnd();
      setBioLinkPageMode('view');
    } catch (error) {
      onSaveEnd();
      showToast({
        title: 'Gagal menyimpan link',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const onBioLinkButtonClick = () => {
    if (bioLinkPageMode === 'view') {
      setBioLinkPageMode('edit');
      return;
    }

    onSave();
  };

  const onDelete = async () => {
    try {
      onSaveStart();
      await save({ url: '', label: '' });

      setLabel('');
      setUrl('');

      onSaveEnd();
      setBioLinkPageMode('set');
    } catch (error) {
      onSaveEnd();
      showToast({
        title: 'Gagal menghapus link',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const renderContent = () => {
    if (bioLinkPageMode === 'view') {
      return (
        <>
          <Text fontFamily="poppins" fontWeight="semibold" fontSize="16px">
            {label}
          </Text>

          <Link
            href={url}
            isExternal
            flex="1"
            fontFamily="source"
            fontWeight="normal"
            fontSize="14px"
          >
            {url}
          </Link>
        </>
      );
    }

    return (
      <>
        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="url"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '12px', md: '16px' }}
          >
            Link<sup>*</sup>
          </FormLabel>
          <Input
            id="url"
            size="md"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setIsUrlValid(urlIsAllowed(e.target.value));
            }}
            noOfLines={2}
            placeholder="cth. https://www.example.com"
            lineHeight="14px"
            resize="none"
            _focus={{ outline: 'none' }}
            _hover={{ borderColor: 'inherit' }}
            spellCheck={false}
            autoComplete="off"
            isInvalid={!isUrlValid}
          />
          {!isUrlValid && (
            <FormHelperText
              color="brand.red"
              fontSize={{ base: '14px', sm: '12px', md: '14px' }}
            >
              Harap pastikan URL atau alamat link dimulai dengan 'http://' atau
              'https://'
            </FormHelperText>
          )}
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="description"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '12px', md: '16px' }}
          >
            <HStack spacing={2}>
              <Text>Label Link</Text>
              <Text
                fontFamily="source"
                fontSize="14px"
                fontWeight="normal"
                color="brand.black40"
              >
                (Opsional)
              </Text>
            </HStack>
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="description"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
              }}
              maxLength={adminSettings.links.maxBioLinkLabelLength}
              noOfLines={1}
              lineHeight="14px"
              resize="none"
              borderRight="none"
              placeholder="cth. Website Kami"
              _focus={{ outline: 'none' }}
              _hover={{ borderColor: 'inherit' }}
            />
            <InputRightAddon
              borderRightRadius="8px"
              backgroundColor="white"
              borderLeft="none"
              children={
                <CharCounter
                  value={label}
                  maxLength={adminSettings.links.maxBioLinkLabelLength}
                />
              }
            />
          </InputGroup>
        </FormControl>

        <Box
          pt="2"
          width="100%"
          display={{ base: 'none', sm: 'flex', md: 'none' }}
        >
          <Button
            fontFamily="poppins"
            width="100%"
            size="md"
            onClick={onBioLinkButtonClick}
            isDisabled={!isSaveEnabled}
          >
            Set link bio
          </Button>
        </Box>
      </>
    );
  };

  return (
    <>
      <VStack
        spacing="6"
        alignItems="flex-start"
        pb="6"
        px={{ base: 0, sm: 2, md: 0 }}
      >
        <HStack
          width="100%"
          justifyContent={{
            base: 'space-around',
            sm: 'space-between',
            lg: 'left',
          }}
          spacing={{ base: 8, sm: 2, md: 8 }}
        >
          <HStack
            spacing={{ base: '4', sm: '2', lg: '4' }}
            width="100%"
            justifyContent={{
              base: 'space-around',
              sm: 'space-between',
              lg: 'left',
            }}
          >
            <HStack spacing={{ base: 6, sm: 3, md: 6 }}>
              <Heading
                as="h4"
                fontFamily="poppins"
                fontWeight="semibold"
                fontSize={{ base: '24px', sm: '16px', md: '24px' }}
              >
                Link Bio
              </Heading>
              <Text
                fontFamily="source"
                fontSize="14px"
                fontWeight="normal"
                color="brand.black40"
              >
                Akan ditampilkan dibawah deskripsi toko
              </Text>
            </HStack>
          </HStack>
          <HStack spacing={{ base: 12, sm: 3, md: 12 }}>
            {bioLinkPageMode === 'edit' && (
              <>
                <Button
                  size="md"
                  variant="ghost"
                  color="brand.red"
                  fontFamily="poppins"
                  fontWeight="medium"
                  display={{ base: 'flex', sm: 'none', md: 'flex' }}
                  _focus={{ outline: 'none' }}
                  onClick={onOpen}
                >
                  Hapus link
                </Button>

                <IconButton
                  icon={<HiOutlineTrash size="24px" />}
                  aria-label="Delete Link"
                  variant="ghost"
                  color="brand.red"
                  _focus={{ outline: 'none' }}
                  display={{ base: 'none', sm: 'flex', md: 'none' }}
                  onClick={onOpen}
                  size="sm"
                />
              </>
            )}

            <Button
              fontFamily="poppins"
              minWidth="200px"
              size="md"
              onClick={onBioLinkButtonClick}
              display={{ base: 'flex', sm: 'none', md: 'flex' }}
              isDisabled={bioLinkPageMode !== 'view' && !isSaveEnabled}
            >
              {bioLinkPageMode === 'view' ? 'Edit link bio' : 'Set link bio'}
            </Button>

            {bioLinkPageMode === 'view' && (
              <IconButton
                icon={<HiOutlinePencil size="20px" />}
                onClick={onBioLinkButtonClick}
                aria-label="Edit link"
                variant="ghost"
                color="brand.green"
                _focus={{ outline: 'none' }}
                display={{ base: 'none', sm: 'flex', md: 'none' }}
                size="sm"
              />
            )}
          </HStack>
        </HStack>

        {renderContent()}
      </VStack>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          onClose();
          onDelete();
        }}
        title={'Apakah kamu yakin ingin menghapus link ini?'}
        message={
          'Link yang dihapus tidak dapat dikembalikan. Data analitik yang telah tercatat untuk link yang dihapus akan tetap tersimpan.'
        }
        confirmButtonLabel={'Hapus'}
        cancelButtonLabel={'Batalkan'}
      />
    </>
  );
};

export default BioLinks;
