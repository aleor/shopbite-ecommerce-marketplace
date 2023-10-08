import type { ComponentStyleConfig } from '@chakra-ui/theme';

export const Button: ComponentStyleConfig = {
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 3,
    },
    md: {
      fontSize: 'md',
      px: 6,
      py: 4,
    },
  },
  variants: {
    primary: {
      background: 'brand.green',
      color: 'white',
      padding: '8px 23px',
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'medium',
      _hover: {
        background: '#469b9b',
        _disabled: {
          background: 'brand.gray',
        },
      },
      _focus: {
        outline: 'none',
        boxShadow: 'none',
      },
      _disabled: {
        background: 'brand.gray',
        opacity: 1,
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};
