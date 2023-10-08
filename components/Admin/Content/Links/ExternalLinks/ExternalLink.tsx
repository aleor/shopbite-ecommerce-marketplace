import { useCallback } from 'react';

import { Box, Divider, HStack, Icon, Text, VStack } from '@chakra-ui/react';

import { Destination, Link as LinkModel } from '../../../../../models';
import { destinations } from './destinations';
import LinkDestination from './LinkDestination';

const ExternalLink = ({
  link,
  onSaveDestination,
  onDeleteDestination,
}: {
  link: LinkModel;
  onSaveDestination: (destination: Destination) => void;
  onDeleteDestination: (destinationId: string) => void;
}) => {
  if (!link) {
    return null;
  }

  const renderLinkType = useCallback(() => {
    const targetLink = destinations
      .flatMap((group) => group.destinations)
      .find((l) => l.value === link.type);

    if (!targetLink) {
      return <Text>{link.type}</Text>;
    }

    return (
      <HStack>
        <Text fontFamily="poppins" fontWeight="semibold" fontSize="16px">
          {targetLink.label}
        </Text>
        <Icon as={targetLink.icon} w="24px" h="24px" />
      </HStack>
    );
  }, [link]);

  return (
    <VStack
      spacing="4"
      alignItems="flex-start"
      justifyContent="space-between"
      width={{ base: '70%', sm: '100%', md: '70%' }}
      border="1px solid rgba(45, 51, 25, 0.4)"
      borderRadius="8px"
      padding="4"
    >
      <HStack spacing="4">{renderLinkType()}</HStack>

      <VStack
        width="100%"
        spacing="5"
        alignItems="flex-start"
        pt="2"
        divider={<Divider />}
      >
        {link.destinations.map((destination) => (
          <Box key={destination.id} width="100%">
            <LinkDestination
              destination={destination}
              onSave={onSaveDestination}
              onDelete={onDeleteDestination}
            />
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default ExternalLink;
