import { HiOutlineTrash } from 'react-icons/hi';

import { Box, HStack, IconButton, Link, Text, VStack } from '@chakra-ui/react';

import { getLinkIcon } from '../../../../libs/getLinkIcon';
import { getLinkDestination } from '../../../../libs/getLinkProps';
import { ItemLink, ItemLinkType } from '../../../../models';

const ItemLinkRow = ({
  link,
  onLinkDeleted,
}: {
  link: ItemLink;
  onLinkDeleted: (type: ItemLinkType) => void;
}) => {
  return (
    <HStack
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      spacing="4"
    >
      <VStack spacing="1" alignItems="flex-start">
        <HStack alignItems="center">
          <Text
            fontFamily="poppins"
            color="brand.green"
            fontSize="14px"
            fontWeight="medium"
          >
            {getLinkDestination(link.type)}
          </Text>

          {getLinkIcon({ type: link.type, size: { w: '16px', h: '16px' } })}
        </HStack>
        <Box w="100%">
          <Link
            href={link.url}
            isExternal
            flex="1"
            fontFamily="source"
            fontWeight="normal"
            fontSize="14px"
            noOfLines={1}
            wordBreak="break-all"
          >
            {link.url}
          </Link>
        </Box>
      </VStack>
      <IconButton
        icon={<HiOutlineTrash size="16px" />}
        aria-label="Hapus link"
        variant="ghost"
        color="brand.red"
        _focus={{ outline: 'none' }}
        size="sm"
        onClick={() => onLinkDeleted(link.type)}
      />
    </HStack>
  );
};

export default ItemLinkRow;
