import { Box } from '@chakra-ui/react';

import { Logo } from '../Icons/Logo';

const HeaderLogo = () => {
  return (
    <Box
      boxShadow="0px 4px 15px rgba(0, 0, 0, 0.04)"
      background="white"
      py={{ base: 4, sm: 2, md: 4 }}
      px={{ base: 8, sm: 4, md: 8 }}
    >
      <a href="/">
        <Logo
          width={{ base: '135px', sm: '90px', md: '135px' }}
          height={{ base: '30px', sm: '20px', md: '30px' }}
        />
      </a>
    </Box>
  );
};

export default HeaderLogo;
