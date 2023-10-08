import { HiSearch, HiX } from 'react-icons/hi';

import {
    Box, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, VStack
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { reset, setTerm } from '../../../features/search/search-slice';
import { Logo } from '../../Icons/Logo';

const Search = () => {
  const term = useAppSelector((state) => state.search.term);
  const dispatch = useAppDispatch();

  return (
    <VStack
      direction="column"
      spacing={{ base: '3', sm: '0', md: '3' }}
      alignItems="flex-end"
    >
      <Box display={{ base: 'none', md: 'flex' }}>
        <a href="/">
          <Icon as={Logo} w="72px" h="16px" />
        </a>
      </Box>

      <InputGroup w={{ base: '100%', md: '220px', lg: '350px' }} h="10">
        <InputLeftElement pointerEvents="none" h="10">
          <Icon as={HiSearch} color="brand.gray" boxSize="5" />
        </InputLeftElement>
        <Input
          placeholder="Cari produk disini"
          fontSize="md"
          lineHeight="14px"
          h="10"
          value={term}
          onChange={(e) => {
            dispatch(e.target.value ? setTerm(e.target.value) : reset());
          }}
          spellCheck="false"
          id="search-input"
        />
        <InputRightElement h="10">
          <IconButton
            aria-label="Close"
            color="brand.gray"
            icon={<HiX />}
            variant="link"
            _focus={{ outline: 'none' }}
            onClick={() => dispatch(reset())}
            visibility={term ? 'visible' : 'hidden'}
          ></IconButton>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
};

export default Search;
