import { Field } from 'formik';

import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

import { validators } from '../../libs/validators';

export const EmailField = ({ disabled = false }) => {
  return (
    <Field name="email" validate={validators.email}>
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.email && form.touched.email}>
          <FormLabel htmlFor="email" fontSize="xs">
            Email
          </FormLabel>
          <Input
            {...field}
            id="email"
            type="email"
            disabled={disabled}
            errorBorderColor="brand.red"
          />
          <FormErrorMessage fontSize="xs" color="brand.red">
            {form.touched.email && form.errors.email}
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
