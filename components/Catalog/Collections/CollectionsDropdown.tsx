import { useCallback, useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box, Button, Flex, HStack, Menu, MenuButton, MenuItem, MenuList, Text
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setActiveCollection } from '../../../features/collections/collections-slice';
import { Collection } from '../../../models';

const CollectionsDropdown = ({
  collections = [],
}: {
  collections: Collection[] | null;
}) => {
  const activeCollectionId = useAppSelector(
    (state) => state.collections.activeCollectionId
  );
  const dispatch = useAppDispatch();

  const [headerPinned, setHeaderPinned] = useState(false);
  const headerRef = useRef(null);

  const searchTerm = useAppSelector((state) => state.search.term);

  const sortedCollections = useCallback(
    () => [...collections].sort((a, b) => a.ordering - b.ordering),
    [collections]
  );

  useEffect(() => {
    if (!activeCollectionId) {
      dispatch(setActiveCollection(sortedCollections()[0]?.id));
    }
  }, []);

  useEffect(() => {
    const cachedRef = headerRef.current;
    if (!cachedRef) {
      return;
    }

    const observer = new IntersectionObserver(
      ([e]) => setHeaderPinned(e.intersectionRatio < 1),
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    observer.observe(cachedRef);

    return () => observer.unobserve(cachedRef);
  }, []);

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
    dispatch(setActiveCollection(collectionId));
    scrollToCollection(collectionId);
  };

  const scrollToSearch = () => {
    const searchEl = document.getElementById('search-input');

    if (searchEl) {
      window?.scrollBy({
        top:
          searchEl.getBoundingClientRect().top -
          searchEl.getBoundingClientRect().height / 2,
        behavior: 'smooth',
      });
      searchEl.focus({ preventScroll: true });
    }
  };

  return (
    <Box backgroundColor="white" ref={headerRef}>
      <Box
        display="flex"
        justifyContent="space-between"
        marginX="15px"
        overflow="hidden"
      >
        {!searchTerm && (
          <>
            <Menu gutter={0} autoSelect={false} closeOnSelect>
              <HStack
                maxWidth={headerPinned ? '80%' : '100%'}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                top="0"
              >
                <MenuButton>
                  <HStack>
                    <Text
                      fontSize="16px"
                      fontWeight="semibold"
                      fontFamily="source"
                    >
                      {sortedCollections().find(
                        (c) => c.id === activeCollectionId
                      )?.label || sortedCollections()[0].label}
                    </Text>

                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
              </HStack>
              <MenuList>
                {sortedCollections().map(({ id, label }) => (
                  <MenuItem key={id} onClick={() => onLinkClicked(id)}>
                    <Text
                      fontFamily="source"
                      fontSize="16px"
                      fontWeight={id === activeCollectionId ? 'bold' : 'normal'}
                    >
                      {label}
                    </Text>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Flex
              flex="1"
              justifyContent="flex-end"
              visibility={headerPinned ? 'visible' : 'hidden'}
            >
              <Button
                variant="unstyled"
                _focus={{ outline: 'none' }}
                onClick={() => scrollToSearch()}
              >
                <Text
                  fontSize="14px"
                  fontFamily="poppins"
                  fontWeight="medium"
                  color="brand.blue"
                >
                  Search
                </Text>
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CollectionsDropdown;
