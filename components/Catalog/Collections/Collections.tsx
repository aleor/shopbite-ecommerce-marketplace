import pDebounce from 'p-debounce';
import React, { useEffect, useMemo } from 'react';
import { BiFileFind } from 'react-icons/bi';

import { Box, Container, Icon, Text, VStack } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setActiveCollection } from '../../../features/collections/collections-slice';
import { Collection } from '../../../models';
import ShoppingCart from '../../ShoppingCart/ShoppingCart';
import ItemDetailsModal from '../Item/ItemDetailsModal';
import CollectionSection from './CollectionSection';

const Collections = ({ collections }: { collections: Collection[] | null }) => {
  const searchTerm = useAppSelector((state) => state.search.term);
  const selectedItem = useAppSelector((state) => state.items.selectedItem);
  const activeCollectionId = useAppSelector(
    (state) => state.collections.activeCollectionId
  );
  const dispatch = useAppDispatch();

  const getCollectionIds = useMemo(() => {
    if (!collections) {
      return [];
    }

    return collections.map((collection) => collection.id);
  }, [collections]);

  const onScroll = () => {
    const collectionIds = getCollectionIds;

    const collections: { id: string; top: number }[] = [];

    collectionIds.forEach((collId) => {
      const collectionEl = document.getElementById(collId);

      if (collectionEl) {
        collections.push({
          id: collId,
          top: collectionEl.getBoundingClientRect().top,
        });
      }
    });

    const closestCollection = collections.reduce(
      (prev, curr) => {
        if (Math.abs(curr.top) < Math.abs(prev.top)) {
          return curr;
        }

        return prev;
      },
      { id: collections[0]?.id, top: collections[0]?.top }
    );

    if (closestCollection?.id && closestCollection.id !== activeCollectionId) {
      dispatch(setActiveCollection(closestCollection.id));
    }
  };

  const debouncedOnScroll = pDebounce(onScroll, 100);

  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);

    return () => {
      window.removeEventListener('scroll', debouncedOnScroll);
    };
  }, []);

  const filteredCollections = useMemo(() => {
    if (!collections) {
      return [];
    }

    const searchResult = collections.map((collection) => {
      if (!searchTerm) {
        return collection;
      }

      const filteredItems = collection.itemList.filter((item) => {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
      });

      return {
        ...collection,
        itemList: filteredItems,
      };
    });

    return searchResult.filter((collection) => collection.itemList.length);
  }, [collections, searchTerm]);

  const itemsFound = () =>
    filteredCollections.flatMap((c) => c.itemList).length;

  return (
    <>
      <Box
        as="section"
        px={{ base: '4', md: '6' }}
        pb={{ base: '10', sm: '20', md: '10' }}
      >
        <Container
          maxWidth="full"
          maxHeight="full"
          px={{ base: '1', sm: '0', md: '1' }}
        >
          <Box
            pt={{ base: '4', sm: '2', md: '4' }}
            display={searchTerm ? 'flex' : 'none'}
          >
            {itemsFound() !== 0 && (
              <Text
                px={{ base: 24, sm: 0, md: 12, lg: 24 }}
                color="brand.black40"
              >{`${itemsFound()} results`}</Text>
            )}
            {itemsFound() === 0 && (
              <VStack width="100%" pt="20">
                <Icon
                  as={BiFileFind}
                  color="brand.black40"
                  height="54px"
                  width="43px"
                />
                <Text
                  color="brand.black40"
                  fontSize="14px"
                  fontWeight="normal"
                  fontFamily="source"
                  textAlign="center"
                >
                  No results found <br /> Try a different keyword
                </Text>
              </VStack>
            )}
          </Box>

          {filteredCollections.map((collection) => (
            <Box key={collection.id} id={collection.id}>
              <CollectionSection
                collection={collection}
                showTitle={collections?.length !== 1}
              />
            </Box>
          ))}
        </Container>

        {selectedItem && <ItemDetailsModal />}
      </Box>
      <ShoppingCart />
    </>
  );
};

export default Collections;
