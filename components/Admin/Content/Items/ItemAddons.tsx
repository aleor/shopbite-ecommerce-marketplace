import { useState } from 'react';
import { v4 } from 'uuid';

import {
    Box, Button, FormControl, FormLabel, HStack, Input, InputGroup, InputRightAddon, Modal,
    ModalBody, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure, VStack
} from '@chakra-ui/react';

import { ItemAddOn } from '../../../../models';
import CharCounter from '../../../CharCounter';
import { adminSettings } from '../../adminSettings';
import ItemAddonRow from './ItemAddonRow';
import ItemPriceField from './ItemPriceField';

const ItemAddOns = ({
  addons = [],
  onChange,
}: {
  addons: ItemAddOn[];
  onChange: (addons: ItemAddOn[]) => void;
}) => {
  const [itemAddOns, setItemAddOns] = useState<ItemAddOn[]>(addons || []);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [error, setError] = useState<'missing_data' | 'name_exists' | null>(
    null
  );

  const limitReached = itemAddOns.length >= adminSettings.item.maxAddons;

  const onAddonAdd = () => {
    if (!label.length) {
      setError('missing_data');
      onOpen();
      return;
    }

    const nameExists = itemAddOns.some(
      (a) => a.label.toLowerCase() === label.toLowerCase()
    );

    if (nameExists) {
      setError('name_exists');
      onOpen();
      return;
    }

    const newAddon = {
      id: v4(),
      label,
      price,
    };

    const updatedAddOns = [...itemAddOns, newAddon];

    setItemAddOns(updatedAddOns);

    onChange(updatedAddOns);
    setLabel('');
    setPrice(0);
  };

  const onDelete = (id: string) => {
    const updatedAddOns = itemAddOns.filter((item) => item.id !== id);

    setItemAddOns(updatedAddOns);

    onChange(updatedAddOns);
  };

  return (
    <>
      <VStack w="100%" alignItems="flex-start" spacing="4">
        <HStack fontSize={{ base: '16px', sm: '14px', md: '16px' }} spacing="4">
          <Text fontFamily="poppins" fontWeight="semibold">
            Additional products (Add-ons)
          </Text>

          <Text fontFamily="source" fontWeight="normal" color="brand.black40">
            (Optional)
          </Text>
        </HStack>

        <Box maxWidth="fit-content">
          <Text fontFamily="poppins" fontSize="12px" color="brand.black70">
            You can add some additional products such as toppings,
            greeting cards, paper bags, and more.
          </Text>
        </Box>

        {itemAddOns.length > 0 &&
          itemAddOns.map((itemAddon) => (
            <Box key={itemAddon.label} w="100%">
              <ItemAddonRow itemAddon={itemAddon} onDelete={onDelete} />
            </Box>
          ))}

        {!limitReached && (
          <>
            <FormControl>
              <FormLabel htmlFor="url" fontFamily="poppins" fontSize="12px">
                Add-on title
              </FormLabel>
              <InputGroup size="md">
                <Input
                  id="title"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                  }}
                  noOfLines={1}
                  placeholder="cth. Extra saus"
                  lineHeight="14px"
                  resize="none"
                  _focus={{ outline: 'none' }}
                  _hover={{ borderColor: 'inherit' }}
                  spellCheck={false}
                  autoComplete="off"
                  borderRight="none"
                  maxLength={adminSettings.item.maxAddonTitleLength}
                />

                <InputRightAddon
                  borderRightRadius="8px"
                  backgroundColor="white"
                  borderLeft="none"
                  children={
                    <CharCounter
                      value={label}
                      maxLength={adminSettings.item.maxAddonTitleLength}
                    />
                  }
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="price" fontFamily="poppins" fontSize="12px">
                Price
              </FormLabel>
              <ItemPriceField
                price={price}
                placeholder="Leave blank if this add-on product is free"
                onChange={setPrice}
              />
            </FormControl>

            <Button
              color="brand.green"
              textColor="white"
              onClick={onAddonAdd}
              size="md"
              alignSelf="flex-end"
            >
              Save
            </Button>
          </>
        )}
      </VStack>

      <Modal onClose={onClose} isOpen={isOpen} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Text
              pt="6"
              fontSize="14px"
              fontFamily="poppins"
              fontWeight="medium"
              width="100%"
              textAlign="center"
            >
              {error === 'missing_data'
                ? 'Make sure you have filled in the add-on product name'
                : 'This product already has add-ons with the same name, the name of each additional product must be different'}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              flex="1"
              size="md"
              borderWidth="2px"
              borderColor="brand.green"
              _focus={{ outline: 'none' }}
              onClick={onClose}
            >
              <Text fontFamily="poppins" fontSize="14px" color="white">
                OK
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemAddOns;
