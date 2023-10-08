import { Box, VStack } from '@chakra-ui/react';

export const ShopStatusLayout = ({ children }) => {
  return (
    <Box as="section" px={{ base: '4', md: '6' }} pb="10" minHeight="500px">
      <VStack
        fontSize="lg"
        fontWeight="medium"
        fontFamily="source"
        color="brand.gray"
        spacing="4"
        height="100vh"
        justifyContent="center"
      >
        {children}
      </VStack>
    </Box>
  );
};
