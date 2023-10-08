import Head from 'next/head';
import { useRouter } from 'next/router';
import { lazy, Suspense } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Center, HStack, Spinner, Text } from '@chakra-ui/react';

import { auth } from '../firebase/auth';

const AdminPage = lazy(() => import('../components/Admin/AdminPage'));

const Admin = () => {
  const [user, userLoading, userError] = useAuthState(auth);
  const router = useRouter();

  if (!user && !userLoading) {
    router.push('/signin');
    return null;
  }

  if (userError) {
    console.error(userError);

    return (
      <Center pt="10">
        <Text>Terjadi kesalahan, harap mencoba kembali</Text>
      </Center>
    );
  }

  if (userLoading) {
    return (
      <Center pt="10">
        <HStack spacing="4">
          <Spinner color="brand.blue"></Spinner>
          <Text>Harap menunggu...</Text>
        </HStack>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>{`${user.email} | Shopbite`}</title>
      </Head>

      <Suspense
        fallback={
          <Center pt="10">
            <HStack spacing="4">
              <Spinner color="brand.blue"></Spinner>
              <Text>Memuat panel admin...</Text>
            </HStack>
          </Center>
        }
      >
        <AdminPage />
      </Suspense>
    </>
  );
};

export default Admin;
