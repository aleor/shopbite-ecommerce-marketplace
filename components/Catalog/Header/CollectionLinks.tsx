import { useCallback, useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

import { Box, Flex, HStack, IconButton, Link, Text } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setActiveCollection } from '../../../features/collections/collections-slice';
import { Collection } from '../../../models';

const CollectionLinks = ({
  collections,
}: {
  collections: Collection[] | null;
}) => {
  const isSearching = !!useAppSelector((state) => state.search.term);
  const activeCollectionId = useAppSelector(
    (state) => state.collections.activeCollectionId
  );
  const dispatch = useAppDispatch();

  const linksRowRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const handleScrollButtons = () => {
    if (isSearching) {
      setShowScrollButtons(false);
      return;
    }

    if (linksRowRef.current) {
      const linksRow = linksRowRef.current;
      setShowScrollButtons(linksRow.offsetWidth < linksRow.scrollWidth);
    }
  };

  useEffect(() => {
    handleScrollButtons();
  }, [collections, isSearching]);

  const scrollLeft = useCallback(() => {
    if (linksRowRef.current) {
      linksRowRef.current.scroll({
        left: linksRowRef.current.scrollLeft - linksRowRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (linksRowRef.current) {
      linksRowRef.current.scroll({
        left: linksRowRef.current.scrollLeft + linksRowRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    if (!window) {
      return;
    }

    window.addEventListener('resize', handleScrollButtons);

    return () => window.removeEventListener('resize', handleScrollButtons);
  }, []);

  const sortedCollections = useCallback(
    () => [...collections].sort((a, b) => a.ordering - b.ordering),
    [collections]
  );

  useEffect(() => {
    if (!activeCollectionId) {
      dispatch(setActiveCollection(sortedCollections()[0]?.id));
    }
  }, [sortedCollections]);

  if (!collections?.length || collections.length === 1) {
    return null;
  }

  const scrollToCollection = (id: string) => {
    const collectionEl = document.getElementById(id);
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onLinkClicked = (collectionId: string) => {
    if (isSearching) return;

    if (activeCollectionId !== collectionId) {
      dispatch(setActiveCollection(collectionId));
    }
    scrollToCollection(collectionId);
  };

  return (
    <HStack pt="1" spacing="2" marginLeft="60px" marginRight="25px">
      <IconButton
        icon={<HiChevronLeft size="18px" />}
        variant="link"
        aria-label="Scroll left"
        color="brand.gray"
        _focus={{ outline: 'none' }}
        visibility={showScrollButtons ? 'visible' : 'hidden'}
        onClick={scrollLeft}
      />
      <HStack
        spacing="10"
        overflowX="auto"
        ref={linksRowRef}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        {sortedCollections().map(({ id, label }) => (
          <Box
            key={id}
            minWidth="max-content"
            filter={isSearching ? 'grayscale(100%)' : 'none'}
          >
            <Link
              _hover={
                isSearching
                  ? {}
                  : { color: 'brand.green', textDecoration: 'underline' }
              }
              onClick={() => onLinkClicked(id)}
              cursor={isSearching ? 'not-allowed' : 'pointer'}
            >
              <Text
                color={
                  id === activeCollectionId && !isSearching
                    ? 'brand.green'
                    : 'brand.black40'
                }
                fontSize="lg"
                fontWeight={
                  id === activeCollectionId && !isSearching
                    ? 'medium'
                    : 'normal'
                }
                textDecoration={
                  id === activeCollectionId && !isSearching
                    ? 'underline'
                    : 'none'
                }
              >
                {label}
              </Text>
            </Link>
          </Box>
        ))}
      </HStack>
      <Flex flex="1" justifyContent="flex-end">
        <IconButton
          icon={<HiChevronRight size="18px" />}
          variant="link"
          color="brand.gray"
          aria-label="Scroll right"
          _focus={{ outline: 'none' }}
          visibility={showScrollButtons ? 'visible' : 'hidden'}
          onClick={scrollRight}
        />
      </Flex>
    </HStack>
  );
};

export default CollectionLinks;
