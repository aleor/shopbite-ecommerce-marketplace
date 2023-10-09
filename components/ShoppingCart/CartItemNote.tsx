import { useState } from 'react';
import { HiPencil } from 'react-icons/hi';

import { Button, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react';

import CharCounter from '../CharCounter';

const CartItemNote = ({
  note = '',
  onChange,
  disabled,
}: {
  note: string;
  onChange: (e: string) => void;
  disabled?: boolean;
}) => {
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState(note);

  if (editable) {
    return (
      <InputGroup size="sm">
        <Input
          borderRadius="8px"
          maxLength={60}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          _focus={{ outline: 'none' }}
          _hover={{ borderColor: 'inherit' }}
          placeholder="Add a note"
          fontSize="12px"
          size="sm"
          autoFocus
          borderRight="none"
          disabled={disabled}
          onBlur={() => {
            setEditable(false);
            onChange(value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditable(false);
              onChange(value);
            }
          }}
        />
        <InputRightAddon
          borderRightRadius="8px"
          backgroundColor="white"
          borderLeft="none"
          children={<CharCounter value={value} />}
        />
      </InputGroup>
    );
  }

  return (
    <Button
      leftIcon={<HiPencil />}
      variant="unstyled"
      color="brand.green"
      width="100%"
      maxWidth="100%"
      display="flex"
      justifyContent="flex-start"
      _focus={{ outline: 'none' }}
      size="sm"
      disabled={disabled}
      onClick={() => setEditable(true)}
      textOverflow="ellipsis"
      overflow="hidden"
      whiteSpace="break-spaces"
    >
      <Text
        color={disabled ? 'gray.200' : note ? 'brand.green' : 'brand.black40'}
        fontSize="12px"
        fontFamily="poppins"
        fontWeight="normal"
        noOfLines={2}
        textAlign="left"
        wordBreak="break-word"
      >
        {note || 'add notes'}
      </Text>
    </Button>
  );
};

export default CartItemNote;
