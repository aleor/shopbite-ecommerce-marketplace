import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { ItemVariant } from '../../../../models';
import { adminSettings } from '../../adminSettings';
import ItemPriceField from './ItemPriceField';
import ItemVariantForm from './ItemVariantForm';
import ItemVariantRow from './ItemVariantRow';

const ItemVariants = ({
  basePrice,
  onChange,
  itemVariants = [],
}: {
  basePrice: number | null;
  onChange: (value: number | null, variants: ItemVariant[]) => void;
  itemVariants: ItemVariant[];
}) => {
  const [price, setPrice] = useState(basePrice);
  const [variants, setVariants] = useState(itemVariants);
  const [currentVariant, setCurrentVariant] = useState<ItemVariant | null>(
    null
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [mode, setMode] = useState<
    'basePrice' | 'showVariantForm' | 'limitReached' | 'hideVariantForm'
  >('basePrice');

  const [error, setError] = useState<'missing_data' | 'name_exists' | null>(
    null
  );

  useEffect(() => {
    onChange(price, variants);
    const hasVariants = variants.length > 0;

    if (!hasVariants) {
      setMode('basePrice');
      return;
    }

    const limitReached = variants.length >= adminSettings.item.maxVariants;

    if (limitReached) {
      setMode('limitReached');
      return;
    }

    setMode('showVariantForm');
  }, [variants, price]);

  const onDelete = (variantId: string) => {
    const newVariants = [...variants.filter((v) => v.id !== variantId)];
    setVariants(newVariants);
  };

  const onAdd = () => {
    if (!currentVariant?.label?.length || !currentVariant?.price) {
      setError('missing_data');
      onOpen();
      return;
    }

    const nameExists = variants.some(
      (v) => v.label.toLowerCase() === currentVariant?.label?.toLowerCase()
    );

    if (nameExists) {
      setError('name_exists');
      onOpen();
      return;
    }

    const newVariants = [...variants, { ...currentVariant, id: v4() }];
    setVariants(newVariants);
    setCurrentVariant(null);
  };

  return (
    <>
      <VStack w="100%" alignItems="flex-start" spacing="2">
        <Text
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        >
          Harga<sup>*</sup>
        </Text>

        <Box maxWidth="fit-content">
          <Text fontFamily="poppins" fontSize="12px" color="brand.black70">
            Kamu bisa menambahkan beberapa pilihan varian beserta harga masing-masing varian dengan click tulisan "Tambah varian produk" dibawah.
          </Text>
        </Box>

        {variants.length === 0 && mode !== 'showVariantForm' && (
          <FormControl>
            <ItemPriceField price={price} onChange={setPrice} />
          </FormControl>
        )}

        {variants.length > 0 &&
          variants.map((variant) => (
            <Box key={variant.label} w="100%">
              <ItemVariantRow itemVariant={variant} onDelete={onDelete} />
            </Box>
          ))}

        {mode !== 'showVariantForm' && mode !== 'limitReached' && (
          <Box w="100%" display="flex" justifyContent="flex-end" pt="2">
            <Button
              variant="link"
              fontFamily="poppins"
              fontSize="14px"
              fontWeight="medium"
              color="brand.green"
              _focus={{ outline: 'none' }}
              onClick={() => {
                setMode('showVariantForm');
              }}
            >
              Tambah varian produk
            </Button>
          </Box>
        )}

        {mode === 'showVariantForm' && (
          <ItemVariantForm
            onSubmit={onAdd}
            onBack={() => {
              setMode('hideVariantForm');
            }}
            variant={currentVariant}
            onChange={setCurrentVariant}
          />
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
                ? 'Pastikan Kamu sudah mengisi nama varian berserta harganya'
                : 'Produk ini sudah memiliki varian dengan nama yang sama, nama setiap varian harus berbeda'}
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
                Oke
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemVariants;
