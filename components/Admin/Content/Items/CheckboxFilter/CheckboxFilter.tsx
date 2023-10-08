import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import {
    Box, Checkbox, CheckboxGroup, CheckboxGroupProps, FormLabel, Input, InputGroup,
    InputRightElement, Stack, StackProps, useColorModeValue as mode
} from '@chakra-ui/react';

type CheckboxFilterProps = Omit<CheckboxGroupProps, 'onChange'> & {
  hideLabel?: boolean;
  options: Array<{ label: string; value: string; count?: number }>;
  label?: string;
  onChange?: (value: string[]) => void;
  spacing?: StackProps['spacing'];
  showSearch?: boolean;
};

export const CheckboxFilter = (props: CheckboxFilterProps) => {
  const {
    options,
    label,
    hideLabel,
    spacing = '2',
    showSearch,
    ...rest
  } = props;

  const [filteredOptions, setFilteredOptions] = useState(options);
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (!term?.length) {
      setFilteredOptions(options);
      return;
    }

    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(term.toLowerCase())
      )
    );
  }, [term]);

  return (
    <Stack as="fieldset" spacing={spacing}>
      {!hideLabel && (
        <FormLabel fontWeight="semibold" as="legend" mb="0">
          {label}
        </FormLabel>
      )}
      {showSearch && (
        <InputGroup size="md" pb="1">
          <Input
            placeholder="Cari..."
            rounded="md"
            focusBorderColor={mode('blue.500', 'blue.200')}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <InputRightElement
            pointerEvents="none"
            color="gray.400"
            fontSize="lg"
          >
            <FiSearch />
          </InputRightElement>
        </InputGroup>
      )}
      <CheckboxGroup {...rest}>
        {filteredOptions.map((option) => (
          <Checkbox key={option.value} value={option.value} colorScheme="blue">
            <span>{option.label}</span>
            {option.count != null && (
              <Box as="span" color="gray.500" fontSize="sm">
                {' '}
                ({option.count})
              </Box>
            )}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </Stack>
  );
};
