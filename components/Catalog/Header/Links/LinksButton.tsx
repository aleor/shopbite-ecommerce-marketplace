import { useCallback } from 'react';

import { Box, Button, HStack, useDisclosure } from '@chakra-ui/react';

import { getLinkIcon } from '../../../../libs/getLinkIcon';
import { Link } from '../../../../models';
import LinksDrawer from './LinksDrawer';

export const LinksButton = ({ links }: { links: Link[] }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const getIcons = useCallback(() => {
    if (!links.length) return null;

    return (
      <HStack spacing="-1">
        {[...links]
          .sort((a, b) => a.ordering - b.ordering)
          .filter((_, index) => index < 5)
          .map((link, index) => (
            <Box
              zIndex={links.length - index}
              key={link.type}
              borderColor="white"
              borderRadius="50%"
              borderWidth="1px"
            >
              {getLinkIcon({ type: link.type })}
            </Box>
          ))}
      </HStack>
    );
  }, [links]);

  if (!links?.length) {
    return null;
  }

  return (
    <>
      <Box w="100%">
        <Button
          leftIcon={getIcons()}
          variant="solid"
          color="brand.green"
          minWidth={{ base: '200px', sm: '100%', md: '200px' }}
          fontFamily="poppins"
          fontWeight={{ base: 'medium', sm: 'normal', md: 'medium' }}
          _focus={{ outline: 'none' }}
          size="md"
          onClick={onOpen}
        >
          Links
        </Button>
      </Box>

      <LinksDrawer links={links} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
