import { Field } from 'formik';
import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { validators } from '../../libs/validators';

export const UsernameField = ({ disabled = false }) => {
  const [isValidating, setIsValidating] = useState(false);

  const validate = async (value: string | undefined) => {
    setIsValidating(true);
    await validators.username(value);
    setIsValidating(false);
  };

  return (
    <Field name="username" validate={validators.username}>
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.username && form.touched.username}>
          <FormLabel htmlFor="username" fontSize="xs">
            Username
          </FormLabel>
          <InputGroup>
            <InputLeftElement w="110px" children={<Text>shopbite.co/</Text>} />
            <Input
              {...field}
              id="username"
              disabled={disabled}
              pl="100px"
              errorBorderColor="brand.red"
              placeholder="username"
              onChange={(e) => {
                const lowerCasedValue = e.target.value?.toLowerCase();
                form.setFieldValue('username', lowerCasedValue);
                validate(lowerCasedValue);
              }}
              maxLength="30"
            />
            <InputRightElement>
              {isValidating && (
                <Spinner color="brand.blue" speed="0.65s" size="sm"></Spinner>
              )}
              {!isValidating &&
                form.touched.username &&
                !form.errors.username && (
                  <Icon as={HiCheck} color="brand.green"></Icon>
                )}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage fontSize="xs" color="brand.red">
            {!isValidating && form.errors.username}
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
