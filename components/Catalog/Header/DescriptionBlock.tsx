import { Box, HStack, Link, Text, VStack } from '@chakra-ui/react';

import { logClickLinkEvent } from '../../../libs/analytics/logEvents';
import { parseJSONSafely } from '../../../libs/parseJSONSafely';
import { Shop } from '../../../models';
import { LinkType } from '../../../models/linkType';
import ShareButton from '../../ShareButton/ShareButton';

const DescriptionBlock = ({ shop }: { shop: Shop }) => {
  return (
    <Box>
      <VStack spacing="1" alignItems="flex-start">
        <HStack justify="flex-start">
          <Text fontSize="lg" fontWeight="semibold">
            {shop.profileName}
          </Text>
          <Box visibility={{ base: 'visible', sm: 'hidden', md: 'visible' }}>
            <ShareButton title={shop.profileName} />
          </Box>
        </HStack>
        <Text
          fontSize="lg"
          fontFamily="source"
          fontWeight="normal"
          whiteSpace="pre-wrap"
          pr={{ base: 28, sm: 0, md: 12, lg: 28 }}
        >
          {parseJSONSafely(shop.profileDescription)}
        </Text>

        <Link
          fontSize="md"
          fontWeight="normal"
          py={{ base: 1, sm: 1, md: 1, lg: 1 }}
          href={shop.websiteUrl}
          isExternal
          onClick={() =>
            logClickLinkEvent({
              url: shop.websiteUrl,
              label: shop.websiteLabel,
              type: LinkType.SO_Web,
            })
          }
        >
          {shop.websiteLabel || shop.websiteUrl}
        </Link>
      </VStack>
    </Box>
  );
};

export default DescriptionBlock;
