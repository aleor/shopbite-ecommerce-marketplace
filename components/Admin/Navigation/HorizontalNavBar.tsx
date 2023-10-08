import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { useEffect, useState } from 'react';

import { Box, HStack, Link, Text } from '@chakra-ui/react';

import { useNavigation } from '../hooks/useNavigation';
import { menu, MenuTabQuery } from './menu';

const HorizontalNavBar = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('items' as MenuTabQuery);
  const { navigateTo } = useNavigation();

  const router = useRouter();
  const query = parseUrl(router.asPath)?.query;
  const routeTab = query?.tab as MenuTabQuery;

  const menuItems = menu.flatMap((menuGroup) => menuGroup.items);

  useEffect(() => {
    if (routeTab) {
      setActiveMenuItem(routeTab);
    }
  }, [routeTab]);

  return (
    <Box pt="1" width="100%">
      <HStack spacing="4" overflowX="auto" justifyContent="space-between">
        {menuItems.map(({ label, query }) => (
          <Box key={query} minWidth="max-content">
            <Link
              _hover={{ color: 'brand.green', textDecoration: 'underline' }}
              onClick={() => navigateTo(query)}
            >
              <Text
                color={
                  activeMenuItem === query ? 'brand.green' : 'brand.black40'
                }
                fontSize="14px"
                fontWeight={activeMenuItem === query ? 'medium' : 'normal'}
                textDecoration={activeMenuItem === query ? 'underline' : 'none'}
              >
                {label}
              </Text>
            </Link>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default HorizontalNavBar;
