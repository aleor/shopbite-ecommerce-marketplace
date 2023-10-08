import { useEffect, useState } from 'react';

import {
    Box, Button, Divider, Drawer, DrawerContent, DrawerOverlay, HStack, Icon, Radio, RadioGroup,
    SimpleGrid, Text, VStack
} from '@chakra-ui/react';

import { LinkType } from '../../../../../models/linkType';
import { destinations } from './destinations';

const LinkDestinationsDrawer = ({
  isOpen,
  type,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  type?: LinkType;
  onClose: () => void;
  onSelect: (type: LinkType) => void;
}) => {
  const [selectedDestination, setSelectedDestination] = useState<LinkType>(
    type || LinkType.Any
  );

  useEffect(() => {
    if (type) {
      setSelectedDestination(type);
    }
  }, [type]);

  if (!isOpen) {
    return null;
  }

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
          <VStack
            paddingX={{ base: '4', sm: '4' }}
            paddingY="4"
            width="100%"
            height="100%"
            justifyContent="space-between"
          >
            <RadioGroup
              value={selectedDestination}
              size="md"
              onChange={(value: LinkType) => {
                setSelectedDestination(value), onSelect(value);
              }}
            >
              <VStack
                alignItems="flex-start"
                spacing="4"
                width="100%"
                divider={<Divider />}
              >
                {destinations.map((group) => (
                  <Box key={group.groupName} width="100%">
                    <Text
                      fontSize="16px"
                      fontFamily="poppins"
                      fontWeight="medium"
                    >
                      {group.groupName}
                    </Text>

                    <SimpleGrid spacing={2} columns={2} pt="3">
                      {group.destinations.map((destination) => (
                        <Radio
                          value={destination.value}
                          key={destination.label}
                          spacing="3"
                        >
                          <HStack spacing="2">
                            <Icon as={destination.icon} w="18px" h="18px" />
                            <Text
                              fontFamily="source"
                              fontSize="14px"
                              fontWeight="normal"
                            >
                              {destination.label}
                            </Text>
                          </HStack>
                        </Radio>
                      ))}
                    </SimpleGrid>
                  </Box>
                ))}
              </VStack>
            </RadioGroup>

            <Box py="4" width="100%">
              <Button
                size="md"
                fontSize="md"
                width="100%"
                onClick={() => {
                  onSelect(selectedDestination);
                  onClose();
                }}
                isDisabled={!selectedDestination}
              >
                Simpan
              </Button>
            </Box>
          </VStack>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LinkDestinationsDrawer;
