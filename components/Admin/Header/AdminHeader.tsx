import { useContext, useEffect, useState } from 'react';

import {
    Box, Button, Container, Flex, HStack, StackDivider, useBreakpointValue, VStack
} from '@chakra-ui/react';

import { auth } from '../../../firebase/auth';
import { Logo } from '../../Icons/Logo';
import { ShopContext } from '../hooks/shopContext';
import HorizontalNavBar from '../Navigation/HorizontalNavBar';
import ShopLink from './ShopLink';

const AdminHeader = () => {
  const shop = useContext(ShopContext);
  const [shopLink, setShopLink] = useState('');
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    if (typeof window === 'undefined' || !shop) {
      setShopLink('');
      return;
    }

    setShopLink(`${window.location.origin}/${shop.username}`);
  }, [shop]);

  if (isMobile) {
    return (
      <Flex px="4" py="2" overflowX="hidden">
        <VStack
          width="100%"
          alignItems="flex-start"
          divider={<StackDivider borderColor="color.gray" />}
        >
          <HStack spacing="12" width="100%" justifyContent="space-between">
            <a href="/">
              <Logo width="74px" height="16px" />
            </a>

            <Button
              variant="link"
              color="brand.green"
              fontSize="14px"
              fontWeight="medium"
              fontFamily="source"
              onClick={() => {
                auth.signOut();
              }}
            >
              Log out
            </Button>
          </HStack>

          <ShopLink link={shopLink} />
          <HorizontalNavBar />
        </VStack>
      </Flex>
    );
  }

  return (
    <Box boxShadow={'sm'}>
      <Container py={{ base: '3', lg: '4' }} px="8" maxWidth="100%">
        <Flex justify="space-between" flex="1">
          <HStack spacing="12" flex="1">
            <a href="/">
              <Logo width="135px" height="30px" />
            </a>

            <Box pr="12">
              <ShopLink link={shopLink} />
            </Box>
          </HStack>
          <Button
            variant="link"
            color="brand.green"
            fontSize="16px"
            fontWeight="medium"
            fontFamily="source"
            onClick={() => {
              auth.signOut();
            }}
          >
            Log out
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default AdminHeader;
