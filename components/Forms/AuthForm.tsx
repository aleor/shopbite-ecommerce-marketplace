import { Box, Center, Container } from '@chakra-ui/react';

import { Logo } from '../Icons/Logo';

const AuthForm = ({ children }) => {
  return (
    <Container
      maxW="xl"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Box
        py={{ base: '0', sm: '6', md: '8' }}
        px={{ base: '4', sm: '4', md: '10' }}
        backgroundColor="white"
        boxShadow={{ base: 'none', sm: 'md', md: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl', md: 'xl' }}
      >
        <Center marginTop="4" marginBottom="12">
          <a href="/">
            <Logo width="135px" height="30px" />
          </a>
        </Center>
        {children}
      </Box>
    </Container>
  );
};

export default AuthForm;
