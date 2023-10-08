import { Box, HStack, Text, VStack } from '@chakra-ui/react';

import { getLinkIcon } from '../../../../libs/getLinkIcon';
import { getLinkDestination } from '../../../../libs/getLinkProps';
import { Destination, Link } from '../../../../models';
import { LinkType } from '../../../../models/linkType';

const LinkSection = ({
  link,
  onDestinationSelected,
}: {
  link: Link;
  onDestinationSelected: (type: LinkType, destination: Destination) => void;
}) => {
  const linkDestinationText = (destination: Destination) => {
    return `${destination.label || destination.url}`;
  };

  return (
    <VStack alignItems="center" width="100%" spacing="4">
      <Text fontSize="12px" fontFamily="poppins" fontWeight="medium">
        {getLinkDestination(link.type)}
      </Text>
      <VStack px="4" spacing="4" width="100%">
        {link.destinations.map((destination: Destination) => (
          <Box key={destination.id} width="100%">
            <Box
              as="button"
              width="100%"
              py="1"
              px="4"
              borderColor="brand.green"
              borderWidth="2px"
              borderRadius="20px"
              _hover={{ bg: '#ebedf0' }}
              _active={{
                bg: '#dddfe2',
                transform: 'scale(0.98)',
                borderColor: 'brand.green',
              }}
              _focus={{
                outline: 'none',
              }}
              onClick={() => onDestinationSelected(link.type, destination)}
            >
              <HStack width="100%" spacing="2">
                {getLinkIcon({
                  type: link.type,
                  size: { w: '24px', h: '24px' },
                })}
                <Box flex="1" noOfLines={destination.label ? 2 : 1}>
                  <Text
                    fontFamily="poppins"
                    fontWeight="medium"
                    fontSize="12px"
                    color="brand.green"
                  >
                    {linkDestinationText(destination)}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default LinkSection;
