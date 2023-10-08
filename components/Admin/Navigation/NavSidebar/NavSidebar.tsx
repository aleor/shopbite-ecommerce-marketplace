import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { useEffect, useState } from 'react';

import { Box, Flex, Stack, Text } from '@chakra-ui/react';

import { useNavigation } from '../../hooks/useNavigation';
import { menu, MenuTabQuery } from '../menu';
import { NavButton } from './NavButton';

const NavSidebar = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('items' as MenuTabQuery);

  const { navigateTo } = useNavigation();

  const router = useRouter();
  const query = parseUrl(router.asPath)?.query;
  const routeTab = query?.tab as MenuTabQuery;

  useEffect(() => {
    if (routeTab) {
      setActiveMenuItem(routeTab);
    }
  }, [routeTab]);

  return (
    <Flex as="section">
      <Flex
        flex="1"
        color="brand.black"
        maxW={{ base: 'full', sm: 'xs' }}
        py={{ base: '6', sm: '8' }}
        pr={{ base: '4', sm: '6' }}
      >
        <Stack spacing="1" flex="1">
          {menu.map((menuGroup) => (
            <Box key={menuGroup.groupName}>
              <Box ml="8" pb="2">
                <Text
                  color="brand.black40"
                  fontSize="18px"
                  fontWeight="semibold"
                  fontFamily="source"
                >
                  {menuGroup.groupName}
                </Text>
              </Box>
              <Stack spacing="1" flex="1">
                {menuGroup.items.map(({ label, query }) => (
                  <NavButton
                    key={query}
                    label={label}
                    isActive={activeMenuItem === query}
                    onClick={() => {
                      navigateTo(query);
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Flex>
    </Flex>
  );
};

export default NavSidebar;
