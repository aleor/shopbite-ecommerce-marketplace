import { Form, Formik } from 'formik';
import NextHeader from 'next/head';
import { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';

import AuthForm from '../components/Forms/AuthForm';
import { EmailField } from '../components/Forms/EmailField';
import { auth } from '../firebase/auth';

const ResetPassword = () => {
  const [sent, setSent] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async ({ email }) => {
    setSent(false);
    await sendPasswordResetEmail(email);
    setSent(true);
  };

  return (
    <>
      <NextHeader>
        <style>{'body { background-color:  #EDF2F7 !important; }'}</style>
      </NextHeader>
      <AuthForm>
        <Formik initialValues={{ email: '' }} onSubmit={onSubmit}>
          {(props) => (
            <Form spellCheck="false">
              <Stack spacing="2">
                <Center>
                  <Text fontSize="xxl" fontWeight="semibold">
                    Reset kata sandi
                  </Text>
                </Center>
                <Center>
                  <Text
                    fontFamily="source"
                    fontWeight="normal"
                    fontSize="lg"
                    textAlign="center"
                    pt="2"
                  >
                    Kami akan mengirimkan sebuah email untuk mengatur ulang kata
                    sandi Anda
                  </Text>
                </Center>
                <Box pt="6">
                  <EmailField disabled={sending} />
                </Box>
                {sent && !error && (
                  <HStack color="brand.success" fontSize="xs" pt="3" height="6">
                    <Icon as={HiOutlineCheckCircle} />
                    <Text color="brand.success">
                      Kami telah mengirimkan email pengaturan kata sandi kepada
                      Anda
                    </Text>
                  </HStack>
                )}
                {error && (
                  <HStack color="brand.error" fontSize="xs" pt="3" height="6">
                    <Icon as={HiOutlineExclamationCircle} />
                    <Text color="brand.error">
                      Terjadi kesalahan, pastikan Anda memasukkan email dengan
                      benar dan coba lagi
                    </Text>
                  </HStack>
                )}

                <Stack spacing="4" pt={sent ? 4 : 12} mt="0">
                  <Button
                    type="submit"
                    isLoading={props.isSubmitting}
                    isDisabled={
                      !props.dirty || !props.isValid || sent || sending
                    }
                  >
                    Kirimkan saya email
                  </Button>
                  <Box>
                    <Text fontFamily="source" fontSize="sm" textAlign="center">
                      Mengalami kendala? Hubungi kami di{' '}
                      <Link href="mailto:support@shopbite.co">
                        support@shopbite.co
                      </Link>{' '}
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </AuthForm>
    </>
  );
};

export default ResetPassword;
