import Head from 'next/head';

import { Center, Icon, Text, VStack } from '@chakra-ui/react';

import { LogoImage } from '../Icons/LogoImage';

const NotFound = ({ message = 'Page not found' }: { message: string }) => {
  return (
    <>
      <Head>
        <title>{`${message} | Shopbite`}</title>
      </Head>

      <Center height="100vh" width="100wh">
        <VStack spacing={4}>
          <Icon as={LogoImage} width="100px" height="108px" />
          <Text fontWeight="semibold" fontFamily="poppins" fontSize="lg">
            Oh no, {message.toLowerCase()}!
          </Text>
        </VStack>
      </Center>
    </>
  );
};

export default NotFound;
