import { Box, Heading, SimpleGrid } from '@chakra-ui/react';

import { useAppDispatch } from '../../../app/hooks';
import { selectAndShowDetails } from '../../../features/items/items-slice';
import { Collection, ItemStatus } from '../../../models';
import { ItemCard } from '../Item/ItemCard';

const CollectionSection = ({
  collection,
  showTitle = true,
  first = false,
}: {
  collection: Collection;
  showTitle?: boolean;
  first?: boolean;
}) => {
  const dispatch = useAppDispatch();

  return (
    <Box>
      <Box visibility={showTitle ? 'visible' : 'hidden'} py={showTitle ? 5 : 2}>
        <Heading
          size="md"
          fontWeight="semibold"
          fontSize={{ base: '26px', sm: '20px', md: '26px' }}
          px={{ base: 24, sm: 0, md: 12, lg: 24 }}
        >
          {collection.label}
        </Heading>
      </Box>

      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3 }}
        spacing={{ base: 6, sm: 4, md: 4, lg: 6 }}
        px={{ base: 24, sm: 0, md: 12, lg: 24 }}
        pb={{ base: 8, sm: 4, md: 6, lg: 8 }}
      >
        {collection.itemList
          .filter((i) => i.status !== ItemStatus.hidden)
          .sort((a, b) => a.ordering - b.ordering)
          .map((item) => (
            <Box key={item.id}>
              <ItemCard
                item={item}
                onClick={() => {
                  dispatch(selectAndShowDetails(item));
                }}
              />
            </Box>
          ))}
      </SimpleGrid>
    </Box>
  );
};

export default CollectionSection;
