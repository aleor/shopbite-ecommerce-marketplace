import { useEffect } from 'react';
import { HiArrowLeft } from 'react-icons/hi';

import {
    Box, Drawer, DrawerContent, DrawerOverlay, HStack, IconButton, Text, VStack
} from '@chakra-ui/react';

import { logClickLinkEvent } from '../../../../libs/analytics/logEvents';
import { Destination, Link } from '../../../../models';
import { LinkType } from '../../../../models/linkType';
import LinkSection from './LinkSection';

const LinksDrawer = ({
  links,
  isOpen,
  onClose,
}: {
  links: Link[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!isOpen || !window) {
      return;
    }

    const onBack = (e) => {
      e.preventDefault();

      if (isOpen) {
        onClose();
        return false;
      }

      return true;
    };

    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate', onBack);

    return () => {
      if (window.history.state === null) {
        window.history.back();
      }
      window.removeEventListener('popstate', onBack);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const onDestinationSelected = (type: LinkType, destination: Destination) => {
    logClickLinkEvent({ ...destination, type });
    window.open(destination.url, '_blank');
    onClose();
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={() => void 0}
        size="xs"
        allowPinchZoom
        onOverlayClick={onClose}
      >
        <DrawerOverlay />

        <DrawerContent bg="white" overflowY="auto">
          <HStack spacing="2" pl="4" pt="1">
            <IconButton
              icon={<HiArrowLeft />}
              onClick={onClose}
              aria-label="Close"
              variant="ghost"
              _focus={{ outline: 'none' }}
              size="md"
            />

            <Text fontSize="16px" fontFamily="poppins" fontWeight="semibold">
              Links
            </Text>
          </HStack>

          <VStack py="6" spacing="6" alignItems="flex-start">
            {links.map((link) => (
              <Box key={link.type} width="100%">
                <LinkSection
                  link={link}
                  onDestinationSelected={onDestinationSelected}
                />
              </Box>
            ))}
          </VStack>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LinksDrawer;
