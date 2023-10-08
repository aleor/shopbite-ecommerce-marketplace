import React from 'react';

import { Button, ButtonProps, Text } from '@chakra-ui/react';

interface NavButtonProps extends ButtonProps {
  label: string;
}

export const NavButton = (props: NavButtonProps) => {
  const { label, ...buttonProps } = props;
  return (
    <Button
      variant="ghost-on-accent"
      justifyContent="start"
      _focus={{ outline: 'none' }}
      _hover={{ bg: 'brand.green', color: 'white' }}
      _active={{ bg: 'brand.green', color: 'white' }}
      size="lg"
      borderLeftRadius={0}
      borderRightRadius={50}
      {...buttonProps}
    >
      <Text
        color="on-accent-subtle"
        fontSize="16px"
        fontWeight="semibold"
        fontFamily="poppins"
        ml="8"
      >
        {label}
      </Text>
    </Button>
  );
};
