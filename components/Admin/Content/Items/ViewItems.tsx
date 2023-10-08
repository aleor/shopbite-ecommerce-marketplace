import { useMemo, useState } from 'react';
import { HiOutlineFilter, HiSearch, HiX } from 'react-icons/hi';

import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import {
  FilterOptions,
  Item,
  ItemStatus,
  sortByNameAsc,
  sortByNameDesc,
  sortByPriceAsc,
  sortByPriceDesc,
} from '../../../../models';
import { SearchIcon } from '../../../Icons/SearchIcon';
import InfoButtonWithTooltip from '../../../InfoButtonWithTooltip';
import CollectionItemCard from '../Collections/CollectionItemCard';
import ItemsFilter from './ItemsFilter';

const ViewItems = ({
  items,
  canAddNonHiddenItems,
  onAddNewItem,
  onEditItem,
}: {
  items: Item[];
  canAddNonHiddenItems: boolean;
  onAddNewItem: () => void;
  onEditItem: (item: Item) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const minPrice = useMemo(() => {
    return items?.sort((a, b) => a.price - b.price)[0]?.price || 0;
  }, [items]);

  const maxPrice = useMemo(() => {
    return items?.sort((a, b) => b.price - a.price)[0]?.price || 0;
  }, [items]);

  const initialFilterOptions: FilterOptions = {
    sortBy: 'nameAsc',
    filterBy: {
      status: [ItemStatus.available, ItemStatus.disabled, ItemStatus.hidden],
      minPrice,
      maxPrice,
    },
  };

  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const sort: {
    [key in FilterOptions['sortBy']]: (items: Item[]) => Item[];
  } = {
    nameAsc: useMemo(() => sortByNameAsc, [items]),
    nameDesc: useMemo(() => sortByNameDesc, [items]),
    priceAsc: useMemo(() => sortByPriceAsc, [items]),
    priceDesc: useMemo(() => sortByPriceDesc, [items]),
  };

  const filteredItems = useMemo(() => {
    const findItems = () => {
      if (!searchTerm) {
        return [...items];
      }

      return [...items].filter((item) => {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
    };

    const filterItems = (items: Item[]) => {
      if (!isFilterApplied) {
        return items;
      }

      return items.filter((item) => {
        return (
          filterOptions.filterBy.status.includes(item.status) &&
          item.price >= filterOptions.filterBy.minPrice &&
          item.price <= filterOptions.filterBy.maxPrice
        );
      });
    };

    const foundAndFilteredItems = filterItems(findItems());

    const sortedItems = sort[filterOptions.sortBy](foundAndFilteredItems);

    return sortedItems;
  }, [searchTerm, filterOptions, items]);

  const disabledItems = items.filter(
    (item) => item.status === ItemStatus.disabled
  );
  const availableItems = items.filter(
    (item) => item.status === ItemStatus.available
  );
  const hiddenItems = items.filter((item) => item.status === ItemStatus.hidden);

  const onApplyFilter = (filterOptions: FilterOptions) => {
    setIsFilterApplied(true);
    setFilterOptions(filterOptions);
    setIsFilterOpen(false);
  };

  const onClearFilter = () => {
    setIsFilterApplied(false);
    setFilterOptions(initialFilterOptions);
  };

  if (!items.length) {
    return (
      <VStack spacing="8" pt="20">
        <Icon as={SearchIcon} width="42px" height="54px" />
        <Text
          fontSize="14px"
          fontWeight="normal"
          fontFamily="poppins"
          color="brand.black70"
        >
          Kamu masih belum memiliki produk apapun.
        </Text>
        <Button fontFamily="poppins" minWidth="280px" onClick={onAddNewItem}>
          Buat produk pertama saya
        </Button>
      </VStack>
    );
  }

  return (
    <>
      <Box>
        {isMobile && (
          <Button
            color="brand.green"
            textColor="white"
            onClick={onAddNewItem}
            size="md"
            width="100%"
            fontFamily="poppins"
            fontSize="14px"
            mb="4"
            display={{ base: 'none', sm: 'flex', md: 'none' }}
            disabled={!canAddNonHiddenItems}
          >
            Tambah Produk Baru
          </Button>
        )}
        <HStack
          width="100%"
          justifyContent={{
            base: 'space-around',
            sm: 'space-between',
            lg: 'left',
          }}
          spacing="8"
        >
          <HStack
            spacing={{ base: '4', sm: '2', lg: '4' }}
            width="100%"
            justifyContent={{
              base: 'space-around',
              sm: 'space-between',
              lg: 'left',
            }}
            pb={{ base: '2', sm: '1', md: '2' }}
          >
            <HStack>
              <Heading
                as="h4"
                fontFamily="poppins"
                fontWeight="semibold"
                fontSize={{ base: '24px', sm: '16px', md: '24px' }}
              >
                Produk
              </Heading>
            </HStack>
          </HStack>
          <HStack spacing="4">
            <Button
              fontFamily="poppins"
              minWidth="200px"
              size="md"
              onClick={onAddNewItem}
              display={{ base: 'flex', sm: 'none', md: 'flex' }}
              disabled={!canAddNonHiddenItems}
            >
              Tambah Produk Baru
            </Button>
          </HStack>
        </HStack>

        <HStack spacing="2" pb="2">
          <Text
            fontFamily="poppins"
            fontSize={{ base: '14px', sm: '12px', md: '14px' }}
          >
            Jumlah Produk Toko: {items.length}
          </Text>
          <Text
            fontFamily="source"
            fontWeight="normal"
            fontSize={{ base: '14px', sm: '12px', md: '14px' }}
            color="brand.black40"
          >
            ({availableItems.length} tersedia, {disabledItems.length} tidak
            tersedia, {hiddenItems.length} tersembunyi)
          </Text>

          <InfoButtonWithTooltip label="Kamu hanya bisa memiliki maksimal 30 total produk tersedia dan tidak tersedia. Upgrade menjadi pengguna paket Premium untuk bisa memiliki jumlah produk tidak terbatas." />
        </HStack>
        <HStack pt="2" width="100%">
          <InputGroup w={{ base: '100%', md: '220px', lg: '450px' }} h="10">
            <InputLeftElement pointerEvents="none" h="10">
              <Icon as={HiSearch} color="brand.gray" boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder="Cari produk disini"
              fontSize="md"
              lineHeight="14px"
              h="10"
              spellCheck="false"
              id="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <InputRightElement h="10">
              <IconButton
                aria-label="Close"
                color="brand.gray"
                icon={<HiX />}
                variant="link"
                _focus={{ outline: 'none' }}
                visibility={searchTerm ? 'visible' : 'hidden'}
                onClick={() => {
                  setSearchTerm('');
                }}
              ></IconButton>
            </InputRightElement>
          </InputGroup>
          <IconButton
            icon={<HiOutlineFilter size="20px" />}
            aria-label={'information'}
            variant="ghost"
            color="brand.green"
            size="sm"
            _focus={{ outline: 'none' }}
            onClick={() => {
              setIsFilterOpen(true);
            }}
          />
          {isFilterApplied && (
            <Button
              variant="ghost"
              size="md"
              color="brand.green"
              fontFamily="poppins"
              fontSize="14px"
              fontWeight="normal"
              _focus={{ outline: 'none' }}
              onClick={onClearFilter}
            >
              Tampilkan semua
            </Button>
          )}
        </HStack>
        <VStack pt="2" pb="6" width="100%" spacing="4" alignItems="flex-start">
          <Box display={searchTerm ? 'flex' : 'none'}>
            <Text
              fontFamily="poppins"
              fontSize="14px"
              fontWeight="normal"
              color="brand.black40"
            >
              {filteredItems.length}
              {' produk ditemukan'}
            </Text>
          </Box>
          {filteredItems.map((item) => (
            <Box key={item.id} width="100%">
              <HStack spacing="4" width="100%">
                <CollectionItemCard
                  item={item}
                  onEdit={onEditItem}
                  isEditable
                />
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
      <ItemsFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterOptions={filterOptions}
        onApply={onApplyFilter}
      />
    </>
  );
};

export default ViewItems;
