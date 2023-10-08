import { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { Link } from '../../../../../models';
import { LinkType } from '../../../../../models/linkType';
import CharCounter from '../../../../CharCounter';
import { adminSettings } from '../../../adminSettings';
import { linkUrlIsAllowed } from '../validateExternalUrl';
import { destinations } from './destinations';
import LinkDestinationsDrawer from './LinkDestinationsDrawer';

const NewExternalLink = ({
  destinationsPerLinkExceeded,
  linkTypesExceeded,
  nextLinkOrder,
  onChange,
}: {
  destinationsPerLinkExceeded: boolean;
  linkTypesExceeded: boolean;
  nextLinkOrder: number;
  onChange: (link: Link) => void;
}) => {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [linkType, setLinkType] = useState<LinkType | null>(null);

  const urlIsAllowed = useCallback(
    (value: string) => {
      return linkUrlIsAllowed(value || url);
    },
    [url]
  );

  const [isUrlValid, setIsUrlValid] = useState(true);

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    onChange({
      type: linkType,
      ordering: nextLinkOrder,
      destinations: [
        {
          id: v4(),
          label,
          url,
        },
      ],
    });
  }, [url, label, linkType]);

  const renderLinkLabel = useCallback(() => {
    const link = destinations
      .flatMap((group) => group.destinations)
      .find((link) => link.value === linkType);

    if (!link) {
      return <Text>{linkType}</Text>;
    }

    return (
      <HStack>
        <Text color="brand.green">{link.label}</Text>
        <Icon as={link.icon} />
      </HStack>
    );
  }, [linkType]);

  return (
    <>
      <HStack spacing="6">
        <Text fontFamily="poppins" fontWeight="semibold" fontSize="20px">
          Destinasi Link
        </Text>

        {!linkType && (
          <Button
            size="xs"
            borderRadius="20px"
            fontFamily="poppins"
            fontSize="14px"
            _focus={{ outline: 'none' }}
            onClick={onOpen}
          >
            Pilih
          </Button>
        )}

        {linkType && (
          <Button
            size="xs"
            fontFamily="poppins"
            fontSize="14px"
            variant="ghost"
            _focus={{ outline: 'none' }}
            onClick={onOpen}
            color="brand.green"
          >
            {renderLinkLabel()}
          </Button>
        )}

        <Text
          fontFamily="source"
          fontWeight="semibold"
          fontSize="12px"
          color="brand.error"
        >
          (wajib dipilih)
        </Text>
      </HStack>

      {(linkTypesExceeded || destinationsPerLinkExceeded) && (
        <Text
          fontFamily="source"
          fontSize="14px"
          fontWeight="normal"
          color="brand.error"
        >
          {linkTypesExceeded
            ? 'Kamu hanya bisa menambahkan hingga 10 jenis tujuan link yang berbeda'
            : 'Kamu hanya bisa menambahkan 10 link dengan jenis tujuan yang sama'}
        </Text>
      )}

      <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
        <FormLabel
          htmlFor="url"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '16px', sm: '12px', md: '16px' }}
        >
          Link<sup>*</sup>
        </FormLabel>

        <InputGroup>
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
        </InputGroup>
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

      <FormControl width={{ base: '50%', sm: '100%', md: '50%' }} pb="10">
        <FormLabel
          htmlFor="label"
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
            id="label"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            maxLength={adminSettings.links.maxExternalLinkLabelLength}
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
                maxLength={adminSettings.links.maxExternalLinkLabelLength}
              />
            }
          />
        </InputGroup>
      </FormControl>

      <LinkDestinationsDrawer
        isOpen={isOpen}
        onClose={onClose}
        onSelect={setLinkType}
        type={linkType}
      />
    </>
  );
};

export default NewExternalLink;
