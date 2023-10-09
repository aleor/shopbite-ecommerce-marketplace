import { Box, HStack, Link, Text } from '@chakra-ui/react';

import ShareButton from '../../ShareButton/ShareButton';

const ShopLink = ({ link }: { link: string }) => {
  return (
    <Box>
      <HStack
        spacing="1"
        fontSize={{ base: '16px', sm: '14px', md: '16px' }}
        fontWeight="normal"
        fontFamily="poppins"
        alignItems="center"
      >
        <Text>Shop Link: </Text>
        <Link
          href={link}
          isExternal
          noOfLines={1}
          flex="1"
          wordBreak="break-all"
        >
          {link}
        </Link>

        <Box>
          <ShareButton
            link={link}
            iconButtonProps={{
              justifyContent: { base: 'center', sm: 'end', md: 'center' },
              'aria-label': 'Share',
            }}
          />
        </Box>
      </HStack>
    </Box>
  );
};

export default ShopLink;
