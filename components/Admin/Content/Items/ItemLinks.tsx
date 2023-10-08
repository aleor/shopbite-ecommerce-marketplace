import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import {
    Box, Button, Divider, FormControl, FormHelperText, FormLabel, HStack, Icon, Input, Select, Text,
    VStack
} from '@chakra-ui/react';

import { getLinkDestination, getLinkPlaceholder } from '../../../../libs/getLinkProps';
import { externalItemLinkTypes, ItemLink, ItemLinkType } from '../../../../models';
import { linkUrlIsAllowed } from '../Links/validateExternalUrl';
import ItemLinkRow from './ItemLinkRow';

const ItemLinks = ({
  links = [],
  onItemLinksUpdated,
}: {
  links: ItemLink[];
  onItemLinksUpdated: (links: ItemLink[]) => void;
}) => {
  const [availableLinkTypes, setAvailableLinkTypes] = useState(
    externalItemLinkTypes
      .filter((type) => !links.some((link) => link.type === type))
      .map((type) => ({
        value: type,
        label: getLinkDestination(type),
      }))
  );

  const [itemLinks, setItemLinks] = useState<ItemLink[]>(links || []);

  const [selectedLinkType, setSelectedLinkType] = useState<ItemLinkType>();
  const [selectedLinkUrl, setSelectedLinkUrl] = useState('');

  const [validationError, setValidationError] = useState<
    'none' | 'type' | 'url'
  >('none');

  const onLinkAdd = () => {
    if (!selectedLinkType) {
      setValidationError('type');
      return;
    }

    if (!linkUrlIsAllowed(selectedLinkUrl)) {
      setValidationError('url');
      return;
    }

    const newLink = {
      type: selectedLinkType,
      url: selectedLinkUrl,
    };

    const updatedLinks = [...itemLinks, newLink];

    setItemLinks(updatedLinks);
    setAvailableLinkTypes(
      [...availableLinkTypes].filter((link) => link.value !== selectedLinkType)
    );

    setSelectedLinkType(null);
    setSelectedLinkUrl('');
    setValidationError('none');

    onItemLinksUpdated(updatedLinks);
  };

  const onLinkDelete = (type: ItemLinkType) => {
    const updatedLinks = [...itemLinks].filter((link) => link.type !== type);

    setItemLinks(updatedLinks);
    setAvailableLinkTypes([
      ...availableLinkTypes,
      {
        value: type,
        label: getLinkDestination(type),
      },
    ]);
    onItemLinksUpdated(updatedLinks);
  };

  return (
    <VStack alignItems="flex-start" spacing="4">
      <Text
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize={{ base: '16px', sm: '14px', md: '16px' }}
      >
        Link Pembelian External
      </Text>

      <Box maxWidth="fit-content">
        <Text fontFamily="poppins" fontSize="12px" color="brand.black70">
          Anda bisa menambahkan beberapa link pembelian external sehingga pelanggan Anda dapat membeli juga melalui link tersebut
        </Text>
      </Box>

      {itemLinks.length > 0 &&
        itemLinks.map((link) => (
          <Box key={link.type} width="100%">
            <ItemLinkRow link={link} onLinkDeleted={onLinkDelete} />
          </Box>
        ))}

      <Select
        variant="filled"
        placeholder="Pilih tujuan link"
        onChange={(event) => {
          setSelectedLinkType(event.target.value as ItemLinkType);
        }}
      >
        {availableLinkTypes.map((linkType) => (
          <option key={linkType.value} value={linkType.value}>
            {linkType.label}
          </option>
        ))}
      </Select>

      <FormControl>
        <FormLabel htmlFor="url" fontFamily="poppins" fontSize="12px">
          Alamat link
        </FormLabel>
        <Input
          id="url"
          size="md"
          value={selectedLinkUrl}
          onChange={(e) => {
            setSelectedLinkUrl(e.target.value);
          }}
          noOfLines={2}
          placeholder={getLinkPlaceholder(selectedLinkType)}
          lineHeight="14px"
          resize="none"
          _focus={{ outline: 'none' }}
          _hover={{ borderColor: 'inherit' }}
          spellCheck={false}
          autoComplete="off"
        />
        {validationError === 'url' && (
          <FormHelperText color="brand.red" fontSize="12px">
            Harap pastikan URL atau alamat link dimulai dengan 'http://' atau
            'https://'
          </FormHelperText>
        )}
        {validationError === 'type' && (
          <HStack color="brand.error" fontSize="12px" pt="4" height="4">
            <Icon as={HiOutlineExclamationCircle} />
            <Text color="brand.error">Harap memilih tujuan link terlebih dahulu</Text>
          </HStack>
        )}
      </FormControl>

      <Divider color="brand.black40" />

      <Box w="100%" display="flex" justifyContent="flex-end">
        <Button fontFamily="poppins" w="200px" size="md" onClick={onLinkAdd}>
          Tambahkan
        </Button>
      </Box>
    </VStack>
  );
};

export default ItemLinks;