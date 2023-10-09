import { browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { Form, Formik } from 'formik';
import NextHeader from 'next/head';
import NextLink from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { Box, Button, HStack, Icon, Link, Stack, Text } from '@chakra-ui/react';

import AuthForm from '../components/Forms/AuthForm';
import { EmailField } from '../components/Forms/EmailField';
import { PasswordField } from '../components/Forms/PasswordField';
import { RememberMeCheckbox } from '../components/Forms/RememberMeCheckbox';
import { auth } from '../firebase/auth';

const SignIn = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [currentUser, isLoadingCurrentUser] = useAuthState(auth);

  const [isFormAutofilled, setIsFormAutofilled] = useState(false);

  /**
   * Workaround to detect autofilled fields, as they are not detected by
   * react / formik due to security reasons along with
   * implementation specific for controlled components.
   */
  useEffect(() => {
    const checkAutofilled = () => {
      const emailAutofilled = !!document
        .getElementById('email')
        ?.matches('*:-webkit-autofill');

      const passwordAutofilled = !!document
        .getElementById('password')
        ?.matches('*:-webkit-autofill');

      setIsFormAutofilled(emailAutofilled && passwordAutofilled);
    };
    setTimeout(checkAutofilled, 500);
  }, []);

  useEffect(() => {
    if (currentUser) {
      Router.push('/admin');
    }
  }, [currentUser]);

  if (isLoadingCurrentUser || currentUser) {
    return null;
  }

  const signIn = async ({ email, password, rememberMe }) => {
    await signInWithEmailAndPassword(email, password);
    auth.setPersistence(
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  };

  return (
    <>
      <NextHeader>
        <style>{'body { background-color:  #EDF2F7 !important; }'}</style>
      </NextHeader>
      <AuthForm>
        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberMe: false,
          }}
          onSubmit={signIn}
        >
          {(props) => (
            <Form spellCheck="false">
              <Stack spacing="4">
                <EmailField disabled={loading} />

                <PasswordField disabled={loading} />

                <HStack
                  fontFamily="source"
                  fontWeight="normal"
                  justify="space-between"
                >
                  <RememberMeCheckbox disabled={loading} />

                  <Box minW="fit-content">
                    <NextLink href="/resetpassword">
                      <Link fontSize="md">Reset password</Link>
                    </NextLink>
                  </Box>
                </HStack>

                <HStack color="brand.error" fontSize="xs" pt="1" height="4">
                  {error && (
                    <>
                      <Icon as={HiOutlineExclamationCircle} />
                      <Text color="brand.error">
                        Wrong e-mail or password
                      </Text>
                    </>
                  )}
                </HStack>

                <Stack spacing="4" pt="4">
                  <Button
                    type="submit"
                    isLoading={loading}
                    isDisabled={
                      isFormAutofilled ? false : !props.dirty || !props.isValid
                    }
                  >
                    Login
                  </Button>
                  <HStack
                    fontFamily="source"
                    spacing="1"
                    justify="center"
                    fontSize="sm"
                  >
                    <Text>Don't have an account yet?</Text>
                    <NextLink href="register">
                      <Text>
                        <Link>Create</Link> one for free
                      </Text>
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

export default SignIn;
