import {
  AuthError,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import NextHeader from 'next/head';
import NextLink from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import useReactIpLocation from 'react-ip-details';

import { Button, HStack, Icon, Link, Stack, Text } from '@chakra-ui/react';

import AuthForm from '../components/Forms/AuthForm';
import { EmailField } from '../components/Forms/EmailField';
import { PasswordField } from '../components/Forms/PasswordField';
import { TermsCheckbox } from '../components/Forms/TermsCheckbox';
import { UsernameField } from '../components/Forms/UsernameField';
import { auth } from '../firebase/auth';
import { db } from '../firebase/firestore';

const Register = () => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const { ipResponse, currency } = useReactIpLocation();

  const [currentUser, currentUserLoading] = useAuthState(auth);

  useEffect(() => {
    if (!currentUserLoading && currentUser) {
      Router.replace('/admin');
    }
  }, [currentUserLoading]);

  const createUser = async ({ email, password, username }) => {
    setLoading(true);
    setError(undefined);

    try {
      const registeredUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(registeredUser.user);
      await setDoc(doc(db, 'shops', registeredUser.user.uid), {
        username,
        createdAt: Timestamp.fromDate(new Date()),
        modifiedAt: Timestamp.fromDate(new Date()),
        email: registeredUser.user.email,
        isActive: true,
        isVerified: false,
        isAdminBlocked: false,
        profileName: `@${username}`,
        country: ipResponse?.country_code || '',
        currency: 'IDR',
      });

      setLoading(false);
      Router.replace('/admin');
    } catch (error) {
      setError(error as AuthError);
      setLoading(false);
    }
  };

  const displayError = () => {
    if (!error) {
      return null;
    }

    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email ini telah terdaftar';
      case 'auth/invalid-email':
        return 'Email tidak valid';
      case 'auth/invalid-password' || 'auth/user-not-found':
        return 'Email atau sandi salah';
      default:
        return 'Pastikan koneksi internet kamu lancar dan coba lagi';
    }
  };

  if (currentUserLoading) {
    return null;
  }

  return (
    <>
      <NextHeader>
        <style>{'body { background-color:  #EDF2F7 !important; }'}</style>
      </NextHeader>
      <AuthForm>
        <Formik
          initialValues={{
            email: '',
            username: '',
            password: '',
            terms: false,
          }}
          onSubmit={createUser}
          validateOnChange={true}
          validateOnBlur={false}
        >
          {(props) => (
            <Form spellCheck="false">
              <Stack spacing="4">
                <EmailField disabled={loading} />

                <UsernameField disabled={loading} />

                <PasswordField disabled={loading} />

                <TermsCheckbox disabled={loading} />

                <HStack color="brand.error" fontSize="xs" pt="1" height="4">
                  {error && (
                    <>
                      <Icon as={HiOutlineExclamationCircle} />
                      <Text color="brand.error">{displayError()}</Text>
                    </>
                  )}
                </HStack>

                <Stack spacing="4" pt="4">
                  <Button
                    type="submit"
                    isLoading={loading}
                    isDisabled={
                      !props.dirty || !props.isValid || props.isValidating
                    }
                  >
                    Daftarkan Akun
                  </Button>
                  <HStack
                    fontFamily="source"
                    spacing="1"
                    justify="center"
                    fontSize="sm"
                  >
                    <Text>Sudah memiliki akun?</Text>
                    <NextLink href="/signin">
                      <Link>Masuk disini</Link>
                    </NextLink>
                  </HStack>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </AuthForm>
    </>
  );
};

export default Register;
