import type { ComponentStyleConfig } from '@chakra-ui/theme';

export const Alert: ComponentStyleConfig = {
  variants: {
    subtle: {
      title: {
        fontSize: '12px',
      },
      description: {
        fontSize: '12px',
      },
      icon: {
        width: '14px',
        height: '14px',
        marginTop: '5px',
      },
    },
  },
};
