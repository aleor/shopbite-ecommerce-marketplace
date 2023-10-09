import { useContext, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { useToast } from '../../../../libs/useToast';
import { Collection, Item, ItemStatus } from '../../../../models';
import { adminSettings } from '../../adminSettings';
import { ShopContext } from '../../hooks/shopContext';
import EditItem from './EditItem';
import NewItem from './NewItem';
import ViewItems from './ViewItems';

type ItemsTabMode = 'view_list' | 'new_item' | 'edit_item';

const Items = ({
  items,
  collections,
}: {
  items: Item[];
  collections: Collection[];
}) => {
  const [itemsTabMode, setItemsTabMode] = useState<ItemsTabMode>('view_list');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const shop = useContext(ShopContext);
  const [canAddNonHiddenItems, setCanAddNonHiddenItems] = useState(true);

  useEffect(() => {
    if (shop.hasSubscription) {
      setCanAddNonHiddenItems(true);
      return;
    }

    const nonHiddenItemsCount = items?.filter(
      (i) => i.status !== ItemStatus.hidden
    ).length;

    setCanAddNonHiddenItems(
      nonHiddenItemsCount < adminSettings.freePlanLimits.maxNonHiddenItems
    );
  }, [items]);

  const { showToast } = useToast();

  const onSave = () => {
    showToast({
      title: 'Changes saved successfully',
      status: 'success',
    });
  };

  return (
    <Box px="4" py="4" width="100%">
      {itemsTabMode === 'view_list' && (
        <ViewItems
          items={items}
          canAddNonHiddenItems={canAddNonHiddenItems}
          onAddNewItem={() => {
            setItemsTabMode('new_item');
          }}
          onEditItem={(item) => {
            setSelectedItem(item);
            setItemsTabMode('edit_item');
          }}
        />
      )}

      {itemsTabMode === 'new_item' && (
        <NewItem
          collections={collections}
          onClose={() => {
            setItemsTabMode('view_list');
          }}
          onSaved={() => {
            onSave();
            setItemsTabMode('view_list');
          }}
          shopId={shop.id}
          canAddNonHiddenItems={canAddNonHiddenItems}
        />
      )}

      {itemsTabMode === 'edit_item' && (
        <EditItem
          item={selectedItem}
          collections={collections}
          onClose={() => {
            setItemsTabMode('view_list');
          }}
          onSaved={() => {
            onSave();
            setItemsTabMode('view_list');
          }}
          shopId={shop.id}
          canAddNonHiddenItems={canAddNonHiddenItems}
        />
      )}
    </Box>
  );
};

export default Items;
