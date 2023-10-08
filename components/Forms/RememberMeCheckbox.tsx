import { Field } from 'formik';

import { Checkbox, FormControl, Text } from '@chakra-ui/react';

export const RememberMeCheckbox = ({ disabled = false }) => {
  return (
    <Field name="rememberMe">
      {({ field, form }) => (
        <FormControl>
          <Checkbox
            fontFamily="source"
            fontWeight="normal"
            name="rememberMe"
            disabled={disabled}
            {...field}
            onChange={(e) => {
              form.setFieldValue('rememberMe', e.target.checked);
            }}
          >
            <Text>Ingat saya</Text>
          </Checkbox>
        </FormControl>
      )}
    </Field>
  );
};
