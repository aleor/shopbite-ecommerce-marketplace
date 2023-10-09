import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { HStack, Icon, Text } from '@chakra-ui/react';

const UnavailableItemMessage = () => {
  return (
    <HStack color="brand.error" fontSize="md" height="4">
      <>
        <Icon as={HiOutlineExclamationCircle} w="20px" h="20px" />
        <Text color="brand.error">This product is currently unavailable</Text>
      </>
    </HStack>
  );
};

export default UnavailableItemMessage;
