import { useMemo } from 'react';

import { Avatar, Box, HStack, Icon, Stack, VStack } from '@chakra-ui/react';

import { useAppSelector } from '../../../app/hooks';
import { useIsMobile } from '../../../libs/useIsMobile';
import { Shop } from '../../../models';
import { Logo } from '../../Icons/Logo';
import ShareButton from '../../ShareButton/ShareButton';
import DescriptionBlock from './DescriptionBlock';
import { LinksButton } from './Links/LinksButton';
import MyCartButton from './MyCartButton';
import Search from './Search';

const Header = ({ shop }: { shop: Shop }) => {
  const { cartItems } = useAppSelector((state) => state.cart);

  const isMobile = useIsMobile();

  const links = useMemo(() => {
    if (!shop.links?.length) return [];

    return shop.links.slice().sort((a, b) => a.ordering - b.ordering);
  }, [shop]);

  return (
    <Box bg="white">
      <Box
        px={{ base: 32, sm: 4, md: 20, lg: 32 }}
        paddingTop="5"
        paddingBottom={{ base: 0, sm: 4, md: 0 }}
      >
        <HStack
          spacing="4"
          justify="space-between"
          display={{ base: 'none', sm: 'flex', md: 'none' }}
        >
          <ShareButton title={shop.profileName} />
          <Box>
            <a href="/">
              <Icon as={Logo} w="72px" h="16px" />
            </a>
          </Box>
        </HStack>

        <Stack
          spacing={{ base: '4', md: '4' }}
          direction={{ base: 'column', md: 'row' }}
          paddingTop={{ base: '0', sm: '4', md: '0' }}
          justify="flex-start"
        >
          <HStack spacing="4" flex="1" alignItems="flex-start">
            <Box paddingTop="2">
              <Avatar
                src={shop.profilePictureUrl}
                name={shop.profileName}
                boxSize={{ base: '12', sm: '14' }}
              />
            </Box>
            <VStack spacing="2" alignItems="flex-start">
              <DescriptionBlock shop={shop} />
              <LinksButton links={links} />
            </VStack>
          </HStack>

          <VStack>
            <Box width="100%">
              <Search />
            </Box>

            {!isMobile && cartItems?.length && (
              <MyCartButton cartItems={cartItems} />
            )}
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Header;
