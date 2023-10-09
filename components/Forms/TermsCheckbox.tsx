import { Field } from 'formik';
import NextLink from 'next/link';

import { Checkbox, FormControl, FormErrorMessage, Link, Text } from '@chakra-ui/react';

export const TermsCheckbox = ({ disabled = false }) => {
  return (
    <Field
      name="terms"
      validate={(checked) => {
        return !checked
          ? 'You need to agree to our terms & conditions and privacy policy to register'
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
            By registering an account, you agree to our{' '}
              <NextLink href="/terms">
                <Link>Terms and Conditions</Link>
              </NextLink>{' '}
              and{' '}
              <NextLink href="/privacypolicy">
                <Link>Privacy Policy</Link>
              </NextLink>{' '}
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
