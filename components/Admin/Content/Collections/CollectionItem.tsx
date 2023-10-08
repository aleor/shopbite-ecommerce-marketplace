import { Box, Checkbox, Text } from '@chakra-ui/react';

import { getThumbnailUrl, Item } from '../../../../models';

const CollectionItem = ({
  item,
  onSelect,
  isSelected = false,
}: {
  item: Item;
  onSelect: (item: Item, isSelected: boolean) => void;
  isSelected?: boolean;
}) => {
  if (!item) {
    return null;
  }

  return (
    <Box position="relative" display="flex" width="100px">
      <Box
        bgImg={`linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.5) 100%), url(${getThumbnailUrl(
          item
        )})`}
        bgRepeat="no-repeat"
        bgPosition="center center"
        width="100px"
        height="100px"
        bgSize="cover"
        borderRadius="5px"
      />

      <Text
        fontSize="12px"
        fontFamily="source"
        fontWeight="semibold"
        position="absolute"
        bottom="6px"
        left="6px"
        right="6px"
        lineHeight="14px"
        color="white"
        noOfLines={2}
      >
        {item.title}
      </Text>

      <Checkbox
        position="absolute"
        top="6px"
        right="6px"
        padding="2px"
        background="#FFF"
        borderRadius="2px"
        onChange={(e) => onSelect(item, e.target.checked)}
        isChecked={isSelected}
      />
    </Box>
  );
};

export default CollectionItem;
