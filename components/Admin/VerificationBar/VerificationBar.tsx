import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { Flex, HStack, Icon, Stack } from '@chakra-ui/react';

const VerificationBar = ({ children }) => {
  return (
    <Flex flex="1" backgroundColor="#D6D6D640">
      <HStack
        px="4"
        py="2"
        fontFamily="poppins"
        fontSize="12px"
        color="brand.error"
      >
        <Icon as={HiOutlineExclamationCircle} w="20px" h="20px" />
        <Stack
          spacing={{ base: '1', sm: '0.5', md: '1' }}
          flexWrap="wrap"
          direction={{ base: 'row', sm: 'column', md: 'row' }}
        >
          {children}
        </Stack>
      </HStack>
    </Flex>
  );
};

export default VerificationBar;
