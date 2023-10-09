import { useCallback, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

import {
    Button, FormControl, FormHelperText, FormLabel, HStack, IconButton, Input, InputGroup,
    InputRightAddon, Link, Stack, Text, useDisclosure, VStack
} from '@chakra-ui/react';

import { Destination } from '../../../../../models';
import CharCounter from '../../../../CharCounter';
import { adminSettings } from '../../../adminSettings';
import ConfirmationModal from '../../../ConfirmationModal';
import { linkUrlIsAllowed } from '../validateExternalUrl';

const LinkDestination = ({
  destination,
  onSave,
  onDelete,
}: {
  destination: Destination;
  onSave: (destination: Destination) => void;
  onDelete: (destinationId: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(destination.label);
  const [url, setUrl] = useState(destination.url);

  const urlIsAllowed = useCallback(
    (value: string) => {
      return linkUrlIsAllowed(value || url);
    },
    [url]
  );

  const [isUrlValid, setIsUrlValid] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const saveLink = () => {
    onSave({
      id: destination.id,
      label,
      url,
    });
    setIsEditing(false);
  };

  const deleteLink = () => {
    onDelete(destination.id);
    setIsEditing(false);
  };

  const renderContent = () => {
    if (!isEditing) {
      return (
        <>
          <Text
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize="14px"
            noOfLines={1}
          >
            {destination.label}
          </Text>

          <Link
            isExternal
            fontFamily="source"
            fontWeight="normal"
            fontSize="14px"
            href={destination.url}
            _focus={{ outline: 'none' }}
          >
            {destination.url}
          </Link>
        </>
      );
    }

    return (
      <>
        <FormControl width="100%">
          <FormLabel
            htmlFor="label"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '12px', md: '16px' }}
          >
            Link<sup>*</sup>
          </FormLabel>
          <Input
            id="label"
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
              Please ensure the URL or link address starts with 'http://' or
              'https://'
            </FormHelperText>
          )}
        </FormControl>

        <FormControl width="100%" pb="4">
          <FormLabel
            htmlFor="description"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '12px', md: '16px' }}
          >
            <HStack spacing={2}>
              <Text>Link Label</Text>
              <Text
                fontFamily="source"
                fontSize="14px"
                fontWeight="normal"
                color="brand.black40"
              >
                (Optional)
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
      </>
    );
  };

  return (
    <>
      <Stack
        width="100%"
        alignItems="flex-start"
        direction={isEditing ? 'column' : 'row'}
      >
        <VStack
          key={destination.id}
          spacing={isEditing ? '6' : '1'}
          alignItems="flex-start"
          flex="1"
          width="100%"
        >
          {renderContent()}
        </VStack>

        {!isEditing && (
          <IconButton
            icon={<HiOutlinePencil size="20px" />}
            onClick={() => {
              setIsEditing(true);
            }}
            aria-label="Edit link"
            variant="ghost"
            color="brand.green"
            _focus={{ outline: 'none' }}
            size="sm"
          />
        )}

        {isEditing && (
          <HStack spacing="4" width="100%" justifyContent="flex-end">
            <Button
              onClick={saveLink}
              variant="ghost"
              color="brand.green"
              size="md"
              _focus={{ outline: 'none' }}
              ml="4"
              aria-label="Simpan link"
              isDisabled={url?.length === 0 || !isUrlValid}
            >
              Save
            </Button>
            <Button
              onClick={onOpen}
              variant="ghost"
              color="brand.red"
              size="md"
              _focus={{ outline: 'none' }}
              ml="4"
              aria-label="Delete link"
            >
              Delete
            </Button>
          </HStack>
        )}
      </Stack>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          onClose();
          deleteLink();
        }}
        title={'Are you sure you want to delete this link?'}
        message={
          'Deleted links cannot be restored. The analytics data recorded for the deleted link will remain.'
        }
        confirmButtonLabel={'Delete'}
        cancelButtonLabel={'Cancel'}
      />
    </>
  );
};

export default LinkDestination;
