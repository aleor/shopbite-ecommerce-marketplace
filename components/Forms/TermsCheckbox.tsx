import { Field } from 'formik';
import NextLink from 'next/link';

import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Link,
  Text,
} from '@chakra-ui/react';

export const TermsCheckbox = ({ disabled = false }) => {
  return (
    <Field
      name="terms"
      validate={(checked) => {
        return !checked
          ? 'Anda harus menyetujui syarat ketentuan dan kebijakan privasi kami untuk mendaftar'
          : undefined;
      }}
    >
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.terms && form.touched.terms}>
          <Checkbox
            fontFamily="source"
            fontWeight="normal"
            name="terms"
            disabled={disabled}
            {...field}
            onChange={(e) => {
              form.setFieldValue('terms', e.target.checked);
            }}
          >
            <Text>
              Dengan mendaftarkan akun, maka Anda menyetujui{' '}
              <NextLink href="/terms">
                <Link>Syarat dan Ketentuan</Link>
              </NextLink>{' '}
              dan{' '}
              <NextLink href="/privacypolicy">
                <Link>Kebijakan Privasi</Link>
              </NextLink>{' '}
              kami
            </Text>
          </Checkbox>
          <FormErrorMessage fontSize="xs" color="brand.red">
            {form.errors.terms}
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
