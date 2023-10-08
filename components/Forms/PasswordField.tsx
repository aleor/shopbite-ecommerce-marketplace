import { Field } from 'formik';
import * as React from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import {
    FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputProps,
    InputRightElement, useDisclosure, useMergeRefs
} from '@chakra-ui/react';

import { validators } from '../../libs/validators';

export const PasswordField = React.forwardRef<
  HTMLInputElement,
  InputProps & { disabled?: boolean }
>((props, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const mergeRef = useMergeRefs(inputRef, ref);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <Field name="password" validate={validators.password}>
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.password && form.touched.password}>
          <FormLabel htmlFor="password" fontSize="xs">
            Password
          </FormLabel>
          <InputGroup>
            <Input
              id="password"
              ref={mergeRef}
              name="password"
              type={isOpen ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={props.disabled}
              {...field}
            />
            <InputRightElement>
              <IconButton
                variant="link"
                aria-label={isOpen ? 'Mask password' : 'Reveal password'}
                icon={isOpen ? <HiEye /> : <HiEyeOff />}
                onClick={onClickReveal}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage fontSize="xs" color="brand.red">
            {form.errors.password}
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
});

PasswordField.displayName = 'PasswordField';
