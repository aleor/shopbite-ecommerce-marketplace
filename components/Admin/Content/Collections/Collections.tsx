import { useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { useToast } from '../../../../libs/useToast';
import { Collection, Item } from '../../../../models';
import CollectionDetails from './CollectionDetails';
import EditCollection from './EditCollectionItems';
import ManageCollections from './ManageCollections';
import NewCollection from './NewCollection';
import ViewCollections from './ViewCollections';

type CollectionTabMode =
  | 'edit_list'
  | 'view_list'
  | 'view_collection'
  | 'new_collection'
  | 'edit_collection';

const Collections = ({
  collections,
  items,
  shopId,
}: {
  collections: Collection[];
  items: Item[];
  shopId: string;
}) => {
  const [collectionsTabMode, setCollectionsTabMode] =
    useState<CollectionTabMode>('view_list');

  const [sortedCollections, setSortedCollections] = useState(
    collections.sort((a, b) => a.ordering - b.ordering)
  );

  const [nextCollectionPosition, setNextCollectionPosition] = useState(0);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>();

  const { showToast } = useToast();

  useEffect(() => {
    if (!collections?.length) {
      return;
    }

    const maxOrdering = Math.max(...collections.map((c) => c.ordering));
    const sortedCollections = collections.sort(
      (a, b) => a.ordering - b.ordering
    );

    setSortedCollections(sortedCollections);
    setNextCollectionPosition(maxOrdering + 1);
  }, [collections]);

  const onChangesSaved = (numberOfChanges: number) => {
    if (numberOfChanges > 0) {
      showToast({
        title: 'Changes saved successfully',
        status: 'success',
      });
    }
    setCollectionsTabMode('view_list');
  };

  return (
    <Box px="4" py="4" width="100%">
      {collectionsTabMode === 'new_collection' && (
        <NewCollection
          items={items}
          shopId={shopId}
          ordering={nextCollectionPosition}
          onClose={() => setCollectionsTabMode('view_list')}
        />
      )}
      {collectionsTabMode === 'edit_list' && (
        <ManageCollections
          collections={sortedCollections}
          shopId={shopId}
          onClose={() => setCollectionsTabMode('view_list')}
          onSaved={onChangesSaved}
        />
      )}
      {collectionsTabMode === 'view_list' && (
        <ViewCollections
          collections={sortedCollections}
          onCreateCollection={() => setCollectionsTabMode('new_collection')}
          onManageCollections={() => setCollectionsTabMode('edit_list')}
          onViewCollection={(collection) => {
            setSelectedCollection(collection);
            setCollectionsTabMode('view_collection');
          }}
        />
      )}
      {collectionsTabMode === 'view_collection' && (
        <CollectionDetails
          collection={selectedCollection}
          shopId={shopId}
          onSaved={onChangesSaved}
          onEdit={() => setCollectionsTabMode('edit_collection')}
          onClose={() => {
            setCollectionsTabMode('view_list');
          }}
        />
      )}
      {collectionsTabMode === 'edit_collection' && (
        <EditCollection
          collection={selectedCollection}
          items={items}
          shopId={shopId}
          onSaved={onChangesSaved}
          onClose={() => {
            setCollectionsTabMode('view_list');
          }}
        />
      )}
    </Box>
  );
};

export default Collections;
